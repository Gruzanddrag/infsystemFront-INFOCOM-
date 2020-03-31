<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card dark>
          <v-card-title>Панель управления заявками</v-card-title>
          <v-divider inset></v-divider>
          <v-card-actions>
            <v-row class="px-6">
              <v-col>
                <p>Количество заявок <b style="color: white">{{items.length}}</b></p>
                <p>Количество подтвержденных заявок <b style="color: white">{{confirmedRequests.length}}</b></p>
                <p>Количество неподтвержденных заявок <b style="color: white">{{notConfirmedRequests.length}}</b></p>
              </v-col>
              <v-divider vertical=""></v-divider>
              <v-col>
                <p>Количество исполненных заявок <b style="color: white">{{doneRequests.length}}</b></p>
                <p>Количество отклоненных заявок <b style="color: white">{{notDoneRequests.length}}</b></p>
              </v-col>
            </v-row>
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
            Список заявок 
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            item-key="disciplineId"
            show-select
            v-model="selected"
            sort-by="date"
            :sort-desc="true"
          >
          <template v-slot:item.requestId = "{ item, header, value }">
            <div class="d-flex align-center">
              <template v-if="$store.getters.isAdmin || $store.getters.isDepartmentHead">
                <v-tooltip bottom >
                  <template v-slot:activator="{ on }">
                      <v-btn
                      v-on="on"
                      @click="editRequest(item)"
                      icon>
                          <v-icon>
                            mdi-pencil-outline
                          </v-icon>
                      </v-btn>
                  </template>
                  <span>Изменить заявку</span>
                </v-tooltip>
                <v-btn
                  color="blue"
                  @click="confirm(value)"
                  :disabled="item.requestStatusId >= 2"
                  text>
                  Подтвердить
                </v-btn>
                <v-btn
                  color="red"
                  :disabled="[3,4,5].includes(item.requestStatusId)"
                  @click="turnDown(value)"
                  text>
                  Отказать
                </v-btn>
              </template>
              <template v-if="$store.getters.isAdmin || $store.getters.isLibraryEmployee">
                <v-btn
                  color="blue"
                  @click="complete(value)"
                  :disabled="item.requestStatusId !== 2"
                  text>
                  Исполнить
                </v-btn>
                <v-btn
                  color="red"
                  @click="deny(value)"
                  :disabled="item.requestStatusId !== 2"
                  text>
                  Неисполнить
                </v-btn>
              </template>
            </div>
          </template>
          <template v-slot:item.user = "{ item, value }">
              <span>{{`${value.surname} ${value.name} ${value.patronymic}`}}</span>
          </template> 
          <template v-slot:item.requestType = "{ item, value }">
              <span>{{ value === 'procure' ? 'Закупить' : 'Издать'}}</span>
          </template> 
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="editRequestDialog" max-width="600px">
      <v-card>
       <v-form ref="requestForm">
        <v-card-title>
          <span class="headline">Зменение запроса</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Название литературы" v-model="requestToEdit.resourceName" disabled></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Тип литературы" v-model="requestToEdit.resourceType" disabled></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Количество" v-model="requestToEdit.count" type="number" ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select 
                  :items="requestTypes"
                  v-model="requestToEdit.requestType"
                  color="grey"
                >               
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editRequestDialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="saveRequest(requestToEdit)">Сохранить</v-btn>
        </v-card-actions>
       </v-form>
      </v-card>
    </v-dialog>
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
            text: 'Наименование Ресурса',
            value: 'resourceName'
          },
          {
            text: 'Тип Ресурса',
            value: 'resourceType'
          },
          {
            text: 'Дата и Время',
            value: 'date'
          },
          {
            text: 'Количество товара',
            value: 'count'
          },
          {
            text: 'Тип запроса',
            value: 'requestType'
          },
          {
            text: 'Статус запроса',
            value: 'requestStatus'
          },
          {
            text: 'Инициатор',
            value: 'user'
          },
          {
            text: 'Действия',
            value: 'requestId', 
            sortable: false
          },
        ],
        requestToEdit: {
          resourceName: '',
          resourceType: '',
          count: 0,
          requestType: ''
        },
        editRequestDialog: false,
        newDisciplineName: '',
        selected: [],
        items: [],
        requestTypes: [
          {
            text: 'Издать',
            value: 'issue'
          }, 
          {
            text: 'Закупить',
            value: 'procure'
          }
        ]
      }
    },
    created: function(){
      this.refresh()
    },
    computed: {
      confirmedRequests: function() {
        return this.items.filter(x => x.requestStatus === "В исполнении")
      },
      notConfirmedRequests: function() {
        return this.items.filter(x => x.requestStatus === "Не подтвержден")
      },
      doneRequests: function() {
        return this.items.filter(x => x.requestStatus === "Исполнен")
      },
      notDoneRequests: function() {
        return this.items.filter(x => x.requestStatus === "Не исполнен")
      },
      user: {
        get: function(){
          return this.$store.state.user
        },
      }
    },
    methods: {
      refresh(){
        this.$http.get(this.$store.state.apiuri + "/v1/requests")
        .then(res => this.items = res.data)
      },
      confirm(id){
        this.$http.get(this.$store.state.apiuri + `/v1/requests/confirm/`, {
          params: {
            id: id
          }
        })
        .then(_ => {
          this.refresh()
        })
      },
      deny(id){
        this.$http.get(this.$store.state.apiuri + `/v1/requests/deny/`, {
          params: {
            id: id
          }
        })
        .then(_ => {
          this.refresh()
        })
      },
      turnDown(id){
        this.$http.get(this.$store.state.apiuri + `/v1/requests/turn-down/`, {
          params: {
            id: id
          }
        })
        .then(_ => {
          this.refresh()
        })
      },
      complete(id){
        this.$http.get(this.$store.state.apiuri + `/v1/requests/complete/`, {
          params: {
            id: id
          }
        })
        .then(_ => {
          this.refresh()
          this.$store.commit('THROW_POPUP',{
            code: '003',
            text: 'Книги были добавлены в базу'
          })
        })
      },
      editRequest(request) {
        this.editRequestDialog = true
        this.requestToEdit = request
      },
      saveRequest({requestId, ...parametras}){
        // save request
        this.$http.put(this.$store.state.apiuri + `/v1/requests/${requestId}`, parametras)
        .then(_ => {
          this.editRequestDialog = false
          this.refresh()
        })
      }
    },
  }
</script>

<style lang="scss">
</style>
