const isProd = process.env.node_env === 'production';

const Type = {
  boolean: 'boolean',
  string: 'string',
  int: 'int',
  float: 'float',
  numeric: 'numeric',
  timestamp: 'timestamp',
  object: 'object',
  array: 'array',
};

const Relationship = {
  belongsTo: 'belongsTo',
  hasOne: 'hasOne',
  hasMany: 'hasMany',
};

const MetaFields = {
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

module.exports = {
  Type,
  Relationship,
  MetaFields,
}

