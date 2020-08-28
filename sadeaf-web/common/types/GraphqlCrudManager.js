const CrudTree = require('./CrudTree');
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
   * @param {{string: *}} fields - values by field name
   * @return string | null
   */
  buildGraphQLInsert = ({ schema, role, fields }) => {
    const fieldDefs = this.__crudTree.getRoleSchemaPermittedInsertFields({ role, schema });

    if (fieldDefs && this.__verifyFieldsPermissions(fields, fieldDefs)) {
      const objectFieldLines = this.__objectToGraphqlFieldsString(fields, fieldDefs);
      console.log(objectFieldLines);
      const query = `
      mutation insert_single_${schema} {
        insert_${schema}_one(
          object: {
            ${objectFieldLines}
          }
        ) { id }
      }`;
      return gql`${query}`;
    }
    return null;
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
      .map(([fieldName, value]) => fieldName + ': ' + this.__formatValueForGraphqlQueryString(fieldDefs[fieldName].type, value))
      .join(', ');
  }

  __formatValueForGraphqlQueryString = (type, value) => {
    switch (type) {
      case 'string':
        return '"' + value + '"';
      case 'int':
      default:
        return value.toString();
    }
  }

  /**
   *
   * @param schema
   * @param role
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
   * TODO
   * @param schema
   * @param role
   */
  getPrimitiveSelectFields = ({ schema, role }) => {
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

const crudTree = new CrudTree(true);
const graphQLCrudManager = new GraphqlCrudManager(crudTree);

const select = graphQLCrudManager.buildGraphQLQuery({
  schema: 'client',
  role: 'client',
  depth: 1
});



//
// console.log('-------------- UPDATE -------------');
// const update = graphQLCrudManager.buildGraphQLUpdate({
//   schema: 'event',
//   role: 'admin',
//   pk: 1,
//   newValues: {
//     name: "event_" + Date.now(),
//     client_id: 1,
//   }
// });

// const insert = graphQLCrudManager.buildGraphQLInsert({
//   schema: 'event',
//   role: 'admin',
//   fields: {
//     name: "Test event!!",
//     quotation: 100,
//     client_id: 1,
//   }
// });
// console.log(insert);

// const _delete = graphQLCrudManager.buildGraphQLDelete({
//   schema: 'assignment',
//   role: 'client',
//   pk: 1,
// });
// console.log(_delete);


module.exports = {
  buildGraphQLQuery: graphQLCrudManager.buildGraphQLQuery
}
