<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card dark>
          <v-card-title>Панель управления Библиотекой</v-card-title>
          <v-divider inset></v-divider>
          <v-card-actions>
            <v-row class="px-6">
              <v-col cols="6">
                <p>Количество ресурса <b style="color: white">{{items.length}}</b></p>
                <v-card flat>
                  <v-card-text class="d-flex justify-space-between">
                    <v-checkbox v-model="isInternet"
                      label="Интернет ресурсы"
                    >
                    </v-checkbox>
                    <v-checkbox v-model="isBook"
                      label="Книги"
                    >
                    </v-checkbox>
                    <v-checkbox v-model="isMeth"
                      label="Методические указания"
                    >
                    </v-checkbox>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-divider vertical=""></v-divider>
              <v-col>
                <v-btn text color="primary" @click="openDialog({ resourceName: '', resourceTypeId: null, resourceUrl:'' },'add')">
                  Добавить ресурс
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Список дисциплин 
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredResource"
            :search="search"
            item-key="disciplineId"
            show-select
            v-model="selected"
          >
          <template v-slot:item.resourceId = "{ item, header, value }">
            <div class="d-flex align-center">
            </div>
          </template>
          <template v-slot:item.resourceCountAvalible = "{ item, value }">
              <span :style="{ color: (value != null ? 'black' : '#BDBDBD') }">{{ value == null ? 'Не задано' : value}}</span>
          </template> 
          <template v-slot:item.resourceId = "{ item, value }">
            <v-tooltip bottom >
              <template v-slot:activator="{ on }">
                  <v-btn
                  v-on="on"
                  @click="openDialog(item, 'edit')"
                  icon>
                      <v-icon>
                        mdi-pencil-outline
                      </v-icon>
                  </v-btn>
              </template>
              <span>Изменить ресурс</span>
            </v-tooltip>
            <v-btn :disabled="item.resourceTypeId === 3" class="mr-6" text color="blue" @click="openDialog(item, 'produce')">
              Добавить
            </v-btn>
            <v-btn :disabled="item.resourceTypeId === 3 || item.resourceCountAvalible < 1" text color="red" @click="openDialog(item, 'reduce')">
              Списать
            </v-btn>
          </template> 
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="editRequestDialog" max-width="600px">
      <v-card>
       <v-form ref="requestForm">
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Название литературы" v-model="resourceToEdit.resourceName" :disabled="!modeRule(['edit', 'add'])"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select label="Тип литературы" v-model="resourceToEdit.resourceTypeId" :items="selectResourceTypes" :disabled="!modeRule(['edit', 'add'])"></v-select>
              </v-col>
              <v-col cols="12" v-if="resourceToEdit.resourceTypeId === 3">
                <v-text-field label="Ссылка" v-model="resourceToEdit.resourceUrl" :items="selectResourceTypes" :disabled="!modeRule(['edit', 'add'])"></v-text-field>
              </v-col>
              <v-col cols="12"  v-if="modeRule(['produce', 'reduce'])">
                <v-text-field :label="`Количество ${modeRule(['produce']) ? 'прихода' : 'списания'}`" v-model="resourceToEdit.count" type="number" ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="modeRule(['produce', 'reduce'])">
                <v-textarea label="Причина" auto-grow rows=1  v-model="resourceToEdit.resourceMovementReason" type="number" ></v-textarea>
              </v-col>
              <v-col cols="12">
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editRequestDialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="save(resourceToEdit)">Сохранить</v-btn>
        </v-card-actions>
       </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data (vv) {
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
            text: 'Количество доступного ресурса',
            value: 'resourceCountAvalible'
          },
          {
            text: 'Действия',
            value: 'resourceId', 
            sortable: false
          },
        ],
        resourceToEdit: {
          resourceName: '',
          resourceType: '',
          count: 0,
          requestType: '',
          resourceMovementReason: '',
          resourceUrl: ''
        },
        editRequestDialog: false,
        newDisciplineName: '',
        selected: [],
        isInternet: false,
        isBook: true,
        isMeth: true,
        modeRule: v => v.indexOf(vv.mode) !== -1,
        items: [],
        mode: 'produce', // reduce, edit, add
        resourceTypes: []
      }
    },
    created: function(){
      this.refresh()
    },
    computed: {
      selectResourceTypes: function(){
        let arr = this.resourceTypes.map(el => {
          return {
            text: el.resourceTypeAlias,
            value: el.resourceTypeId
          }
        })
        return arr;
      },
      filteredResource: function(){
        return this.items.filter(x => {
          if(x.resourceTypeId === 3 && this.isInternet){
            return true
          }
          if(x.resourceTypeId === 2 && this.isMeth){
            return true
          }
          if(x.resourceTypeId === 1 && this.isBook){
            return true
          }
        })
      },
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
        this.$http.get(this.$store.state.apiuri + "/v1/resources")
        .then(res => this.items = res.data)
        this.$http.get(this.$store.state.apiuri + "/v1/resource-types")
        .then(res => this.resourceTypes = res.data)
      },
      openDialog(item, mode){
        this.resourceToEdit = Object.assign(this.resourceToEdit, item) 
        this.mode = mode
        this.editRequestDialog = true
      },
      editRequest(request) {
        this.editRequestDialog = true
        this.requestToEdit = request
      },
      save({ resourceId, ...parametras}){
        if(this.mode === 'add'){
          this.$http.post(this.$store.state.apiuri + '/v1/resources', parametras)
          .then(_ => {
            this.editRequestDialog = false
            this.refresh()
          })
        } else if(this.mode === 'edit'){
          this.$http.put(this.$store.state.apiuri + `/v1/resources/${resourceId}`, parametras)
          .then(_ => {
            this.editRequestDialog = false
            this.refresh()
          })
        } else if(this.mode === 'produce'){
          this.$http.post(this.$store.state.apiuri + `/v1/resources/produce/`,parametras, {
            params:{
              id: resourceId,
            },
          })
          .then(_ => {
            this.editRequestDialog = false
            this.refresh()
          })
        } else if(this.mode === 'reduce'){
          this.$http.post(this.$store.state.apiuri + `/v1/resources/reduce/`,parametras, {
            params:{
              id: resourceId,
            },
          })
          .then(_ => {
            this.editRequestDialog = false
            this.refresh()
          })
        }
      }
    },
  }
</script>

<style lang="scss">
</style>
