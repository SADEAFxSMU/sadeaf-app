<template>
  <div class="form-wrapper">
    <NotificationPreferencesForm form-width="500" />
  </div>
</template>

<script>
import NotificationPreferencesForm from "../../../components/forms/NotificationPreferencesForm";
export default {
  name: "notifications",
  components: { NotificationPreferencesForm },
};
</script>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
}
</style>
