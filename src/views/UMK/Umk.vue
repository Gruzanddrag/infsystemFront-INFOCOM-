<template>
  <v-container
    fluid
    class="main-container"
  >
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Доступные УМК
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Поиск по таблице"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
          >
          <template v-slot:item.umkStatusId = "{ item, header, value }">
              {{ value || 'Не задано' }}
          </template>
          <template v-slot:item.umkId = "{ item, header, value }">
            <div class="d-flex align-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                     v-on="on"
                     @click="deleteUmk(value)"
                     icon>
                        <v-icon>
                          mdi-trash-can-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>Удалить УМК</span>
              </v-tooltip>
            </div>
          </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data () {
      return {
        search: '',
        headers: [
          {
            text: 'Наименование УМК',
            value: 'umkName'
          },
          {
            text: 'Статус',
            value: 'umkStatusId'
          },
          {
            text: 'Количество часов',
            value: 'umkTotalHours'
          },
          {
            text: 'Действия',
            value: 'umkId', 
            sortable: false
          },
        ],
        items: []
      }
    },
    created: function(){
      this.refresh()
    },
    methods: {
      deleteUmk(id){
        this.$http.delete(this.$store.state.apiuri + `/v1/umk/${id}`)
        .then(_ => {
          this.refresh()
        })
      },
      refresh(){
        this.$http.get(this.$store.state.apiuri + "/v1/umk")
        .then(res => {
          this.items = res.data
        })
      }
    },
    computed:{
      ...mapState(['apiuri','roles', 'loading']),
      user: {
        get: function(){
          return this.$store.state.user
        },
      }
    }
  }
</script>

<style lang="scss" scoped>
  .main-container {
    height: 100%;
    display: flex;

    & .welcome-wrapper{
      margin: auto;
      max-width: 40%;
      text-align: center;
    }

  }
</style>
