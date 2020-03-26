<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card dark>
          <v-card-title>Панель управления Учебно-методическими Комплексами</v-card-title>
          <v-card-actions>
            <v-btn text color="secondary" @click="$router.push({path: '/umk'})">
              Создать новый УМК
            </v-btn>
          </v-card-actions>
          <!-- <v-card-text>
            Количество УМК: {{items.length}}
          </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
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
            item-key="umkId"
            show-select
            v-model="selected"
          >
          <template v-slot:item.umkStatus = "{ item, header, value }">
            <span :style="{ color: (value ? 'inherit' : '#BDBDBD' ) }">{{ value || 'Не задано' }}</span>
              
          </template>
          <template v-slot:item.umkId = "{ item, header, value }">
            <div class="d-flex align-center">
               <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="blue"
                     v-on="on"
                     @click="setState('confirm',item.umkId)"
                     icon>
                        <v-icon large="">
                          mdi-check-all
                        </v-icon>
                    </v-btn>
                </template>
                <span>Утвердить!</span>
              </v-tooltip>
               <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="red"
                     v-on="on"
                     @click="setState('deny',item.umkId)"
                     icon>
                        <v-icon large>
                          mdi-close
                        </v-icon>
                    </v-btn>
                </template>
                <span>Отклонить</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                     v-on="on"
                     @click="$router.push(`/umk/${value}`)"
                     icon>
                        <v-icon>
                          mdi-briefcase-edit-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>Изменить УМК</span>
              </v-tooltip>
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
            value: 'umkStatus'
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
        selected: [],
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
      },
      setState(state, umkId){
        this.$http.get(`${this.$store.state.apiuri}/v1/umk/${state}`,{
          params: {
            id: umkId
          }
        }).then(_ => {
          this.refresh()
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
