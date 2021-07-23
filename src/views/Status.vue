<template>
<div>
  <v-card>
    <v-card-title>
      {{userName(post._user_id)}}
    </v-card-title>
    <v-card-subtitle>
      {{post._created_at}}
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          {{post.text}}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</div>

</template>

<script>
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
    latest: function(limit) {
      return BASE_URL + '/text/all?$orderby=_created_at desc&$limit=' + limit;
    },
    show: function (id) {
      return BASE_URL + '/text/' + id;
    }
  }
}
export default {
  name: "Status",
  props: {
    id: null,
    in_reply_to_text_id: null,
  },
  data: () => ({
    users: [],
    post: {
      id: null,
      _user_id: null,
      _created_at: null,
      _updated_at: null,
      text: null,
    },
  }),
  mounted: function (){
    this.load(this.$route.params.id);
    this.getUserMaster();
  },
  methods: {
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
    load(id) {
      this.axios.get('https://versatileapi.herokuapp.com/api/text/' + id)
          .then((response) => {
            this.$set(this, 'post', response.data);
          })
    },
    getUserMaster () {
      this.axios.get(API.users.all)
          .then((response) => {
            this.$set(this, 'users', response.data);
          })
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      console.log(to);
      this.load(to.params.id);
    }
  }
}
</script>

<style scoped>

</style>
