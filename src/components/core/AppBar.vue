<template>
  <v-app-bar
    id="core-app-bar"
    absolute
    app
    flat
    height="88"
    dark
  >
    <v-toolbar-title class="tertiary--text font-weight-light align-self-center">
      <v-btn
        v-if="responsive"
        icon
        @click.stop="onClick"
      >
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
      {{ title }}
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-menu offset-y max-width="200">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text>
              {{roles[user.role].name}}, {{user.name}}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-if="!$store.state.unauthenticated"
              @click="logout"
            >
              <v-list-item-title>Выйти</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-else
              @click="$router.push('/login')"
            >
              <v-list-item-title>Войти</v-list-item-title>
            </v-list-item>

            <!-- <v-list-item
              v-if="$store.state.user.role='super_admin'"
              @click="$router.push('/registration')"
            >
              <v-list-item-title>Зарегистрировать нового пользователя</v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-menu>
      </v-row>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
// Utilities
  import { mapMutations, mapState } from 'vuex'

  export default {
    data: () => ({
      notifications: [
        'Mike, John responded to your email',
        'You have 5 new tasks',
        "You're now a friend with Andrew",
        'Another Notification',
        'Another One',
      ],
      title: null,
      responsive: false,
    }),

    watch: {
      $route (val) {
        this.title = val.name
      },
    },

    mounted () {
      this.onResponsiveInverted()
      window.addEventListener('resize', this.onResponsiveInverted)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.onResponsiveInverted)
    },
    computed: {
        ...mapState(['roles', 'user','apiuri']),
    },
    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
      logout() {
      },
      onClick () {
        this.setDrawer(!this.$store.state.app.drawer)
      },
      onResponsiveInverted () {
        if (window.innerWidth < 991) {
          this.responsive = true
        } else {
          this.responsive = false
        }
      },
    },
  }
</script>

<style>
/* Fix coming in v2.0.8 */
#core-app-bar {
  width: auto;
}

#core-app-bar a {
  text-decoration: none;
}
</style>
