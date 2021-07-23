<template>
  <v-card
      elevation="4"
      outlined
  >
    <v-card-title @click="showUserDialog(item._user_id)">
      {{ userName(item._user_id) }}
      <v-spacer></v-spacer>
      <v-card-subtitle>{{ getRelativeTime(item._created_at) }}</v-card-subtitle>
    </v-card-title>
    <v-card-subtitle>
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
            <compose :in_reply_to_text_id="item.id" :in_reply_to_user_id="item._user_id"
                     @close="composerClose"></compose>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="showReply = true">
        <v-icon>mdi-reply</v-icon>
      </v-btn>
      <v-btn text @click="showThread(item.id)">THREAD</v-btn>
      <v-btn text @click="addLike(item.id)">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
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
    showThread: Function,
  },
  data: () => ({
    showReply: false,
  }),
  methods: {
    composerClose(reload = true, in_reply_to_text_id = null) {
      console.log('closeEmitted ', reload, in_reply_to_text_id)
      if (in_reply_to_text_id != null) {
        this.$set(this, 'showReply', false);

      }
      if (reload) {
        this.addEvent();
      }
    },
    getRelativeTime(targetDateStr) {

      var baseDate = new Date();
      var targetDate = new Date(targetDateStr);

      var elapsedTime = Math.ceil((baseDate.getTime() - targetDate.getTime()) / 1000);

      var message = null;

      // これ以下で一定時間未満のごとのメッセージの表示方法を条件分岐
      // 表示する数字が1桁のときは関数 digit で頭に半角スペースを付ける
      if (elapsedTime < 60) { //  1 分未満
        message = 'たった今';
      } else if (elapsedTime < 120) { //  2 分未満
        message = '約 1分前';
      } else if (elapsedTime < (60 * 60)) { //  1 時間未満
        message = '約' + (Math.floor(elapsedTime / 60) < 10 ? ' ' : '') + Math.floor(elapsedTime / 60) + '分前';
      } else if (elapsedTime < (120 * 60)) { //  2 時間未満
        message = '約 1時間前';
      } else if (elapsedTime < (24 * 60 * 60)) { //  1 日未満
        message = '約' + (Math.floor(elapsedTime / 3600) < 10 ? ' ' : '') + Math.floor(elapsedTime / 3600) + '時間前';
      } else if (elapsedTime < (7 * 24 * 60 * 60)) { // 1 週間未満
        message = '約' + (Math.floor(elapsedTime / 86400) < 10 ? ' ' : '') + Math.floor(elapsedTime / 86400) + '日前';
      } else { // 1 週間以上
        message = '約' + (Math.floor(elapsedTime / 604800) < 10 ? ' ' : '') + Math.floor(elapsedTime / 604800) + '週間前';
      }

      return message;
    }
  }
}
</script>

<style scoped>

</style>
