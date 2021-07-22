<template>
  <v-form
      ref="form"
      lazy-validation
      v-on:submit.prevent="onSubmit"
  >
    <v-text-field
        v-model="text"
        :disabled="sending"
        required
        placeholder="いまなにしてる？"
        @keydown.enter="submit(false)"
        ref="refsTextField"
        :autofocus="true"
    ></v-text-field>
    <v-btn
        text
        color="success"
        @click="submit(false)"
    >
      SEND
    </v-btn>
    <v-btn
        text
        color="success"
        @click="submit(true)"
    >
      TEST
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: "Compose",
  props: {
    in_reply_to_user_id: null,
    in_reply_to_text_id: null,
  },
  data: () => ({
    text: null,
    sending: false,
  }),
  methods: {
    submit(isTest=false) {
      if (this.text !== null) {
        this.$set(this, 'sending', true);
        this.axios.post('https://versatileapi.herokuapp.com/api/text' + (isTest ? '_test' : ''), {
          text: this.text,
          in_reply_to_text_id: this.in_reply_to_text_id,
          in_reply_to_user_id: this.in_reply_to_user_id
        }, {
          headers: {
            'Authorization': 'HelloWorld'
          }
        }).then((response) => {
          console.log(response);
          this.$set(this, 'text', null);
          this.$set(this, 'sending', false);
          this.$emit('postComplete', response.data.id)
          this.$nextTick(() => {
            this.$refs.refsTextField.$refs.input.focus();
          })
        })

      }
    }
  }
}
</script>

<style scoped>

</style>
