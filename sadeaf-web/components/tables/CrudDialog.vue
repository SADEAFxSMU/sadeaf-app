<template>
  <el-dialog title="Edit Row" :visible="visible" v-on="$listeners">
    <!-- Render form fields for the row's values -->
    <el-form :model="form" label-width="120px">`
      <el-form-item v-for="(fieldValue, fieldKey) in row"
                    :label="getField(fieldKey).label || fieldKey">
        <el-input v-if="typeOf(fieldKey) === 'string'"
                  :value="fieldValue"
                  v-model="form[fieldKey]" />
        <el-input-number v-else-if="typeOf(fieldKey) === 'int'"
                         v-model="form[fieldKey]" />
        <el-switch v-else-if="typeOf(fieldKey) === 'bool'"
                   v-model="form[fieldKey]" />
        <el-date-picker v-else-if="typeOf(fieldKey) === 'datetime'"
                        v-model="form[fieldKey]"
                        type="datetime" />
        <el-select v-else-if="typeOf(fieldKey) === 'enum'"
                   :multiple="getField(fieldKey).multiple"
                   v-model="form[fieldKey]"
                   filterable
                   clearable>
          <el-option v-for="value in getField(fieldKey).enum"
                     :key="'opt-' + value"
                     :value="value" />
        </el-select>
        <div :is="getField(fieldKey).custom"
             :row="form"
             :editable="true"
             @update="onUpdate"
             v-if="typeOf(fieldKey) === 'custom'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onConfirm">Confirm</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "CrudDialog",
  props: {
    fields: {
      type: Array,
      required: true,
      default: {},
    },
    row: {
      type: Object,
      required: true,
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
      crudDialogHasEdits: false,
      form: {},
      original: {},
    }
  },

  mounted() {
    const fields = this.fields;
    for (const field of fields) {
      this.fieldsByKey[field.name] = field;
    }
  },

  methods: {
    getField(fieldKey) {
      return this.fieldsByKey[fieldKey] || {};
    },
    typeOf(fieldKey) {
      return this.getField(fieldKey).type;
    },
    setFields(row) {
      for (const key in row) {
        const value = row[key];
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
      const changes = {};
      for (const fieldKey in this.form) {
        const newValue = this.form[fieldKey];
        const oldValue = this.original[fieldKey];
        if (newValue !== oldValue) {
          changes[fieldKey] = {
            new: newValue,
            old: oldValue,
          };
        }
      }
      this.$emit('confirm', changes, this.index, this.row);
    },
    onCancel() {
      this.$emit('close');
    }
  },

  watch: {
    row(val) {
      if (val && Object.keys(val).length > 0) {
        this.setFields(val);
      }
    }
  }
};
</script>

<style scoped>

</style>
