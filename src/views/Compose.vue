<template>
  <v-form
      ref="form"
      lazy-validation
      v-on:submit.prevent="onSubmit"
  >
    <v-textarea
        v-model="text"
        :disabled="sending"
        required
        placeholder="いまなにしてる？"
        @keydown.enter.shift="keyShiftEnter(false)"
        @keydown.enter.exact="keyEnter(false)"
        ref="refsTextField"
        :autofocus="true"
    ></v-textarea>
    <v-container>
      <v-row>
        <v-btn
            :disabled="(text.length === 0 || text.length > 280)"
            text
            color="success"
            @click="submit(false)"
        >
          SEND
        </v-btn>
        <v-btn
          v-if="in_reply_to_text_id != null"
          text
          color="cancel"
          @click="$emit('close',false,in_reply_to_text_id)"
        >CANCEL</v-btn>
        <span :style="(text.length > 280) ? 'color:red;':''">あと{{ 280 - text.length }}文字</span>
        <v-spacer></v-spacer>
        <v-switch class="my-0" v-model="sendOnEnter" :label="'送信モード: ' + (sendOnEnter ? 'Enterキーで送信' : 'Shift+Enterで送信')"></v-switch>
      </v-row>
    </v-container>


<!--    <v-btn-->
<!--        text-->
<!--        color="success"-->
<!--        @click="submit(true)"-->
<!--    >-->
<!--      TEST-->
<!--    </v-btn>-->

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
    sendOnEnter: false,
    text: '',
    sending: false,
  }),
  methods: {
    keyEnter(isTest=false)
    {
      if (this.sendOnEnter) {
        this.submit(isTest);
      }
    },
    keyShiftEnter(isTest=false)
    {
      if (!this.sendOnEnter) {
        this.submit(isTest);
      }
    },
    submit(isTest=false) {
      if (this.text !== null) {
        if (this.text.length > 280) {
            this.$toast.error("長すぎます。280文字以内にしてください。")
            return;
        }
        let text = this.text;
        this.$set(this, 'sending', true);
        this.axios.post('https://versatileapi.herokuapp.com/api/text' + (isTest ? '_test' : ''), {
          text: text,
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
          this.$emit('close', true, this.in_reply_to_text_id)
          this.$toast.success('投稿しました:' + text);
          this.axios.get('https://versatileapi.herokuapp.com/api/text/' + response.data.id).then((text) => {
            localStorage.setItem('user_id', text.data._user_id);
          });
          this.$nextTick(() => {
            this.$refs.refsTextField.$refs.input.focus();
          })
        }).catch((error) => {
          console.error(error.response.data.toString());
          this.$set(this, 'sending', false);
          let errorDetail = error.response.data.toString() ?? '(不明)';
          this.$toast.error(error.toString() + "\n 詳細: " + errorDetail);
        })

      }
    }
  }
}
</script>

<style scoped>

</style>
