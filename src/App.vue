<template>
  <v-app>
    <core-app-bar v-if="$route.name !== 'login'" />

    <core-drawer v-if="$route.name !== 'login'" />

    <core-view @err="showErr" />
    <!-- error-snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3500"
      :color="codes[exception.code].color"
      class="d-flex snack align-center"
    >
      <p class="subtitle-1 ma-0">{{ exception.text }}</p>
      <v-btn
        v-if="codes[exception.code].href"
        color="white"
        :href="exception.href"
      >
        {{ exception.hrefText }}
      </v-btn>
    </v-snackbar>
    <!-- loading-overlay -->
    <v-overlay v-model="loading" opacity="0.7" style="z-index: 600">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import store from "./store";
  export default {
    components: {
      CoreDrawer: () => import('@/components/core/Drawer'),
      CoreAppBar: () => import('@/components/core/AppBar'),
      CoreView: () => import('@/components/core/View'),
    },
    created: function() {
      this.$http.get(this.$store.state.apiuri + '/auth/me')
      .then(res => {
        console.log(res)
      })
    },
    computed: {
      ...mapState(['codes']),
      snackbar: {
        get: function () {
          return this.$store.state.snackbar
        },
        set: function (newValue) {
          this.$store.commit('SET_SNACKBAR', newValue)
        }
      },
      exception: {
        get: function () {
          return this.$store.state.popup
        },
        set: function (newValue) {
          this.$store.commit('SET_POPUP', newValue)
        }
      },
      loading: {
        get: function () {
          return this.$store.state.loading
        },
      }
    },
    methods: {
      showErr(exception){
        this.exception = Object.assign(this.exception, exception)
        this.snackbar = true
      }
    }
  }
</script>

<style lang="scss" >

  @font-face {
    font-family: "ProximaRegular";
    src: url("./assets/fonts/ProximaNovaRegular/ProximaNovaRegular.ttf");
  }
  .snack{
    & .v-snack__wrapper .v-snack__content {
      justify-content: center !important;
    }
  }
</style>
