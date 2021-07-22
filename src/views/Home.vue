<template>
  <v-card
      class="mx-auto"
      max-width="600"
  >
    <v-card-title
        class="blue-grey white--text"
    >
      <span class="text-h6">Posts</span>
      <v-spacer></v-spacer>
      <v-btn text @click="getFavorites">GET LIKES</v-btn>
      <v-btn
          :outlined="interval == null"
          :color="interval == null ? 'white' : 'primary'"
          dark
          depressed
          @click="interval == null ? start() : stop()"
      >
        Realtime Loading
      </v-btn>
    </v-card-title>
    <v-card-text class="py-0">
      <compose @postComplete="addEvent"></compose>
          <div
              v-for="item in sortedPosts"
              :key="item.id"
              :color="item.color"
          >
            <v-card
                tile
                elevation="4"

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
                    {{ item.text }}
                  </v-col>
                </v-row>
                <template v-if="showReply.includes(item.id)">
                  <v-row>
                    <v-col cols="12">
                      <compose :in_reply_to_text_id="item.id" :in_reply_to_user_id="item._user_id"></compose>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-btn text @click="showReply.push(item.id)">REPLY</v-btn>
                <v-btn text :to="'/status/' + item.id">DETAIL</v-btn>
                <v-btn text @click="getLike(item.id)">LIKES:</v-btn>
                {{ getLikeCount(item.id) }}
                <v-btn text @click="addLike(item.id)">LIKE</v-btn>
              </v-card-actions>
            </v-card>

            <!--            <v-alert-->
            <!--                :value="true"-->
            <!--                :color="item.color"-->
            <!--                :icon="item.icon"-->
            <!--                class="white&#45;&#45;text"-->
            <!--            >-->
            <!--              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.-->
            <!--            </v-alert>-->
          </div>
    </v-card-text>
    <v-dialog
        v-model="showDialog"
        width="500"
    >
      <template v-if="isMyUser(DialogUser.id)">
        <v-card>
          <v-card-title>
            <v-text-field v-model="name"></v-text-field>
          </v-card-title>
          <v-card-subtitle>{{ DialogUser.id }}</v-card-subtitle>
          <v-card-text>
            <v-textarea v-model="description"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="register">UPDATE</v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-else>
        <v-card>
          <v-card-title>
            {{ DialogUser.name }}
          </v-card-title>
          <v-card-subtitle>{{ DialogUser.id }}</v-card-subtitle>
          <v-card-text>
            {{ DialogUser.description }}
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>

<script>
//import HelloWorld from '../components/HelloWorld'
import Compose from "@/views/Compose";

const COLORS = [
  'info',
  'warning',
  'error',
  'success',
]
const ICONS = {
  info: 'mdi-information',
  warning: 'mdi-alert',
  error: 'mdi-alert-circle',
  success: 'mdi-check-circle',
}
const BASE_URL = 'https://versatileapi.herokuapp.com/api';
const API = {
  users: {
    all: BASE_URL + '/user/all',
    show: function (id) {
      return BASE_URL + '/user/' + id;
    },
    create: BASE_URL + '/user/create_user',
  },
  text: {
    all: BASE_URL + '/text/all',
    latest: function (limit) {
      return BASE_URL + '/text/all?$orderby=_created_at desc&$limit=' + limit;
    },
    show: function (id) {
      return BASE_URL + '/text/' + id;
    }
  },
  like: function (id) {
    return BASE_URL + '/like/' + id;
  }
}
// eslint-disable-next-line no-unused-vars
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
export default {
  name: 'Home',

  components: {
    Compose,
  },
  data: () => ({
    showDialog: false,
    DialogUserId: null,
    interval: null,
    items: [],
    users: [],
    showReply: [],
    nonce: 2,
    name: null,
    description: null,
    myUserId: null,
    likes: [],
  }),

  beforeDestroy() {
    this.stop()
  },
  mounted: function () {
    this.$set(this, 'myUserId', localStorage.getItem('user_id'));
    if (localStorage.getItem('posts')) {
      this.$set(this, 'items', JSON.parse(localStorage.getItem('posts')));
    }
    if (localStorage.getItem('users')) {
      this.$set(this, 'users', JSON.parse(localStorage.getItem('users')));
    }
    if (localStorage.getItem('likes')) {
      this.$set(this, 'likes', JSON.parse(localStorage.getItem('likes')));
    }
    this.getUserMaster();
    this.addEvent();
    this.start();
  },
  computed: {
    sortedPosts() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.items.sort((a, b) => {
        var a_dat = new Date(a._created_at);
        var b_dat = new Date(b._created_at);
        return b_dat - a_dat;
      })
    },
    DialogUser() {
      let user = this.users.find((user) => user.id === this.DialogUserId);
      if (user !== undefined) {
        return user;
      } else {
        return {
          id: null,
          name: null,
          description: null,
        };
      }
    },
  },
  methods: {
    isMyUser(user_id) {
      return localStorage.getItem('user_id') === user_id;
    },
    async loader() {

      this.addEvent();
      this.getUserMaster();

    },
    register() {
      if (this.name !== null && this.description !== null) {
        this.axios.post(API.users.create, {
          name: this.name,
          description: this.description,
        }).then((response) => {
          localStorage.setItem('user_id', response.data.id);
          this.$toast.success('ユーザー登録しました: '. response.data.id);
          this.getUserMaster();
        }).catch((error) => {
          this.$toast.error(error.toString());
        })
      }
    },
    showUserDialog(user_id) {
      this.$set(this, 'DialogUserId', user_id);
      this.$set(this, 'showDialog', true);
    },
    userName(user_id) {
      let user = this.users.find((user) => {
        return user.id === user_id;
      })
      if (user !== undefined) {
        return user.name;
      } else {
        return user_id;
      }
    },
    getOne(id) {
      this.axios.get(API.text.show(id))
          .then((response) => {
            this.items.push(response.data);
            this.$set(this, 'showReply', this.showReply.filter(e => e !== response.data.in_reply_to_text_id));
          })
          .catch((error) => {
            this.$toast.error(error.toString());
          })
    },
    addEvent() {
      this.axios.get(API.text.latest(100))
          .then((response) => {
            this.$set(this, 'items', response.data);
          })
          .catch((error) => {
            this.$toast.error(error.toString());
          })
    },
    getUserMaster() {
      this.axios.get(API.users.all)
          .then((response) => {
            this.$set(this, 'users', response.data);
            let myUser = response.data.find((user) => user.id === this.myUserId);
            if (myUser !== undefined) {
              this.$set(this, 'name', myUser.name);
              this.$set(this, 'description', myUser.description);
            }
          })
    },
    getLikeCount(id) {
      let like = this.likes.find((like) => like.id === id);
      if (like == undefined) {
        return '?';
      } else {
        return like.like_count;
      }
    },
    addLike(id) {
      this.getLike(id).then((likeObj) => {
        let like_count = likeObj.like_count + 1;
        this.axios.put(API.like(id), {
          like_count: like_count
        }, {
          headers: {
            'Authorization' : 'LOVE'
          }
        }).then(() => {
          this.getLike(id)
              .catch((error) => {
                this.$toast.error(error.toString());
              });
        }).catch((error) => {
          this.$toast.error(error.toString());
        })
      })
    },
    async getLike(id) {
      let that = this;
      return new Promise(function (resolve, reject) {
        that.axios.get(API.like(id)).then((response) => {
          that.upsert(that.likes, response.data);
          resolve(response.data);
        }).catch((error) => {
          if (error.response.status === 404) {
            that.upsert(that.likes, {
              id: id,
              like_count: 0,
            });
            resolve({id:id, like_count: 0});
          } else {
            that.$toast.error(error.toString());
            reject(error);
          }
        })
      });
    },
    upsert(array, item) { // (1)
      const i = array.findIndex(_item => _item.id === item.id);
      if (i > -1) array[i] = item; // (2)
      else array.push(item);
    },
    async getFavorites() {
      for (let index = 0; index < this.items.length; index++) {
        const post = this.items[index];
        const i = this.likes.findIndex(_item => _item.id === post.id);
        if (i > -1) {
          // do nothing
        } else {
          await this.getLike(post.id).finally(async () => {
            await sleep(1000);
          });
        }
      }
    },
    genAlert() {
      const color = this.genColor()

      return {
        color,
        icon: this.genIcon(color),
      }
    },
    genColor() {
      return COLORS[Math.floor(Math.random() * 3)]
    },
    genIcon(color) {
      return ICONS[color]
    },
    start() {
      this.interval = setInterval(this.loader, 5000)
    },
    stop() {
      clearInterval(this.interval)
      this.interval = null
    },
  },
  watch: {
    items(newItems) {
      localStorage.setItem('posts',JSON.stringify(newItems));
    },
    users(newUsers) {
      localStorage.setItem('users',JSON.stringify(newUsers));
    },
    likes(newLikes) {
      localStorage.setItem('likes',JSON.stringify(newLikes));
    }
  }
}
</script>
