const fetch = require('node-fetch');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { Type, Relationship } = require('./index');

function json(x) {
  return JSON.stringify(x, null, 2);
}

function log(...args) {
  if (OPTIONS.verbose) {
    console.log(...args);
  }
}

const OPTIONS = {
  output_path: path.join(__dirname, 'crud_tree.json'),
  hasura_tables_path: path.join(__dirname, '..', '..', '..', 'sadeaf-hasura', 'metadata', 'tables.yaml'),
  verbose: true,
};
process.argv.forEach((val, index) => {
  OPTIONS[val] = index;
})

log(OPTIONS);

const OPERATIONS = ['select', 'insert', 'update', 'delete'];

let HASURA_TABLES;
let DOMAIN_SCHEMA_NAMES;
const ROLES = new Set();
try {
  HASURA_TABLES = yaml.safeLoad(fs.readFileSync(OPTIONS.hasura_tables_path, 'utf8'));
  DOMAIN_SCHEMA_NAMES = new Set(HASURA_TABLES.map(tableDef => tableDef.table.name));
} catch (e) {
  console.error(e);
  process.exit(1);
}


class CrudTreeBuilder {

  constructor() {
    this.__graphqlSchemas = {};
    this.__crudTree = {};
  }

  build = async () => {
    const schemas = await this.__getHasuraGraphQLDomainSchemas();
    log('Fetched domain schemas from Hasura GraphQL:');
    log(json(schemas), '\n');

    schemas.forEach(this.registerGraphQLSchema);
    schemas.forEach(this.registerGraphQLSchemaRelations);
    this.addSchemasToCrudTree();
    schemas.forEach(this.addNestedObjectsToCrudTree);
    schemas.forEach(this.addNestedListsToCrudTree);


    return this.__crudTree;
  }

  registerGraphQLSchema = (schema) => {
    const { name } = schema;

    if (!this.__graphqlSchemas[name])
      this.__graphqlSchemas[name] = {};

    if (!schema.fields) return;

    schema.fields.forEach(field => {
      const fieldName = field.name;
      let fieldType = field.type.name || field.type.ofType.name;

      if (fieldType) {
        fieldType = fieldType.toLowerCase();
      } else {
        return;
      }

      // Handle primitive types first - nested objects and arrays
      // (relationships) will be handled later
      switch (fieldType) {
        case 'bigint':
          fieldType = 'int';
        case 'float8':
          fieldType = 'float';
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
        case 'timestamp':
        case 'numeric':
          this.__graphqlSchemas[name][fieldName] = {
            name: fieldName,
            type: fieldType
          }
          break;
      }
    });
  }

  registerGraphQLSchemaRelations = (schema) => {
    const parentSchemas = new Set(
      schema.fields
        .filter(field => field.name.endsWith('_id'))
        .map(field => field.name)
    );

    schema.fields.forEach(field => {
      // Handle nested objects -> 1..1 relationship
      if (this.__isObjectField(field)) {
        let relationship;
        if (parentSchemas.has(field.name + '_id')) {
          relationship = Relationship.belongsTo;
        } else {
          relationship = Relationship.hasOne;
        }
        this.__graphqlSchemas[schema.name][field.name] = {
          type: 'object',
          // reference to the schema definition in the crud tree
          ref: field.name,
          name: field.name,
          rel: relationship,
        }
      }

      // Handle nested arrays -> 1..N relationship
      if (this.__isArrayField(field)) {
        this.__graphqlSchemas[schema.name][field.name] = {
          type: 'array',
          // reference to the schema definition in the crud tree
          ref: field.name.substr(0, field.name.length - 1),
          name: field.name,
          rel: Relationship.hasMany,
        }
      }
    });
  }

  addSchemasToCrudTree = () => {
    HASURA_TABLES.forEach(schema => {
      const schemaName = schema.table.name;

      // Give admin permissions to do everything!
      OPERATIONS.forEach(operation => {
        this.addPermittedFields(schemaName, 'admin', operation, Object.values(this.__graphqlSchemas[schemaName]));
      })

      OPERATIONS.forEach(operation => {
        const permissions = schema[operation + '_permissions'];

        if (!permissions || permissions.length === 0) return;

        for (const permission of permissions) {
          const { role } = permission;

          ROLES.add(role);

          if (operation === 'delete') {
            this.addPermittedField(schemaName, role, operation);
          } else {
            if (permission.permission) {
              if (permission.permission.columns) {
                let columns = permission.permission.columns;
                if (columns === '*') {
                  columns = Object.values(this.__graphqlSchemas[schemaName]).map(field => field.name);
                }
                for (const fieldName of columns) {
                  this.addPermittedField(schemaName, role, operation, this.__graphqlSchemas[schemaName][fieldName]);
                }
              }
            }
          }
        }
      });
    });
  }

  addNestedObjectsToCrudTree = (schema) => {
    const parentSchemaRef = schema.name;
    log(`Adding nested objects to '${parentSchemaRef}' schema`);

    const parentSchemas = new Set(
      schema.fields
        .filter(field => field.name.endsWith('_id'))
        .map(field => field.name)
    );

    schema.fields
      .filter(f => this.__isObjectField(f) && DOMAIN_SCHEMA_NAMES.has(f.name))
      .forEach(field => {

        const schemaRef = field.name;
        const relationship = parentSchemas.has(schemaRef + '_id')
          ? Relationship.belongsTo
          : Relationship.hasOne;

        ROLES.forEach(role => {
          let schemaRolePermissions = this.__crudTree[parentSchemaRef][role];
          if (schemaRolePermissions) {
            OPERATIONS
              .filter(p => p !== 'delete')
              .forEach(operation => {
                const permittedFields = schemaRolePermissions[operation];
                if (permittedFields) {
                  const include = Object.keys(permittedFields).filter(f =>
                    f.endsWith('_id') &&
                    f.substr(0, f.length - 3) in this.__crudTree
                  ).includes(schemaRef + '_id');

                  if (include) {
                    permittedFields[schemaRef] = {
                      type: Type.object,
                      name: schemaRef,
                      ref: schemaRef, // Remove?
                      rel: relationship,
                    }
                    log(`\t+ ${parentSchemaRef}.${role}.${operation}.${schemaRef}`);
                    log(`\t  ${parentSchemaRef} ${relationship} ${schemaRef}`);
                  }
                }
              });
          }
        });
      });
    }

    addNestedListsToCrudTree = (schema) => {
    const parentSchemaRef = schema.name;
    log(`Adding nested lists to '${parentSchemaRef}' schema`);

    const parentSchemas = new Set(
      schema.fields
        .filter(field => field.name.endsWith('_id'))
        .map(field => field.name)
    );

    schema.fields
      .filter(f =>
        this.__isArrayField(f) &&
        // Array relationships assumed to have plural form, end with 's'
        DOMAIN_SCHEMA_NAMES.has(f.name.substr(0, f.name.length - 1))
      )
      .forEach(field => {

        const schemaRef = field.name.substr(0, field.name.length - 1);

        ROLES.forEach(role => {
          let schemaRolePermissions = this.__crudTree[parentSchemaRef][role];
          if (schemaRolePermissions) {
            OPERATIONS
              .filter(p => p !== 'delete')
              .forEach(operation => {
                const permittedFields = schemaRolePermissions[operation];
                if (permittedFields) {
                  permittedFields[schemaRef] = {
                    type: Type.array,
                    name: field.name,
                    ref: schemaRef,
                    rel: Relationship.hasMany,
                  }
                  log(`\t+ ${parentSchemaRef}.${role}.${operation}.${schemaRef}`);
                }
              });
          }
        });
      });
  }

  addPermittedFields = (schema, role, operation, fields) => {
    if (operation === 'delete') {
      this.addPermittedField(schema, role, operation);
    } else {
      fields.forEach(field => this.addPermittedField(schema, role, operation, field));
    }
  }

  addPermittedField = (schema, role, operation, field) => {
    let schemaRoles = this.__crudTree[schema];
    if (!schemaRoles) {
      schemaRoles = this.__crudTree[schema] = {};
    }
    let schemaRolePermissions = schemaRoles[role];
    if (!schemaRolePermissions) {
      schemaRolePermissions = schemaRoles[role] = {};
    }

    let fields = schemaRolePermissions[operation];
    if (operation === 'delete') {
      log(`+ ${schema}.${role}.${operation} = true`);
      schemaRolePermissions[operation] = true;
      return;
    }
    if (!fields) {
      fields = schemaRolePermissions[operation] = {};
    }
    fields[field.name] = field;
    log(`+ ${schema}.${role}.${operation}.${field.name} [${field.type}]`);
  }

  async __getHasuraGraphQLDomainSchemas() {
    let data = await fetch("http://localhost:8080/v1/graphql", {
      "body": "{\"query\":\"{\\n  __schema {\\n    types {\\n      name\\n      fields {\\n        name\\n        type {\\n          name\\n          kind\\n          ofType {\\n            name\\n            kind\\n          }\\n        }\\n      }\\n    } \\n  }\\n}\",\"variables\":null}",
      "method": "POST",
    })
    data = (await data.json()).data;
    return data.__schema.types.filter(type => DOMAIN_SCHEMA_NAMES.has(type.name));
  }

  __isArrayField = (field) => {
    return field.type.ofType && field.type.ofType.kind === 'LIST';
  }

  __isObjectField = (field) => {
    return (
      field.type.kind === 'OBJECT' ||
      (field.type.ofType && field.type.ofType.kind === 'OBJECT') &&
      !field.name.endsWith('_aggregate')
    );
  }
}

new CrudTreeBuilder().build().then(result => {
  const tree = json(result);
  fs.writeFileSync('./crud_tree.json', tree);
  log('🌳 CRUD Tree generated!');
});

