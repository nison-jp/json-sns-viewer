<template>
  <v-card
      elevation="4"
      outlined
  >
    <v-card-title @click="showUserDialog(item._user_id)">{{ userName(item._user_id) }}</v-card-title>
    <v-card-subtitle>
      Posted at: {{ item._created_at }} <br>
      Post ID: {{ item.id }} <br>
      <template v-if="item.in_reply_to_text_id">
        In Reply to the Post: {{ item.in_reply_to_text_id }} (author:
        {{ userName(item.in_reply_to_user_id) }})
      </template>
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <p v-html="nl2br(item.text)"></p>
        </v-col>
        <v-col cols="12" v-if="getImages(item.id).length !== 0">
          <div v-for="image in getImages(item.id)"
               :key="image.id"
          >
            <a :href="image.base64" target="_blank"><img :src="image.base64"></a>
          </div>
        </v-col>
      </v-row>
      <template v-if="showReply">
        <v-row>
          <v-col cols="12">
            <compose :in_reply_to_text_id="item.id" :in_reply_to_user_id="item._user_id" @close="composerClose"></compose>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="showReply = true"><v-icon>mdi-reply</v-icon></v-btn>
      <v-btn text :to="'/status/' + item.id">DETAIL</v-btn>
      <v-btn text @click="addLike(item.id)"><v-icon>mdi-heart</v-icon></v-btn>
      {{ getLikeCount(item.id) }}
    </v-card-actions>
  </v-card>
</template>

<script>
import Compose from '@/views/Compose';
export default {
  name: "Tweet",
  components: {
    Compose
  },
  props: {
    showReplyPush: Function,
    addLike: Function,
    showReplyIncludes: Function,
    getImages: Function,
    getLikeCount: Function,
    addEvent: Function,
    showUserDialog: Function,
    userName: Function,
    item: Object,
    nl2br: Function,
    items: Array,
  },
  data: () => ({
    showReply: false,
  }),
  methods: {
    composerClose(reload=true, in_reply_to_text_id=null) {
      console.log('closeEmitted ',reload,in_reply_to_text_id)
      if(in_reply_to_text_id != null) {
        this.$set(this, 'showReply', false);

      }
      if (reload) {
        this.addEvent();
      }
    },
  }
}
</script>

<style scoped>

</style>
