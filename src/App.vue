<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn text to="/" @click="scrollTop">TOP</v-btn>

      <v-spacer></v-spacer>
      <div>V1.6.2</div>
      <v-spacer></v-spacer>
      <v-btn text to="/settings"><v-icon>mdi-cog</v-icon></v-btn>


    </v-app-bar>
<!--    <v-navigation-drawer-->
<!--      v-model="drawer"-->
<!--      absolute-->
<!--      temporary-->
<!--      >-->
<!--      <v-list-->
<!--        nav-->
<!--        dense-->
<!--      >-->
<!--            <v-list-item-group-->
<!--                v-model="group"-->
<!--                active-class="text&#45;&#45;accent-4"-->
<!--            >-->
<!--              <v-list-item>-->
<!--                <v-list-item-title to="/"><v-btn to="/"><v-icon>mdi-note-edit</v-icon>つぶやき</v-btn></v-list-item-title>-->
<!--              </v-list-item>-->
<!--              <v-list-item>-->
<!--                <v-list-item-title to="/settings"><v-btn to="/"><v-icon>mdi-cog</v-icon>設定</v-btn></v-list-item-title>-->
<!--              </v-list-item>-->
<!--              <v-list-item>-->
<!--                <v-list-item-title to="/"><v-btn to="/"><v-icon>mdi-note-edit</v-icon>作者のつぶやき</v-btn></v-list-item-title>-->
<!--              </v-list-item>-->
<!--            </v-list-item-group>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    drawer: false,
    group:null,
  }),
  methods: {
    scrollTop() {
      scrollTo(0,0)
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },

};
</script>
