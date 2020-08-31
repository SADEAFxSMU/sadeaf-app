const { Type } = require('./index');
const crudTree = require('./CrudTree');
const gql = require('graphql-tag');

class GraphqlCrudManager {

  __indentLevel = 2;

  /**
   *
   * @param {CrudTree} crudTree
   */
  constructor(crudTree) {
    this.__crudTree = crudTree;
  }

  /**
   *
   * @param schema
   * @param role
   * @param depth
   * @returns {string}
   */
  buildGraphQLQuery = ({ schema, role, depth = 1 }) => {
    depth--;
    const visited = new Set();
    this.__indentLevel = depth + 1;
    const graphQLQuery = 'query {\n' +
      this.__buildGraphQLQueryRecursive(schema, role, false, visited, depth)
    + '\n}';
    this.__indentLevel = 2;
    console.log('\n------------------ QUERY -----------------\n' + graphQLQuery);
    return gql`${graphQLQuery}`;
  }

  /**
   * TODO
   * @param schema
   * @param role
   * @param {{string: *}} values - values by field name
   * @return string | null
   */
  buildGraphQLInsert = ({ schema, role, values }) => {
    return this.__buildGraphQLInsert(schema, role, values);
  }

  __buildGraphQLInsert = (schema, role, values) => {
    console.log(`${schema}.${role} Inserting => `, values);

    if (!schema || !role || !values) {
      return null
    }

    const fieldDefs = this.__crudTree.getRoleSchemaPermittedInsertFields({ role, schema });

    const primitiveFields = {};
    const nestedFields = {};
    Object.entries(values).forEach(([fieldName, value]) => {
      const schemaRef = fieldName;
      const field = fieldDefs[schemaRef];
      if (field && this.__isNestedField(field)) {
        nestedFields[fieldName] = { schemaRef, values: value };
      } else {
        primitiveFields[fieldName] = value;
      }
    })

    console.log('primitives => ', primitiveFields);

    let query;

    if (fieldDefs && this.__verifyFieldsPermissions(primitiveFields, fieldDefs)) {
      const objectFieldLines = this.__objectToGraphqlFieldsString(primitiveFields, fieldDefs);
      query = `
      mutation insert_single_${schema} {
        insert_${schema}_one(
          object: {
            ${objectFieldLines}
          }
        ) { id }
      }`;
      console.log('--------- INSERT ---------');
      console.log(query);
    }

    return gql`${query}`;
  }

  __buildGraphQLInsertQueue = () => {

  }


  /**
   *
   * @param {string} schema
   * @param {string} role
   * @param {int} pk
   * @param {{string: any}} newValues -
   * @returns {string | null}
   */
  buildGraphQLUpdate = ({ schema, role, pk, newValues}) => {
    const id = pk;

    if (!id) {
      throw Error('Missing required pk for GraphQL Update operation');
    }

    const fieldDefs = this.__crudTree.getRoleSchemaPermittedUpdateFields({ role, schema });
    if (fieldDefs && this.__verifyFieldsPermissions(newValues, fieldDefs)) {
      const _setFieldLines = this.__objectToGraphqlFieldsString(newValues, fieldDefs);

      const query = `
      mutation {
        update_${schema}_by_pk(
          pk_columns: { id: ${id} }
          _set: {
            ${_setFieldLines}
          }
        ) { id }
      }`;
      console.log(query);

      return gql`${query}`;
    }
    return null;
  }

  /**
   *
   * @param {{string: any}} object - object to transform into a GraphQL "fields" string
   * @param {{string: Object}} fieldDefs - definition of the fields
   * @return {string}
   * @private
   */
  __objectToGraphqlFieldsString = (object, fieldDefs) => {
    return Object.entries(object)
      .filter(([_, value]) => value)
      .map(([fieldName, value]) => fieldName + ': ' + this.__formatValueForGraphqlQueryString(fieldDefs[fieldName].type, value))
      .join(', ');
  }

  __formatValueForGraphqlQueryString = (type, value) => {
    switch (type) {
      case Type.string:
        return '"' + value + '"';
      case Type.timestamp:
        return '"' + value.toISOString() + '"';
      case Type.int:
      default:
        console.log(type, value);
        return value;
    }
  }

  /**
   *
   * @param {string} schema
   * @param {string} role
   * @param {int} pk
   */
  buildGraphQLDelete = ({ schema, role, pk }) => {
    const id = pk;

    if (!id) {
      throw Error('Missing required pk for GraphQL Delete operation');
    }

    if (this.__crudTree.isRolePermittedToDeleteForSchema({ role, schema })) {
      // Include all fields in the deleted object response by default
      const selectFieldsDefs = this.__crudTree.getRoleSchemaPermittedSelectFields({ role, schema });
      let returningFields = '';
      for (const fieldDef of Object.values(selectFieldsDefs)) {
        if (!this.__isNestedField(fieldDef)) {
          returningFields += fieldDef.name + ', ';
        }
      }

      const query = `
      mutation delete_${schema}_single {
        delete_${schema}_by_pk (
          id: ${id}
        ) {
          ${returningFields}
        }
      }`;

      console.log(query);

      return gql`${query}`;
    }
  }

  /**
   *
   * @param schema
   * @param role
   * @param isArrayRelationship
   * @param __visited
   * @param __depth
   * @private
   */
  __buildGraphQLQueryRecursive = (schema, role, isArrayRelationship, __visited, __depth) => {
    __visited.add(schema);

    let fields = this.__crudTree.getRoleSchemaPermittedSelectFields({ role, schema });

    if (!fields || fields.length === 0) {
      return null;
    } else {
      fields = Object.values(fields);
    }

    let nestedQueries = [];
    fields.forEach(field => {
      if (this.__isNestedField(field) && !__visited.has(field.ref) && __depth > 0) {
        const nestedQuery = this.__buildGraphQLQueryRecursive(field.ref, role, this.__isArray(field), __visited, __depth - 1);
        if (nestedQuery) {
          nestedQueries.push(nestedQuery);
        }
      }
    });

    let primitiveFields = fields.filter(field => !this.__isNestedField(field));

    let schemaName = schema;
    if (isArrayRelationship) {
      schemaName += 's';
    }

    return this.__buildGraphQLQuerySingular(schemaName, primitiveFields, nestedQueries, __depth);
  }

  __buildGraphQLQuerySingular = (schema, fields, nestedQueries, __depth) => {
    const indent = this.__indent(__depth);
    const fieldIndent = indent + '  ';

    let nestedQueryString = '';
    if (nestedQueries && nestedQueries.length > 0) {
      nestedQueryString = '\n' + nestedQueries.join(fieldIndent + '\n');
    }

    const query = (
      indent + schema + ' {\n' +
      fieldIndent + fields.map(f => f.name).join(', ') +
      nestedQueryString +
      indent + '\n' +
      indent + '}'
    );
    return query;
  }

  /**
   *
   * @param permittedFields
   * @param requestFields
   * @return {Boolean} hasPermission -
   * @private
   */
  __verifyFieldsPermissions = (requestFields, permittedFields) => {
    for (const fieldName in requestFields) {
      if (!permittedFields[fieldName]) {
        console.error('Missing permission for ' + fieldName);
        return false;
      }
    }
    return true;
  }


  /**
   * Helper method to indent the lines in the graphql query string
   * @param depth
   * @returns {string}
   * @private
   */
  __indent = (depth) => {
    return '  '.repeat(this.__indentLevel - depth);
  }

  __isNestedField = (field) => {
    return (field.type === 'array' || field.type === 'object') && field.ref;
  }

  __isArray = (field) => {
    return field.type === 'array';
  }

  __throwMissingPermissionError(schema, role, operation, field = undefined) {
    throw Error(`Missing permission for ${schema}.${role}.${operation}${field ? '.' + field : ''}`);
  }
}

const graphQLCrudManager = new GraphqlCrudManager(crudTree);

module.exports = graphQLCrudManager;
