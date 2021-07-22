<template>
<v-card>
  <v-card-title>
    ユーザーID
  </v-card-title>
  <v-card-text>
    <v-text-field
      v-model="uid"
    ></v-text-field>
  </v-card-text>
</v-card>
</template>

<script>
export default {
  name: "Setting",
  data: () => ({
    uid: '',
  }),
  mounted() {
    if (localStorage.getItem('user_id')) {
      this.$set(this,'uid', localStorage.getItem('user_id'));
    }
  },
  watch: {
    uid(newUid) {
      localStorage.setItem('user_id',newUid);
    }
  }
}
</script>

<style scoped>

</style>
