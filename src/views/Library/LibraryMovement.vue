<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Таблица движений
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            item-key="disciplineId"
            v-model="selected"
            sort-by="resourceMovementDate"
            :sort-desc="true"
          >
          <template v-slot:item.resourceMovementCountDescription = "{ item, value }">
              <span :style="{ color: (value.indexOf('+') !== -1 ? '#43A047' : '#E64A19') }">{{ value }}</span>
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
            <v-btn :disabled="item.resourceTypeId === 3" text color="red" @click="openDialog(item, 'reduce')">
              Списать
            </v-btn>
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
            text: 'Причина движения',
            value: 'resourceMovementReason'
          },
          {
            text: 'Описание движения',
            value: 'resourceMovementCountDescription'
          },
          {
            text: 'Количество ресурса',
            value: 'resourceMovementCountState'
          },
          {
            text: 'Тип движения',
            value: 'resourceMovementType'
          },
          {
            text: 'Дата',
            value: 'resourceMovementDate'
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
        isInternet: true,
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
    },
    methods: {
      refresh(){
        this.$http.get(this.$store.state.apiuri + "/v1/resource-movements")
        .then(res => this.items = res.data)
        this.$http.get(this.$store.state.apiuri + "/v1/resource-types")
        .then(res => this.resourceTypes = res.data)
      },
    },
  }
</script>

<style lang="scss">
</style>
