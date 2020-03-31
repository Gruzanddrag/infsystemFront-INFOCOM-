<template>
  <!-- color="grey darken-2" -->
  <v-navigation-drawer
    id="app-drawer"
    dark
    v-model="inputValue"
    style="z-index: 500"
    app
    floating
    mobile-break-point="991"
    persistent
    width="260"
  >
    <template v-slot:img="attrs">
      <v-img
        v-bind="attrs"
        gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)"
      />
    </template>

    <v-list-item two-line>

      <v-list-item-title class="title">
        Университет
      </v-list-item-title>
    </v-list-item>

    <v-divider class="mx-3 mb-3" />

    <v-list nav>
      <div
        v-for="(link, i) in links"
        :key="i"
        class="nav-links"
      >
        <v-list-item 
          v-if="link.type === 'link'"
          :to="link.to"
          active-class="primary white--text"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-title v-text="link.text" />
        </v-list-item>
        <div v-else>
          <template v-if="['admin', ...link.show].includes($store.state.user.role)">
            <v-divider inset v-if="i !== 0"> </v-divider>
            <v-subheader>{{link.text}}</v-subheader>
            <v-list>
                <div
                  v-for="(child, i) in link.children"
                  :key="i"
                  class="nav-links"
                >
                  <v-list-item 
                    :to="child.to"
                    active-class="primary white--text"
                  >
                    <v-list-item-action>
                      <v-icon>{{ child.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-title v-text="child.text" />
                  </v-list-item>
                </div>
            </v-list>
          </template>
        </div>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
  import { mapMutations, mapState, mapGetters } from 'vuex'
  import { mdiDatabaseEdit, mdiFileDocumentBoxMultiple, mdiAlertBox } from '@mdi/js'
  import { roleChekerMixin } from '../../mixins/roleCheckerMixin'

  export default {
    mixins: [
      roleChekerMixin
    ],
    props: {
      opened: {
        type: Boolean,
        default: false,
      },
    },
    data: v => ({
      links: [
        {
          type: 'group',
          show: ['department-h', 'department-e'],
          text: 'Управление УМК',
          children:[
            {
              type: 'link',
              to: '/umks',
              icon: 'mdi-clipboard-file-outline',
              text: 'УМК',
            },
            {
              type: 'link',
              to: '/disciplines',
              icon: 'mdi-book-open-outline',
              text: 'Дисциплины',
            },
          ]
        },
        {
          type: 'group',
          show: [], // only admin
          text: 'Админ панель',
          children:[
              {
                type: 'link',
                to: '/discipline-types',
                icon: 'mdi-clipboard-file-outline',
                text: 'Типы дисциплин',
              },
              {
                type: 'link',
                to: '/users',
                icon: 'mdi-account-multiple',
                text: 'Управление пользователями',
              },
          ]
        },
        {
          type: 'group',
          show: ['department-h', 'library-e'],
          text: 'Заявки в библиотеку',
          children:[
              {
                type: 'link',
                to: '/requests',
                icon: 'mdi-email-send-outline',
                text: 'Заявки',
              },
          ]
        },
        {
          type: 'group',
          show: ['library-e'],
          text: 'Библиотека',
          children:[
              {
                type: 'link',
                to: '/library',
                icon: 'mdi-library-shelves',
                text: 'Библиотека',
              },
              {
                type: 'link',
                to: '/library-movement',
                icon: 'mdi-cursor-move',
                text: 'Движение ресурсов',
              },
          ]
        },
      ],
    }),

    computed: {
      // ...mapGetters(['isAdmin', 'isLibraryEmployee', 'isDepartmentHead', 'isDepartmentEmployee']),
      ...mapState('app', ['image', 'color']),
      isAdmin: {
        get() {
          console.log(this.$store.state.user.role)
          return this.$store.state.user.role === "admin"
        },
        set() {
        }
      },
      inputValue: {
        get () {
          return this.$store.state.app.drawer
        },
        set (val) {
          this.setDrawer(val)
        },
      },
    },

    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
      openSubMenu (e) {
        console.log(e)
      },
    },
  }
</script>
