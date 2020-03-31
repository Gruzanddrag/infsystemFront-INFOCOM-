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
            <v-btn text color="secondary" @click="getUmkLib">
              Отчет о книгообеспеченности УМК
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
               <v-tooltip bottom v-if="['admin', 'department-h'].includes($store.state.user.role)">
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="blue"
                     v-on="on"
                     :disabled="item.umkStatusId == 1"
                     @click="confirmUmk(item)"
                     icon>
                        <v-icon large="">
                          mdi-check-all
                        </v-icon>
                    </v-btn>
                </template>
                <span>Утвердить!</span>
              </v-tooltip>
               <v-tooltip v-if="['admin', 'department-h'].includes($store.state.user.role)" bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                    color="red"
                     v-on="on"
                     @click="denyUmk(item)"
                     :disabled="item.umkStatusId == 3"
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                     v-on="on"
                     @click="print(item.umkId)"
                     icon>
                        <v-icon>
                          mdi-file-pdf-box
                        </v-icon>
                    </v-btn>
                </template>
                <span>Скачать УМК в PDF</span>
              </v-tooltip>
            </div>
          </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- new resouce dialog -->
     <v-dialog v-model="confirmUmkDialog" max-width="700px">
      <v-card>
       <v-form ref="newResourceForm">
        <v-card-title>
          <span class="headline">Вы уверены, что хотите утвердить данный учебно-методический копмлекс?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <small>Вся литература, задействованная в нем будет зарезервированна и не доступна для других УМК</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="confirmUmkDialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="setState('confirm', umkToRefresh.umkId)">Да я хочу утвердить УМК</v-btn>
        </v-card-actions>
       </v-form>
      </v-card>
    </v-dialog>
    
     <v-dialog v-model="denyUmkDialog" max-width="700px">
      <v-card>
       <v-form ref="newResourceForm">
        <v-card-title>
          <span class="headline">Вы уверены, что хотите Отклонить данный учебно-методический копмлекс?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <small>Вся зарезервированная под этот УМК литература, будет снова доступна из склада. (снята с резервации)</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="denyUmkDialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="setState('deny', umkToRefresh.umkId)">Да я хочу отклонить УМК</v-btn>
        </v-card-actions>
       </v-form>
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script>
import { mapState } from 'vuex'
import download from 'downloadjs'
  export default {
    data () {
      return {
        search: '',
        confirmUmkDialog: false,
        denyUmkDialog: false,
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
        umkToRefresh : {},
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
          this.confirmUmkDialog = false
          this.denyUmkDialog = false
        })
      },
      confirmUmk(umk) {
        this.umkToRefresh = umk
        this.confirmUmkDialog = true
      },
      denyUmk(umk) {
        this.umkToRefresh = umk
        this.denyUmkDialog = true
      },
      setState(state, umkId){
        this.$http.get(`${this.$store.state.apiuri}/v1/umk/${state}`,{
          params: {
            id: umkId
          }
        }).then(_ => {
          this.refresh()
        })
        .catch(err => {
          console.log(err.response)
          if(err.response.data.data.msg === "NO_LIB") {
            this.$store.commit('THROW_POPUP', {
              code: '001',
              text: 'Не достаточно литературы на складе'
            })
            this.refresh()
          } else {
            this.$store.commit('THROW_POPUP', {
              code: '001',
              text: 'Ошибка при сохранении'
            })
          }
        })
      },
      getUmkLib(){
        this.$http({
          url: `${this.$store.state.apiuri}/v1/report/umk-lib`,
          method:'GET',
          responseType: 'blob',
        })
        .then(response => {
          let d = new Date();
          console.log(response)
          const content = response.headers['content-type'];
          download(response.data, `umk-books-${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`, content)
        })
      },
      print(umkId){
        this.$http({
          url: `${this.$store.state.apiuri}/v1/report/umk`,
          method:'GET',
          params: {
            id: umkId
          },
          responseType: 'blob',
        })
        .then(response => {
          console.log(response)
          const content = response.headers['content-type'];
          download(response.data, `umk-${umkId}`, content)
        })
      },
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
