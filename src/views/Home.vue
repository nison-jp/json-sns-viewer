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
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              text
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>

          <v-list-item @click="getAllPosts">
            UPDATE POSTS
          </v-list-item>
          <v-list-item @click="getUserMaster">
            UPDATE USERS
          </v-list-item>
          <v-list-item @click="getImageCache">UPDATE IMAGES</v-list-item>
        </v-list>
      </v-menu>
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
      <compose @close="composerClose"></compose>
          <div
              v-for="item in sortedPosts"
              :key="item.id"
              :color="item.color"
          >
          <Tweet
            :show-reply-includes="showReply.includes"
            :addLike="addLike"
            :showReplyPush="showReply.push"
            :getImages="getImages"
            :getLikeCount="getLikeCount"
            :addEvent="addEvent"
            :showUserDialog="showUserDialog"
            :userName="userName"
            :nl2br="nl2br"
            :item="item"
            :items="items"
            :showThread="showThread"
            >

          </Tweet>

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
        scrollable
    >
      <template v-if="isMyUser(DialogUserId)">
        <v-card>
          <v-toolbar color="primary" fixed dense>
            MY PROFILE
            <v-spacer></v-spacer>
            <v-btn text @click="showDialog = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-toolbar>
          <v-card-title>
            <v-text-field v-model="name" label="name"></v-text-field>
          </v-card-title>
          <v-card-subtitle>User ID:{{ DialogUser.id }}</v-card-subtitle>
          <v-card-subtitle>
            <v-textarea v-model="description" label="description"></v-textarea>
          </v-card-subtitle>
          <v-card-actions>
            <v-btn text @click="register" color="success">{{ DialogUser.id === null ? 'REGISTER' : 'UPDATE' }}</v-btn>
            <v-btn text @click="showUserTweets = !showUserTweets" color="primary">TWEETS</v-btn>
          </v-card-actions>
          <v-card-text>
            <template v-if="showUserTweets && showDialog">
              <div
                  v-for="item in getSpecificUserTweets(DialogUserId)"
                  :key="item.id"
                  :color="item.color"
              >
                <Tweet
                    :show-reply-includes="showReply.includes"
                    :addLike="addLike"
                    :showReplyPush="showReply.push"
                    :getImages="getImages"
                    :getLikeCount="getLikeCount"
                    :addEvent="addEvent"
                    :showUserDialog="showUserDialog"
                    :userName="userName"
                    :nl2br="nl2br"
                    :item="item"
                    :items="items"
                    :showThread="showThread"
                >

                </Tweet>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </template>
      <template v-else>
        <v-card>
            <v-toolbar dense fixed color="green">
              USER PROFILE
              <v-spacer></v-spacer>
              <v-btn text @click="showDialog = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>
            <v-card-title>{{ DialogUser.name }}</v-card-title>
            <v-card-subtitle>{{ DialogUser.id }}</v-card-subtitle>
            <v-card-subtitle>
              <p v-html="nl2br(DialogUser.description)" ></p>
            </v-card-subtitle>

          <v-card-subtitle>Tweets:</v-card-subtitle>
          <v-card-text>

            <div
                v-for="item in getSpecificUserTweets(DialogUserId)"
                :key="item.id"
                :color="item.color"
            >
              <Tweet
                  :show-reply-includes="showReply.includes"
                  :addLike="addLike"
                  :showReplyPush="showReply.push"
                  :getImages="getImages"
                  :getLikeCount="getLikeCount"
                  :addEvent="addEvent"
                  :showUserDialog="showUserDialog"
                  :userName="userName"
                  :nl2br="nl2br"
                  :item="item"
                  :items="items"
                  :showThread="showThread"
              >

              </Tweet>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog
      v-model="showThreadDialog"
      max-width="500px"
      scrollable
    >
      <v-card>
        <v-toolbar color="accent" fixed dense>
          THREADS
          <v-spacer>
          </v-spacer>
          <v-btn text @click="showThreadDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <template v-if="showThreadDialog && (threadDialogId !== null)">
            <div v-for="item in threadTweets" :key="item.id">
              <Tweet
                  :show-reply-includes="showReply.includes"
                  :addLike="addLike"
                  :showReplyPush="showReply.push"
                  :getImages="getImages"
                  :getLikeCount="getLikeCount"
                  :addEvent="addEvent"
                  :showUserDialog="showUserDialog"
                  :userName="userName"
                  :nl2br="nl2br"
                  :item="item"
                  :items="items"
                  :showThread="showThread"
              ></Tweet>
            </div>
          </template>
        </v-card-text>
      </v-card>


    </v-dialog>
  </v-card>
</template>

<script>
//import HelloWorld from '../components/HelloWorld'
import Compose from "@/views/Compose";
import Tweet from "@/views/Tweet";
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
    count: BASE_URL + '/user/count',
    show: function (id) {
      return BASE_URL + '/user/' + id;
    },
    create: BASE_URL + '/user/create_user',
  },
  text: {
    all: BASE_URL + '/text/all',
    count: BASE_URL + '/text/count',
    latest: function (limit) {
      return BASE_URL + '/text/all?$orderby=_created_at desc&$limit=' + limit;
    },
    show: function (id) {
      return BASE_URL + '/text/' + id;
    },
    user: function(user_id) {
      return BASE_URL + "/text/all?$filter=_user_id eq '" + user_id + "'&$orderby=_created_at desc";
    }
  },
  like:{
    all: BASE_URL + '/like/all',
    count: BASE_URL + '/like/count',
    text: function (id) {
      return BASE_URL + '/like/' + id;
    }
  },
  image: {
    all: BASE_URL + '/image/all',
    count: BASE_URL + '/image/count',
    show: function (id) {
      return BASE_URL + '/image/' + id;
    }
  }
}
// eslint-disable-next-line no-unused-vars
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));


// eslint-disable-next-line no-unused-vars
const groupBy = (array, getKey) =>
    Array.from(
        array.reduce((map, cur, idx, src) => {
          const key = getKey(cur, idx, src);
          const list = map.get(key);
          if (list) list.push(cur);
          else map.set(key, [cur]);
          return map;
        }, new Map())
    );
export default {
  name: 'Home',

  components: {
    Compose,
    Tweet,
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
    lockUserUpdate: false,
    images: [],
    userTweets: [],
    userTweetsObtained: false,
    showUserTweets: false,
    showThreadDialog: false,
    threadDialogId: null,
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
    let imagesTmp = [];
    this.imagesKey().forEach((key) => {
      imagesTmp.push({
        text_id: key.slice(7),
        images: JSON.parse(localStorage.getItem(key)),
      });
    });
    this.$set(this, 'images', imagesTmp);
    // if (localStorage.getItem('likes')) {
    //   this.$set(this, 'likes', JSON.parse(localStorage.getItem('likes')));
    // }
    this.getUserMaster();
    this.addEvent();
    this.start();
  },
  computed: {
    threadTweets () {
      return this.getThread(this.threadDialogId);
    },
    sortedPosts() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.items.sort((a, b) => {
        var a_dat = new Date(a._created_at);
        var b_dat = new Date(b._created_at);
        return b_dat - a_dat;
      }).slice(0,100);
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
    zeroLikes() {
      return this.items.map((item) => {
        let like = this.likes.find((like) => {
          return like.id === item.id;
        });
        if (like === undefined) {
          return {
            id: item.id,
            like_count:0
          };
        } else {
          return like;
        }
      })
    },
  },
  methods: {
    showThread (text_id) {
      this.$set(this, 'threadDialogId', text_id);
      this.$set(this, 'showThreadDialog', true);
    },
    getThread(text_id) {
      let result = [];
      let tweet = this.items.find((item) => item.id === text_id);
      result.push(tweet);
      this.getAheadThreadRecursive(text_id, result);
      this.getBelowThreadRecursive(text_id, result);
      return result.sort((a, b) => {
        var a_dat = new Date(a._created_at);
        var b_dat = new Date(b._created_at);
        return a_dat - b_dat;
      });
    },
    getAheadThreadRecursive(text_id, array) {
      let replies = this.items.filter((text) => text.in_reply_to_text_id === text_id);
      if (replies.length === 0) {
        return;
      } else {
        for(let i = 0; i < replies.length; i++) {
          array.push(replies[i]);
          this.getAheadThreadRecursive(replies[i].id, array);
        }
      }
    },
    async getBelowThreadRecursive(text_id, array) {
      let text = this.items.find((item) => item.id === text_id);
      if (text.in_reply_to_text_id === undefined) {
        return;
      } else {
        let replies = this.items.filter((item) => item.id === text.in_reply_to_text_id);
        for(let i = 0; i < replies.length; i++) {
          array.push(replies[i]);
          await this.getBelowThreadRecursive(replies[i].id, array);
        }
      }
    },
    getAllPosts() {
      this.axios.get(API.text.all)
          .then((response) => {
            this.bulkUpsert(this.items, response.data);
          })
          .catch((error) => {
            this.$toast.error(error.toString());
          })
    },
    getSpecificUserTweets(user_id) {
      return this.items.filter((item) => item._user_id === user_id).slice(0,100);
    },
    showReplyPush(id) {
      return this.showReply.push(id);
    },
    showReplyIncludes(id) {
      return this.showReply.includes(id);
    },
    getImages(textId) {
      let imageBox = this.images.find((image) => image.text_id === textId);
      if (imageBox !== undefined) {
        return imageBox.images;
      } else {
        return [];
      }
    },
    imagesKey() {
      let returningKeys = [];
      for (var i=0; i<localStorage.length; i++) {
        if (localStorage.key(i).startsWith('images_')) {
          returningKeys.push(localStorage.key(i));
        }
      }
      return returningKeys;
    },
    composerClose(reload=true, in_reply_to_text_id=null)
    {
      console.log('closeEmitted ',reload,in_reply_to_text_id)
      if(in_reply_to_text_id != null) {
        let shownIds = this.showReply.filter((text) => text != in_reply_to_text_id);
        console.log(shownIds);
        this.$set(this, 'showReply', shownIds);
      }
      if (reload) {
        this.addEvent();
      }
    },
    nl2br(str) {
      if (str === null || str === undefined) {
        return '';
      }
      return str.replace(/\r\n/g, '<br />').replace(/\r|\n/g, '<br />');
    },
    isMyUser(user_id) {
      return localStorage.getItem('user_id') === user_id;
    },
    async loader() {

      this.addEvent();
      this.getUserMaster();
      await this.getFavorites();
    },
    register() {
      if (this.name !== null && this.description !== null) {
        this.axios.post(API.users.create, {
          name: this.name,
          description: this.description,
        }).then((response) => {
          this.$set(this, 'lockUserUpdate', false);
          localStorage.setItem('user_id', response.data.id);
          this.$toast.success('ユーザー登録しました: '+ response.data.id);
          this.getUserMaster();
          this.$set(this, 'lockUserUpdate', true);
        }).catch((error) => {
          this.$toast.error(error.toString());
        })
      }
    },
    showUserDialog(user_id) {
      if (user_id === this.myUserId) {
        this.$set(this, 'lockUserUpdate', true);
      }
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
            this.bulkUpsert(this.items, response.data);
          })
          .catch((error) => {
            this.$toast.error(error.toString());
          })
    },
    getUserMaster() {
      if (!this.lockUserUpdate) {
        this.axios.get(API.users.all)
            .then((response) => {
              this.$set(this, 'users', response.data);
              let myUser = response.data.find((user) => user.id === this.myUserId);
              if (myUser !== undefined) {
                this.$set(this, 'name', myUser.name);
                this.$set(this, 'description', myUser.description);
              }
            })
      }
    },
    getLikeCount(id) {
      let like = this.zeroLikes.find((like) => like.id === id);
      if (like == undefined) {
        return '?';
      } else {
        return like.like_count;
      }
    },
    addLike(id) {
      this.getLike(id).then((likeObj) => {
        let like_count = likeObj.like_count + 1;
        this.axios.put(API.like.text(id), {
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
        that.axios.get(API.like.text(id)).then((response) => {
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
      if (i > -1) this.$set(array,i, item); // (2)
      else array.push(item);
    },
    bulkUpsert(array, items) {
      items.forEach((item) => this.upsert(array,item));
    },
    async getFavorites() {
      return this.axios.get(API.like.all).then((response) => {
        this.$set(this, 'likes', response.data);
      }).catch((error) => {
        this.$toast.error(error.toString());
      })
      // for (let index = 0; index < this.items.length; index++) {
      //   const post = this.items[index];
      //   const i = this.likes.findIndex(_item => _item.id === post.id);
      //   if (i > -1) {
      //     // do nothing
      //   } else {
      //     await this.getLike(post.id).finally(async () => {
      //       await sleep(1000);
      //     });
      //   }
      // }
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
    getImageCache() {
      this.axios.get(API.image.all).then((response) => {
        this.$set(this, 'images', groupBy(response.data, image => image.bind_text_id).map((groupedImages) => {
          return {
            text_id: groupedImages[0],
            images: groupedImages[1]
          };
        }));
      })

    }
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
    },
    images(newImages) {
      newImages.forEach((newImage) => {
        localStorage.setItem('images_' + newImage.text_id, JSON.stringify(newImage.images));
      })
    },
    showDialog(newDialogState) {
      if (!newDialogState) {
        this.$set(this, 'lockUserUpdate', false);
      }
    }
  }
}
</script>
