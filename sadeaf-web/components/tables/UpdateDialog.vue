<template>
  <el-dialog :title="`Edit ${schema} ${values.id}`" :visible="visible" v-on="$listeners">
    <!-- Render form fields for the row's values -->
    <el-form :model="form" label-width="120px">
      <el-form-item v-for="(fieldValue, fieldKey) in values"
                    v-if="shouldShowField(fieldKey)"
                    :label="getField(fieldKey).label || fieldKey">
        <el-input v-if="typeOf(fieldKey) === 'string'"
                  :value="fieldValue"
                  :disabled="isDisabled(fieldKey)"
                  v-model="form[fieldKey]" />
        <el-input-number v-else-if="typeOf(fieldKey) === 'int'"
                         :disabled="isDisabled(fieldKey)"
                         v-model="form[fieldKey]" />
        <el-input-number v-else-if="typeOf(fieldKey) === 'float' || typeOf(fieldKey) === 'numeric'"
                         :precision="2"
                         :disabled="isDisabled(fieldKey)"
                         v-model="form[fieldKey]" />
        <el-switch v-else-if="typeOf(fieldKey) === 'bool'"
                   :disabled="isDisabled(fieldKey)"
                   v-model="form[fieldKey]" />
        <el-date-picker v-else-if="typeOf(fieldKey) === 'timestamp'"
                        v-model="form[fieldKey]"
                        :disabled="isDisabled(fieldKey)"
                        type="datetime" />
        <el-select v-else-if="typeOf(fieldKey) === 'enum'"
                   :multiple="getField(fieldKey).multiple"
                   v-model="form[fieldKey]"
                   :disabled="isDisabled(fieldKey)"
                   filterable
                   clearable>
          <el-option v-for="value in getField(fieldKey).enum"
                     :key="'opt-' + value"
                     :value="value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onConfirm">Confirm</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import crudTree from '../../common/types/CrudTree';

const UPDATE_TIMESTAMP_FIELDS = new Set([
  'created_at', 'updated_at'
])

export default {
  name: "UpdateDialog",
  props: {
    schema: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    values: {
      type: Object,
      required: false,
      default: {}
    },
    index: {
      type: Number,
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    }
  },

  data() {
    return {
      fieldsByKey: {},
      disabledFields: new Set(),
      form: {},
      original: {},
    }
  },

  created() {
    const role = this.role;
    const schema = this.schema;
    let selectFields = crudTree.getRoleSchemaPermittedSelectFields({ role, schema });
    if (selectFields) {
      selectFields = Object.values(selectFields);
      const updateFields = crudTree.getRoleSchemaPermittedUpdateFields({ role, schema });
      this.disabledFields = new Set(
        selectFields
          .map(field => field.name)
          .filter(fieldName => !updateFields[fieldName])
      );
      for (const field of selectFields) {
        this.fieldsByKey[field.name] = field;
      }
    }
  },

  methods: {
    getField(fieldKey) {
      return this.fieldsByKey[fieldKey] || {};
    },
    typeOf(fieldKey) {
      return this.getField(fieldKey).type;
    },
    shouldShowField(fieldKey) {
      return !this.isMetaDataField(fieldKey);
    },
    isMetaDataField(fieldKey) {
      return (
        fieldKey in this.fieldsByKey &&
        UPDATE_TIMESTAMP_FIELDS.has(fieldKey) ||
        fieldKey.endsWith('_id') ||
        fieldKey.startsWith('__')
      );
    },
    isDisabled(fieldKey) {
      return this.disabledFields.has(fieldKey) || fieldKey === 'id';
    },
    setFields(values) {
      for (const key in values) {
        const value = values[key];
        this.original[key] = value;
        this.$set(this.form, key, value);
      }
    },
    onUpdate(newFieldValuesByFieldKey) {
      for (const key in newFieldValuesByFieldKey) {
        const value = newFieldValuesByFieldKey[key];
        this.$set(this.form, key, value);
      }
    },
    onConfirm() {
      const form = this.form;
      const original = this.original;

      const newValues = {};

      if (this.createMode) {
        for (const fieldKey in form) {
          newValues[fieldKey] = form[fieldKey];
        }
      } else {
        for (const fieldKey in form) {
          const newValue = form[fieldKey];
          const oldValue = original[fieldKey];
          if (newValue !== oldValue) {
            newValues[fieldKey] = newValue;
          }
        }
      }
      this.$emit('confirm', newValues, this.index, this.values);
    },
    onCancel() {
      this.$emit('close');
    }
  },

  watch: {
    values(val) {
      if (val && Object.keys(val).length > 0) {
        this.setFields(val);
      }
    }
  }
};
</script>

<style scoped>

</style>
