const crudTree = require('./crud_tree.json');

class CrudTree {

  constructor(crudTree) {
    this.__crudTree = crudTree;
  }

  getRoleSchemaPermittedInsertFields = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'insert');
  }
  getRoleSchemaPermittedSelectFields = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'select');
  }
  getRoleSchemaPermittedUpdateFields = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'update');
  }
  isRolePermittedToDeleteForSchema = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'delete') === true;
  }

  applyToLevel = (level, callback) => {
    this.__applyToLevel(level, this.__crudTree, callback);
  }

  __applyToLevel = (level, tree, callback) => {
    for (const nodeKey in tree) {
      if (tree[nodeKey] && level > 1) {
        this.__applyToLevel(level - 1, tree[nodeKey], callback);
      } else {
        callback(nodeKey, tree[nodeKey]);
      }
    }
  }

  __getSubTree = (...nodes) => {
    if (!nodes || nodes.length === 0) {
      return null;
    }
    let root = this.__crudTree;
    for (const node of nodes) {
      let next = root[node];
      if (!next) {
        return null;
      }
      else {
        root = root[node];
      }
    }
    return root;
  }

}

module.exports = new CrudTree(crudTree);
