<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card dark>
          <v-card-title>Панель управления типами дисциплин</v-card-title>
          <v-divider inset></v-divider>
          <v-card-actions>
            <v-row class="px-3">
              <v-col cols=6>
                <v-row class="align-center">
                  <v-col cols="12">
                    <v-subheader>
                      Создание нового типа
                    </v-subheader>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      outlined
                      class="new-discipline-field"
                      hide-details
                      color="secondary"
                      v-model="newDisciplineName"
                      label="Название нового типа"
                      @keyup.enter="addNewDicipline"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="5">
                    <v-btn
                      @click="addNewDicipline"
                      :disabled="!newDisciplineName"
                      color="secondary" 
                      text>
                      Добавить
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols=5>
                <v-card elevation="0">
                  <v-card-text>
                    Количество типов дисциплин <b style="color: white">{{items.length}}</b>
                  </v-card-text>
                </v-card>
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
            Список дисциплин 
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
            item-key="sectionDisciplineTypeId"
            show-select
            v-model="selected"
          >
          <template v-slot:item.sectionDisciplineTypeId = "{ item, header, value }">
            <div class="d-flex align-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                     v-on="on"
                     @click="item.isChanging = true"
                     icon>
                        <v-icon>
                          mdi-pencil-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>Изменить название типа дисциплины</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                     v-on="on"
                     @click="deleteDiscipline(value)"
                     icon>
                        <v-icon>
                          mdi-trash-can-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>Удалить дисцилину</span>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:item.sectionDisciplineTypeName = "{ item, header, value }">
            <!-- <v-fade-transition hide-on-leave> -->
              <!-- {{item}} -->
              <span v-if="!item.isChanging">{{value}}</span>
              <div v-else class="d-flex align-center">
                <v-text-field @keyup.enter="save(item)"  v-model="item.sectionDisciplineTypeName" lable="Название дисциплины"></v-text-field>
                <v-btn @click="save(item)" text color="secondary darken-1">
                  Сохранить
                </v-btn>
              </div>
            <!-- </v-fade-transition> -->
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
            text: 'Наименование Типа Дисциплины',
            value: 'sectionDisciplineTypeName'
          },
          {
            text: 'Действия',
            value: 'sectionDisciplineTypeId', 
            sortable: false
          },
        ],
        newDisciplineName: '',
        selected: [],
        items: []
      }
    },
    created: function(){
      this.refresh()
    },
    methods: {
      addNewDicipline(){
        this.$http.post(this.$store.state.apiuri + '/v1/discipline-types',{
          sectionDisciplineTypeName: this.newDisciplineName
        })
        .then(_ => {
          this.newDisciplineName = ""
          this.refresh()
        })

      },
      deleteDiscipline(id){
        this.$http.delete(this.$store.state.apiuri + `/v1/discipline-types/${id}`)
        .then(_ => {
          this.refresh()
        })
      },
      refresh(){
        this.$http.get(this.$store.state.apiuri + "/v1/discipline-types")
        .then(res => this.items = res.data.map(el => {
          el.isChanging = false
          return el
        }))
      },
      edit(discipline) {
        let el = this.items.find(x => x.id === discipline.id)
        el.isChanging = true
        console.log(el)
      },
      save({sectionDisciplineTypeId, ...parametras}){
        // delete unnessesary information
        delete parametras.isChanging
        // save request
        this.$http.put(this.$store.state.apiuri + `/v1/discipline-types/${sectionDisciplineTypeId}`, parametras)
        .then(_ => {
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

<style lang="scss">
</style>
