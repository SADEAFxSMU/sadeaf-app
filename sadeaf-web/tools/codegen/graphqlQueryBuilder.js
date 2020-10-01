const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const yaml = require("js-yaml");
const dedent = require("dedent-js");
const _ = require("lodash");

const SELECT = "select";
const UPDATE = "update";
const INSERT = "insert";
const DELETE = "delete";
const OPERATIONS = {
  [SELECT]: {
    exclude: [],
  },
  [INSERT]: {
    exclude: ["id", "created_at", "updated_at"],
  },
  [UPDATE]: {
    exclude: ["id", "created_at", "updated_at"],
  },
  [DELETE]: {
    noColumnLevelPermissions: true,
  },
};

function log(...args) {
  if (OPTIONS.verbose) {
    console.log(...args);
  }
}

const OPTIONS = {
  hasura_tables_path: path.join(__dirname, "..", "..", "..", "sadeaf-hasura", "metadata", "tables.yaml"),
  verbose: false,
};
process.argv.forEach((val, index) => {
  OPTIONS[val] = index;
});

let HASURA_TABLES;
let DOMAIN_SCHEMA_NAMES;
const ROLES = new Set();
try {
  HASURA_TABLES = yaml.safeLoad(fs.readFileSync(OPTIONS.hasura_tables_path, "utf8"));
  DOMAIN_SCHEMA_NAMES = new Set(HASURA_TABLES.map((tableDef) => tableDef.table.name));
} catch (e) {
  console.error(e);
  process.exit(1);
}

class CrudTreeBuilder {
  constructor() {
    this.__graphqlSchemas = {};
    this.__crudTree = {};
    this.__includeTypes = new Set(["bigint", "float8", "Int", "Float", "String", "Boolean", "timestamp", "numeric"]);
  }

  build = async () => {
    const schemas = await this.__getHasuraGraphQLDomainSchemas();
    schemas.forEach(this.registerGraphQLSchema);
    this.addSchemasToCrudTree();
    return this.__crudTree;
  };

  registerGraphQLSchema = (schema) => {
    const { name } = schema;

    if (!this.__graphqlSchemas[name]) this.__graphqlSchemas[name] = {};

    if (!schema.fields) return;

    schema.fields.forEach((field) => {
      const fieldName = field.name;
      let fieldType = field.type.name || field.type.ofType.name;
      let nullable = field.type.kind !== "NON_NULL";

      if (!fieldType) {
        // field is of type 'list' or something else not needed.
        return;
      }

      if (this.__includeTypes.has(fieldType)) {
        this.__graphqlSchemas[name][fieldName] = {
          name: fieldName,
          type: fieldType,
          nullable,
        };
      }
    });
  };

  addSchemasToCrudTree = () => {
    HASURA_TABLES.forEach((schema) => {
      const schemaName = schema.table.name;

      // Give admin permissions to do everything!
      _.keys(OPERATIONS).forEach((operation) => {
        this.addPermittedFields(schemaName, "admin", operation, Object.values(this.__graphqlSchemas[schemaName]));
      });

      _.keys(OPERATIONS).forEach((operation) => {
        const permissions = schema[operation + "_permissions"];

        if (!permissions || permissions.length === 0) return;

        for (const permission of permissions) {
          const { role } = permission;

          ROLES.add(role);

          if (operation === "delete") {
            this.addPermittedField(schemaName, role, operation);
          } else {
            if (permission.permission) {
              if (permission.permission.columns) {
                let columns = permission.permission.columns;
                if (columns === "*") {
                  columns = Object.values(this.__graphqlSchemas[schemaName]).map((field) => field.name);
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
  };

  addPermittedFields = (schema, role, operation, fields) => {
    if (operation === "delete") {
      this.addPermittedField(schema, role, operation);
    } else {
      fields.forEach((field) => this.addPermittedField(schema, role, operation, field));
    }
  };

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
    if (operation === "delete") {
      log(`+ ${schema}.${role}.${operation} = true`);
      schemaRolePermissions[operation] = true;
      return;
    }
    if (!fields) {
      fields = schemaRolePermissions[operation] = {};
    }
    fields[field.name] = field;
    log(`+ ${schema}.${role}.${operation}.${field.name} [${field.type}]`);
  };

  __getHasuraGraphQLDomainSchemas = async () => {
    let data = await fetch("http://localhost:8080/v1/graphql", {
      body:
        '{"query":"\\n    query IntrospectionQuery {\\n      __schema {\\n        queryType { name }\\n        mutationType { name }\\n        subscriptionType { name }\\n        types {\\n          ...FullType\\n        }\\n        directives {\\n          name\\n          description\\n          locations\\n          args {\\n            ...InputValue\\n          }\\n        }\\n      }\\n    }\\n\\n    fragment FullType on __Type {\\n      kind\\n      name\\n      description\\n      fields(includeDeprecated: true) {\\n        name\\n        description\\n        args {\\n          ...InputValue\\n        }\\n        type {\\n          ...TypeRef\\n        }\\n        isDeprecated\\n        deprecationReason\\n      }\\n      inputFields {\\n        ...InputValue\\n      }\\n      interfaces {\\n        ...TypeRef\\n      }\\n      enumValues(includeDeprecated: true) {\\n        name\\n        description\\n        isDeprecated\\n        deprecationReason\\n      }\\n      possibleTypes {\\n        ...TypeRef\\n      }\\n    }\\n\\n    fragment InputValue on __InputValue {\\n      name\\n      description\\n      type { ...TypeRef }\\n      defaultValue\\n    }\\n\\n    fragment TypeRef on __Type {\\n      kind\\n      name\\n      ofType {\\n        kind\\n        name\\n        ofType {\\n          kind\\n          name\\n          ofType {\\n            kind\\n            name\\n            ofType {\\n              kind\\n              name\\n              ofType {\\n                kind\\n                name\\n                ofType {\\n                  kind\\n                  name\\n                  ofType {\\n                    kind\\n                    name\\n                  }\\n                }\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  "}',
      method: "POST",
    });
    data = (await data.json()).data;
    return data.__schema.types.filter((type) => DOMAIN_SCHEMA_NAMES.has(type.name));
  };
}

const capitaliseFirst = (string = "") => {
  return string.charAt(0).toUpperCase() + string.substr(1);
};

function makeGraphqlQuery(schema, fields) {
  return dedent`
    query Query${capitaliseFirst(schema)} {
      ${schema} {
        ${_.keys(fields).join("\n    ")}
      }
    }
  `;
}

function makeGraphqlInsert(schema, fields, returnFields) {
  let params = [];
  let _set = [];
  fields.forEach((field) => {
    const { type, name, nullable } = field;
    const shouldIgnoreField = OPERATIONS[INSERT].exclude.includes(name);

    if (!shouldIgnoreField) {
      params.push(`$${name}: ${type}${!nullable ? "!" : ""}`);
      _set.push(`${name}: $${name}`);
    }
  });
  return dedent`
    mutation Insert${capitaliseFirst(schema)}(
      ${params.join("\n  ")}
    ) {
      insert_${schema}_one(
        object: {
          ${_set.join("\n      ")}
        }
      ) {
        ${returnFields.join("\n    ")}
      }
    }
  `;
}

function makeGraphqlUpdate(schema, paramFields, returnFields) {
  let params = [];
  let _set = [];
  paramFields.forEach((field) => {
    const { type, name } = field;
    params.push(`$${name}: ${type}`);
    _set.push(`${name}: $${name}`);
  });
  return dedent`
    mutation Update${capitaliseFirst(schema)}(
      $id: Int!
      ${params.join("\n  ")}
    ) {
      update_${schema}_by_pk(
        pk_columns: { id: $id }
        _set: {
          ${_set.join("\n      ")}
        }
      ) {
        ${returnFields.join("\n    ")}
      }
    }
  `;
}

function makeGraphqlDelete(schema) {
  return dedent`
    mutation Delete${capitaliseFirst(schema)}($id: Int!) {
      delete_${schema}_by_pk(
        id: $id
      ) {
        id
      }
    }
  `;
}

async function promptForSelectFields(fields, defaultExclude) {
  const { selectedFields } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFields",
      message: `Select Query fields:`,
      choices: fields,
      pageSize: fields.length,
      default: fields.filter((f) => !defaultExclude.includes(f.name)).map((f) => f.name),
    },
  ]);
  return selectedFields;
}

async function promptForUpdateFields(fields, defaultExclude) {
  const { selectedFields } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFields",
      message: `Select Update fields:`,
      choices: fields,
      pageSize: fields.length,
      default: fields.filter((f) => !defaultExclude.includes(f.name)).map((f) => f.name),
    },
  ]);
  return selectedFields;
}

async function promptForInsertFields(fields, defaultExclude) {
  const compulsoryFields = fields.filter((f) => !f.nullable).map((f) => f.name);
  fields = fields.map(({ name, nullable }) => ({
    name,
    disabled: !nullable,
  }));
  const { selectedFields } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFields",
      message: `Select Insert fields:`,
      choices: fields,
      pageSize: fields.length,
      default: fields.filter((f) => !defaultExclude.includes(f.name)).map((f) => f.name),
    },
  ]);
  return compulsoryFields.concat(selectedFields);
}

(async function main() {
  console.log("Performing GraphQL + Hasura Roles introspection...");
  const crudTree = await new CrudTreeBuilder().build();
  const schemas = _.keys(crudTree);
  const { schema, role } = await inquirer.prompt([
    {
      type: "list",
      name: "schema",
      message: "Select schema:",
      choices: schemas,
      pageSize: schemas.length,
    },
    {
      type: "list",
      name: "role",
      message: "Select user role:",
      choices: ["admin", "client", "service_requestor", "volunteer"],
      pageSize: schemas.length,
    },
  ]);

  let schemaRolePermittedOperations = _.keys(crudTree[schema][role]);
  if (schemaRolePermittedOperations.length === 0) {
    console.log(`Role '${role}' cannot touch schema '${schema}'`);
    return;
  }

  const { operations } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "operations",
      message: "Select operations:",
      choices: schemaRolePermittedOperations,
      default: schemaRolePermittedOperations,
    },
  ]);

  let queries = {};

  if (operations.includes(SELECT)) {
    let fields = crudTree[schema][role][SELECT];
    let exclude = OPERATIONS[SELECT].exclude;

    const selectedFields = await promptForSelectFields(_.values(fields), exclude);
    fields = _.pickBy(fields, (_, fieldName) => selectedFields.includes(fieldName));

    queries[SELECT] = makeGraphqlQuery(schema, fields);
  }

  if (operations.includes(INSERT)) {
    let fields = crudTree[schema][role][INSERT];
    let exclude = OPERATIONS[INSERT].exclude;

    const selectedFields = await promptForInsertFields(_.values(fields), exclude);
    const paramFields = _.pickBy(fields, (field, fieldName) => selectedFields.includes(fieldName));

    queries[INSERT] = makeGraphqlInsert(schema, _.values(paramFields), _.keys(fields));
  }

  if (operations.includes(UPDATE)) {
    let fields = crudTree[schema][role][UPDATE];
    let exclude = OPERATIONS[UPDATE].exclude;

    let selectedFields = await promptForUpdateFields(_.values(fields), exclude);
    let paramFields = _.pickBy(fields, (field, fieldName) => selectedFields.includes(fieldName));

    queries[UPDATE] = makeGraphqlUpdate(schema, _.values(paramFields), _.keys(fields));
  }

  if (operations.includes(DELETE)) {
    const hasDeletePermission = crudTree[schema][role][DELETE];
    if (hasDeletePermission) {
      queries[DELETE] = makeGraphqlDelete(schema);
    }
  }

  _.forIn(queries, (query, operation) => {
    console.log("-".repeat(10), operation, "-".repeat(10));
    console.log(query);
  });
})();
