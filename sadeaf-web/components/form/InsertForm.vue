<template>
  <el-form :model="form" :label-width="labelWidth + 'px'">
    <el-form-item v-for="(field, fieldKey) in fieldsByKey"
                  v-if="shouldShowField(fieldKey)"
                  :label="fieldKey"
                  style="margin-top: 8px;">
      <el-input v-if="field.type === Type.string"
                v-model="form[fieldKey]" />
      <el-input-number v-else-if="field.type === Type.int"
                       v-model="form[fieldKey]" />
      <el-input-number v-else-if="field.type === Type.float || field.type === Type.numeric"
                       :precision="2"
                       v-model="form[fieldKey]" />
      <el-switch v-else-if="field.type === Type.boolean"
                 v-model="form[fieldKey]" />
      <el-date-picker v-else-if="field.type === Type.timestamp"
                      v-model="form[fieldKey]"
                      type="datetime" />
      <el-select v-else-if="field.type === 'enum'"
                                                :multiple="getField(fieldKey).multiple"
                                                v-model="form[fieldKey]"
                                                filterable
                                                clearable>
                                                <el-option v-for="value in getField(fieldKey).enum"
                                                :key="'opt-' + value"
                                                :value="value" />
                                                </el-select>
      <!-- For setting a reference to a parent entity -->
      <div v-else-if="field.type === Type.object && field.rel === Relationship.belongsTo">
        <div v-if="nestedForms[field.ref].visible" class="nested">
          <el-button @click="handleInsertNestedObjectCancelClick(field)"
                     icon="el-icon-close"
                     class="close-form-btn"
                     type="danger"
                     circle />
          <insert-form :schema="field.ref"
                       :role="role"
                       :exclude-fields="[schema]"
                       @change="values => handleInsertSingleNestedObject(field, values)"
                       :show-form-buttons="false"
                       :label-width="labelWidth" />
        </div>
        <div v-else-if="form[field.ref]" class="nested">
          <el-button @click="handleInsertNestedObjectCancelClick(field)"
                     icon="el-icon-close"
                     class="close-form-btn"
                     type="danger"
                     circle />
          <pre>{{ JSON.stringify(form[field.ref]) }}</pre>
        </div>
        <div v-else>
          <entity-search :schema="field.ref"
                         :role="role"
                         @select="item => handleInsertParentObjectSelect(field, item)" />
          <el-button @click="handleInsertNestedObjectClick(field, schema)"
                     icon="el-icon-plus" />
        </div>
      </div>
      <!-- For creating one instance of a child entity -->
      <div v-else-if="field.type === Type.object && field.rel === Relationship.hasOne">
        <div v-if="nestedForms[field.ref].visible" class="nested">
          <el-button @click="handleInsertNestedObjectCancelClick(field)"
                     icon="el-icon-close"
                     class="close-form-btn"
                     type="danger"
                     circle />
          <insert-form :schema="field.ref"
                       :role="role"
                       :exclude-fields="[schema]"
                       @change="values => handleInsertSingleNestedObject(field, values)"
                       :show-form-buttons="false"
                       :label-width="labelWidth" />
        </div>
        <el-button v-else
                   @click="handleInsertNestedObjectClick(field, schema)"
                   icon="el-icon-plus" />
      </div>
      <!-- For creating multiple instances of a child entity -->
      <div v-else-if="field.type === Type.array && field.rel === Relationship.hasMany">
        <h1>Has Many</h1>
      </div>
    </el-form-item>
    <el-form-item v-if="showFormButtons">
      <el-button type="primary" @click="onConfirm">Confirm</el-button>
      <el-button @click="onCancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * BELONGS-TO relationship insertion
 * 1. User selects parent entity with search box -> parent entity `id` obtained
 * 2. Insert child entity with `{ParentSchema}_id` obtained from selection at step 1
 *
 * HAS-ONE relationship insertion
 * Due to a [Hasura limitation](https://github.com/hasura/graphql-engine/issues/4366),
 * nested insertion has to happen in 2 steps -> parent then child
 *   1. Insert parent entity (primitive fields only), returning `id`
 *   2. Insert child entity with `{ParentSchema}_id` obtained from insertion at step 1
 *
 * HAS-MANY relationship insertions
 * Like HAS-ONE, but with Hasura's "insert multiple" mutation
 */
import { Type, MetaFields, Relationship } from '../../common/types';
import crudTree from '../../common/types/CrudTree';
import CrudTable from "../tables/CrudTable";
import { buildGraphQLInsert } from "../../common/types/GraphqlCrudManager";
import EntitySearch from "./EntitySearch";

export default {
  name: "InsertForm",
  components: {EntitySearch, CrudTable},
  props: {
    schema: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    excludeFields: {
      type: Array,
      required: false,
      default: null,
    },
    labelWidth: {
      type: Number,
      required: false,
      default: 150,
    },
    showFormButtons: {
      type: Boolean,
      required: false,
      default: true,
    }
  },

  data() {
    return {
      fieldsByKey: {},
      form: {},
      nestedForms: {},
      Type,
      MetaFields,
      Relationship,
    }
  },

  created() {
    this.setFields();
  },

  methods: {
    getField(fieldKey) {
      return this.fieldsByKey[fieldKey] || {};
    },
    setFields() {
      const role = this.role;
      const schema = this.schema;
      const excludeFields = this.excludeFields;
      const insertFields = crudTree.getRoleSchemaPermittedInsertFields({ role, schema });
      console.log('insertFields => ', insertFields);
      if (insertFields) {
        for (const fieldRef in insertFields) {
          const field = insertFields[fieldRef];

          if (field.name === 'id' ||
              excludeFields && excludeFields.includes(field.name)) {
            continue;
          }

          this.fieldsByKey[field.name] = field;
          this.$set(this.form, field.name, null);

          if (field.type === Type.object) {
            this.$set(this.nestedForms, field.name, { visible: false, name: field.name });
          }
        }
        this.$watch('form', (newVal) => this.$emit('change', newVal), { deep: true });
      }
    },
    shouldShowField(fieldKey) {
      return !this.isMetaDataField(fieldKey);
    },
    isMetaDataField(fieldKey) {
      return (
        fieldKey in this.MetaFields ||
        fieldKey in this.fieldsByKey &&
        fieldKey.endsWith('_id') ||
        fieldKey.startsWith('__')
      );
    },
    onUpdate(newFieldValuesByFieldKey) {
      for (const key in newFieldValuesByFieldKey) {
        const value = newFieldValuesByFieldKey[key];
        this.$set(this.form, key, value);
      }
    },
    async onConfirm() {
      const form = this.form;
      const schema = this.schema;
      const role = this.role;

      const newValues = {};
      for (const fieldKey in form) {
        const value = form[fieldKey];
        if (value) {
          newValues[fieldKey] = value;
        }
      }
      await this.graphqlInsert(schema, role, newValues);
      // TODO:
      // 1. Insert parent entity
      // 2. Then, insert all children
      this.$emit('confirm', newValues);
    },
    onCancel() {
      this.$emit('close');
    },
    async graphqlInsert(schema, role, values) {
      const fieldsByKey = crudTree.getRoleSchemaPermittedInsertFields({ role, schema });

      const insertMutation = buildGraphQLInsert({ schema, role, values });
      const result = await this.$apollo.mutate({ mutation: insertMutation });

      if (result && result.data) {
        const id = result.data['insert_' + schema + '_one'].id;
        for (const fieldName in values) {
          const field = fieldsByKey[fieldName];
          if (field.rel === Relationship.hasOne) {
            const nestedValues = values[fieldName];
            // Some fields are optional
            if (nestedValues) {
              nestedValues[schema + '_id'] = id;
              await this.graphqlInsert(field.ref, role, nestedValues);
            }
          }
        }
      }
    },
    handleInsertNestedObjectCancelClick(field) {
      this.nestedForms[field.ref].visible = false;
      this.form[field.ref] = null;
    },
    handleInsertNestedObjectClick(field, parentSchema) {
      this.nestedForms[field.ref].visible = true;
    },
    handleInsertSingleNestedObject(field, values) {
      this.form[field.ref] = values;
    },
    handleInsertParentObjectSelect(field, item) {
      this.form[field.name + '_id'] = item.id;
      this.form[field.name] = item;
    }
  },

  watch: {
    schema(val) {
      if (val) {
        this.setFields();
      }
    },
    role(val) {
      if (val) {
        this.setFields();
      }
    },
  }
};
</script>

<style scoped>
.nested {
  position: relative;
  background: white;
  box-shadow: inset 2px 2px 10px #d4e0ec;
  padding: 18px;
  margin-top: 6px;
  border-radius: 6px;
  overflow: scroll;
}
.close-form-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12px;
  width: 12px;
  font-size: 10px;
  text-align: center !important;
  line-height: 8px;
  padding: 4px;
}
</style>
