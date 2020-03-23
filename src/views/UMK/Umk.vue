<template>
  <v-container
    fluid
  >
    <v-toolbar :collapse="collapes" min-width="170" dark class="umk-toolbar">
        <v-text-field
          v-if="!collapes"
          hide-details=""
          class="pr-5"
          outlined=""
          label="Наименование"
          style="width: 500px"
          v-model="umk.umkName"></v-text-field>
        <v-btn v-if="!collapes" @click="requestDialog = true" color="primary" class="black--text mr-3">
          Заявка
        </v-btn>
        <v-tooltip bottom v-if="!canPublish">
          <template v-slot:activator="{ on }">
            <div
            v-on="on">
              <v-btn 
              :disabled="!canPublish"
              v-if="!collapes" 
              @click="save()" 
              color="primary" 
              class="black--text">
                Опубликовать
              </v-btn>
            </div>
          </template>
          <span>Необходимо отослать заявку на литиратуру</span>  
        </v-tooltip>
        <v-btn 
        v-else-if="!collapes"
        @click="save()" 
        color="primary" 
        class="black--text">
          Опубликовать
        </v-btn>
        <v-btn v-if="!collapes" @click="$router.push('/umks')" text color="red">
          Отмена
        </v-btn>
        <v-tooltip v-if="collapes" bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="save()" v-on="on" color="primary" icon>
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
          </template>
          <span>Сохранить изменения</span>  
        </v-tooltip>
        <v-tooltip v-if="collapes" bottom>
          <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="$router.push('/umks')" icon color="red">
                <v-icon>mdi-cancel</v-icon>
              </v-btn>
          </template>
          <span>Отменить редактирование</span>  
        </v-tooltip>
        <v-btn @click="collapes = !collapes" icon>
          <v-icon v-if="collapes">mdi-menu-right</v-icon>
          <v-icon v-else>mdi-menu-left</v-icon>
        </v-btn>
    </v-toolbar>
    <v-row class="mt-12 pt-6" justify="center">
      <v-col cols="12" lg=8>
        <v-card class="pa-12">
          <v-card-text>
            <h1 class="display-3 px-4">{{umk.umkName}}</h1>
            <v-divider inset class="my-6"></v-divider>
            <v-card class="mx-6">
              <v-card-title>
                Цель Учебно-Методического комплекса
              </v-card-title>
              <v-card-text class="card-text-editor">
                <text-editor :text.sync="umk.umkPurpose"></text-editor>
              </v-card-text>
            </v-card>
            <v-divider inset class="my-6"></v-divider>
            <v-card class="mx-6">
              <v-card-title>
                Юридическое обоснование
              </v-card-title>
              <v-card-text class="card-text-editor">
                <text-editor :text.sync="umk.umkLawJustification"></text-editor>
              </v-card-text>
            </v-card>
            <v-divider inset class="my-6"></v-divider>
            <v-card class="mx-6">
              <v-toolbar flat color="grey lighten-2" class="px-5">
                <v-toolbar-title>
                    Требования к студенту
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="addRequirement" icon>
                  <v-icon large>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <div v-for="(item, i) in umkStudentRequirementsFiltered" :key="i" >
                    <v-row justify="center" class="align-center" >
                    <v-col cols=3>
                      <v-select
                        outlined
                        hide-details
                        v-model="item.studentRequirementTypeId"
                        :items="selectRequirementTypes"
                        label="Тип требования"
                      ></v-select>
                    </v-col>
                    <v-col cols=8>
                        <v-textarea
                          hide-details
                          auto-grow
                          outlined
                          rows="1"
                          v-model="item.studentRequirementText"
                          label="Требование"
                        ></v-textarea>
                    </v-col>
                    <v-col cols=1>
                      <v-btn icon @click="item.deleted = true">
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-divider class="mb-6"></v-divider>
                </div>
              </v-card-text>
            </v-card>
            <v-divider inset class="my-6"></v-divider>
            <v-subheader>Секции УМК</v-subheader>
            <v-toolbar color="grey lighten-2">
              <v-toolbar-title>
                    Управление разделами УМК
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="addSection">
                  Добавить раздел
                </v-btn>
            </v-toolbar>
            <div class="sections">
              <div class="section" v-for="(section, i) in umkSectionsFiltered" :key="i">
                <div class="d-flex align-center mb-6">
                  <v-text-field 
                    v-model="section.sectionName"
                    hide-details 
                    label="Наименование раздела" 
                    outlined></v-text-field>
                  <v-btn 
                    class="ml-4 white--text"
                    color="red"
                    @click="section.deleted = true">
                    Удалить раздел
                  </v-btn>
                </div>
                <v-expand-transition>
                  <div class="section-content  px-6"  v-if="section.isShown">
                    <v-card class="mb-6">
                      <v-card-title>
                        Дисциплины раздела
                      </v-card-title>
                      <v-card-text class="card-text-editor">
                        <v-combobox
                          outlined
                          v-model="section.chosenDiscipline"
                          :items="selectDisciplines"
                          @change="addDisciplineToSection($event, section);"
                          label="Поиск дисциплин"
                        ></v-combobox>
                        <v-data-table
                          :headers="disciplineHeaders"
                          :items="section.sectionDiscipline"
                          :search="feacha"
                          :custom-filter="dataDeletedFilter"
                        >
                          <template v-slot:item.disciplineName="{ item, header, value }">
                            {{ value || disciplines.find(x => x.disciplineId === item.disciplineId).disciplineName }}
                          </template>
                          <template v-slot:item.sectionDisciplineHours="{ item, header, value }">
                            <v-text-field 
                              color="grey"
                              type="number"
                              v-model="item.sectionDisciplineHours"
                            ></v-text-field>
                          </template>
                          <template v-slot:item.sectionDisciplineTypeId="{ item, header, value }">
                            <v-select
                              color="grey"
                              v-model="item.sectionDisciplineTypeId"
                              :items="selectDisciplineTypes"
                            ></v-select>
                          </template>
                          <template v-slot:item.sectionDisciplineId="{ item, header, value }">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                  <v-btn
                                  v-on="on"
                                  @click="deleteDicsipline(item)"
                                  icon>
                                      <v-icon>
                                        mdi-trash-can-outline
                                      </v-icon>
                                  </v-btn>
                              </template>
                              <span>Удалить</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card >
                    <v-card class="mb-6">
                      <v-card-title>
                        Описание раздела
                      </v-card-title>
                      <v-card-text class="card-text-editor">
                        <text-editor :text.sync="section.sectionDescription"></text-editor>
                      </v-card-text>
                    </v-card>
                    <v-card class="mb-6">
                      <v-toolbar>
                        <v-toolbar-title>
                            Рекомендованная литература
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                          <template v-slot:activator = "{ on }">
                              <v-btn 
                              v-on="on"
                              @click="addInternetResource(section)"
                              icon>
                                <v-icon>
                                  mdi-web
                                </v-icon>
                              </v-btn>
                          </template>
                          <span>Добавить интернет источник</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator = "{ on }">
                              <v-btn 
                              v-on="on"
                              @click="addNewResource(section)"
                              icon>
                                <v-icon>
                                  mdi-book-plus-multiple
                                </v-icon>
                              </v-btn>
                          </template>
                          <span>Добавить новую литературу в заявку</span>
                        </v-tooltip>
                      </v-toolbar>
                      <v-card-text class="card-text-editor">
                        <v-combobox
                          outlined
                          v-model="section.chosenResource"
                          :items="selectResources"
                          @change="addResourceToSection($event, section)"
                          label="Поиск литературы"
                        ></v-combobox>
                        <v-data-table
                          :headers="resourceHeaders"
                          :items="section.resources"
                          :search="feacha"
                          :custom-filter="dataDeletedFilter"
                        >
                          <template v-slot:item.count="{ item }">
                            <v-form lazy-validation>
                              <v-text-field 
                                color="grey"
                                :disabled="item.resourceTypeId === 3"
                                type="number"
                                :rules=[countRule(item)]
                                v-model="item.count"
                              >
                              <template v-slot:message="{ message }">
                                  {{message}} 
                                  <a style="color: #f55a4e; text-decoration: underline"  @click="addResourceToRequest(item)">Добавить в заявку</a>
                              </template>
                              </v-text-field>
                            </v-form>
                          </template>
                          <template v-slot:item.resourceUrl="{ item, value }">
                            {{ value || 'Нет' }}
                          </template>
                          <template v-slot:item.actions="{ item }">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                  <v-btn
                                  v-on="on"
                                  @click="deleteResource(item)"
                                  icon>
                                      <v-icon>
                                        mdi-trash-can-outline
                                      </v-icon>
                                  </v-btn>
                              </template>
                              <span>Удалить</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-expand-transition>
                <v-btn text class="section--showbtn" @click="section.isShown = !section.isShown">
                  {{ section.isShown ? 'Свернуть' : 'Развернуть' }}
                </v-btn>
              </div>
            </div>
            <!-- umk resouces  -->
            <v-card class="my-6 mt-12">
              <v-toolbar>
                <v-toolbar-title>
                    Рекомендованная литература (Для всего комплекса)
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator = "{ on }">
                      <v-btn 
                      v-on="on"
                      @click="addInternetResource(umk)"
                      icon>
                        <v-icon>
                          mdi-web
                        </v-icon>
                      </v-btn>
                  </template>
                  <span>Добавить интернет источник</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator = "{ on }">
                      <v-btn 
                      v-on="on"
                      @click="addNewResource(umk)"
                      icon>
                        <v-icon>
                          mdi-book-plus-multiple
                        </v-icon>
                      </v-btn>
                  </template>
                  <span>Добавить новую литературу в заявку</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text class="card-text-editor">
                <v-combobox
                  outlined
                  v-model="umk.chosenResource"
                  :items="selectResources"
                  @change="addResourceToSection($event, umk)"
                  label="Поиск литературы"
                ></v-combobox>
                <v-data-table
                  :headers="resourceHeaders"
                  :items="umk.resources"
                  :search="feacha"
                  :custom-filter="dataDeletedFilter"
                >
                  <template v-slot:item.count="{ item }">
                    <v-form lazy-validation>
                      <v-text-field 
                        color="grey"
                        :disabled="item.resourceTypeId === 3"
                        type="number"
                        :rules=[countRule(item)]
                        v-model="item.count"
                      >
                      <template v-slot:message="{ message }">
                          {{message}} 
                          <a style="color: #f55a4e; text-decoration: underline"  @click="addResourceToRequest(item)">Добавить в заявку</a>
                      </template>
                      </v-text-field>
                    </v-form>
                  </template>
                  <template v-slot:item.sectionDisciplineTypeId="{ item }">
                    <v-select
                      color="grey"
                      v-model="item.sectionDisciplineTypeId"
                      :items="selectDisciplineTypes"
                    ></v-select>
                  </template>
                  <template v-slot:item.resourceUrl="{ item, value }">
                    {{ value || 'Нет' }}
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                          <v-btn
                          v-on="on"
                          @click="deleteResource(item)"
                          icon>
                              <v-icon>
                                mdi-trash-can-outline
                              </v-icon>
                          </v-btn>
                      </template>
                      <span>Удалить</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOGS -->
    <!-- new internt resource dialog -->
     <v-dialog v-model="dialogNewInternetResource" max-width="600px">
      <v-card>
       <v-form ref="newInternetResourceForm">
        <v-card-title>
          <span class="headline">Добавление интернет ресурса</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Название ресурса" v-model="newInternetResource.resourceName" :rules="[requireRule]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Ссылка"  v-model="newInternetResource.resourceUrl" :rules="[requireRule]"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*ресурс будет помещен в базу для дальнейшего использования</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogNewInternetResource = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="saveInternetResource">Добавить</v-btn>
        </v-card-actions>
       </v-form>
      </v-card>
    </v-dialog>
    <!-- new resouce dialog -->
     <v-dialog v-model="dialogNewResource" max-width="600px">
      <v-card>
       <v-form ref="newResourceForm">
        <v-card-title>
          <span class="headline">Добавление новой литературы в заявку</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Название литературы" v-model="newResource.resourceName" :rules="[requireRule]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="newResource.resourceTypeId" lable="Тип литиратуры" :items="selectResourceTypes"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Количество" v-model="newResource.count" type="number" :rules="[requireRule]"></v-text-field>
              </v-col>
            </v-row>
            <small>*литература сразу добавиться в список</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogNewInternetResource = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="addNewResourceToRequest">Добавить</v-btn>
        </v-card-actions>
       </v-form>
      </v-card>
    </v-dialog>
    <request-dialog :request.sync="request" :activator.sync="requestDialog"></request-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import TextEditor from '../../components/text-editor/TextEditor'
import RequestDialog from '../../components/request/Request'
import { roleChekerMixin } from '../../mixins/roleCheckerMixin'

  export default {
    mixins: [
      roleChekerMixin,
      
    ],
    components:{
      TextEditor,
      RequestDialog
    },
    data () {
      return {
        umkStudentRequirements: [],
        sections: [],
        resourceForRequest: [],
        feacha: '',
        umk: {
            umkName: '',
            umkLawJustification: '',
            umkTotalHours: '',
            umkPurpose: '',
            chosenResource: [],
            resources: [],
        },
        requirementTypes: [],
        disciplines: [],
        requireRule: v => !!v || 'Это поле обязательно',
        dialogNewInternetResource: false,
        newInternetResource: {
          resourceName: '',
          resourceUrl: ''
        },
        newResource: {
          resourceName: '',
          resourceTypeId: 1,
          count: 0
        },
        request: {
          newResources: [],
          resources: [],
          done: false
        },
        resources: [],
        disciplineTypes: [],
        resourceTypes: [],
        collapes: false,
        dialogNewResource: false,
        disciplineHeaders: [
          {
            text: 'Наименование дисциплины',
            value: 'disciplineName'
          },
          {
            text: 'Количество часов',
            value: 'sectionDisciplineHours'
          },
          {
            text: 'Тип занятий',
            value: 'sectionDisciplineTypeId'
          },
          {
            text: 'Действия',
            value: 'sectionDisciplineId', 
            sortable: false
          },
        ],
        resourceHeaders: [
          {
            text: 'Наименование ресурса',
            value: 'resourceName',
          },
          {
            text: 'Ссылка на интернет ресурс',
            value: 'resourceUrl',
          },
          {
            text: 'Количество',
            value: 'count',
            width: 200,
          },
          {
            text: 'Тип ресурса',
            value: 'resourceType'
          },
          {
            text: 'Действия',
            value: 'actions', 
            sortable: false
          },
        ],
        requestDialog: false,
        countRule: v => v.count <= v.resourceCountAvalible || 'Недостаточно книг на складе'
      }
    },
    created: function(){
      if(this.$route.params.id){
        this.$http.get(this.apiuri + `/v1/umk/${this.$route.params.id}`)
        .then(res => {
          this.umk = Object.assign(this.umk,res.data)
          this.umkStudentRequirements = this.umk.umkStudentRequirements.map(el => {
            el.deleted = false
            return el
          })
          this.sections = this.umk.umkSections.map(el => {
            el.deleted = false
            el.isShown = false
            el.sectionDiscipline.map(dis => {
              dis.deleted = false
              return el
            })
            el.resources.map(dis => {
              dis.deleted = false
              return el
            })
            return el
          })
        })
      }
      
        // initialization
        // get Student Requrement Types
        this.$http.get(`${this.$store.state.apiuri}/v1/student-requirement-type`)
        .then(res => {
          this.requirementTypes = res.data
        })
        // get Disciplines
        this.$http.get(`${this.$store.state.apiuri}/v1/disciplines`)
        .then(res => {
          this.disciplines = res.data
        })
        // get Discipline types
        this.$http.get(`${this.$store.state.apiuri}/v1/discipline-types`)
        .then(res => {
          this.disciplineTypes = res.data
        })
        // get resources
        this.$http.get(`${this.$store.state.apiuri}/v1/resources`)
        .then(res => {
          this.resources = res.data
        })
        // get resources types
        this.$http.get(`${this.$store.state.apiuri}/v1/resource-types`)
        .then(res => {
          this.resourceTypes = res.data
        })
    },
    computed:{
      ...mapState(['apiuri']),
      selectRequirementTypes: function(){
        let arr = this.requirementTypes.map(el => { return {
            text: el.studentRequirementTypeAlias,
            value: el.studentRequirementTypeId
          }
        })
        return arr
      },
      selectDisciplines: function(){
        let arr = this.disciplines.map(el => { return {
            text: el.disciplineName,
            value: el.disciplineId
          }
        })
        return arr
      },
      canPublish: function() {
        return (this.request.resources.length === 0 && this.request.newResources.length === 0) || this.request.done
      },
      selectDisciplineTypes: function(){
        let arr = this.disciplineTypes.map(el => { return {
            text: el.sectionDisciplineTypeName,
            value: el.sectionDisciplineTypeId
          }
        })
        return arr
      },
      selectResourceTypes: function(){
        let arr = this.resourceTypes.map(el => { return {
            text: el.resourceTypeAlias,
            value: el.resourceTypeId
          }
        })
        return arr
      },
      selectResources: function(){
        let arr = this.resources.map(el => { return {
            text: `${el.resourceName} (${el.resourceType})`,
            value: el.resourceId
          }
        })
        return arr
      },
      umkStudentRequirementsFiltered: function() {
        return this.umkStudentRequirements.filter(x => !x.deleted)
      },
      umkSectionsFiltered: function() {
        return this.sections.filter(x => !x.deleted)
      },
    },
    methods: {
      save(){
        let method = this.$route.params.id ? 'put' : 'post'
        this.umk.umkStudentRequirements = this.umkStudentRequirements
        this.umk.sections = this.sections.filter(el => (el.deleted && el.sectionId !== undefined) || !el.deleted);
        this.umk.umkTotalHours = 0
        this.umk.sections.forEach(el => {
          el.sectionDiscipline = el.sectionDiscipline.filter(ele => (ele.deleted && ele.sectionDisciplineId !== undefined) || !ele.deleted);
          el.resources = el.resources.filter(ele => (ele.deleted && ele.id !== undefined) || !ele.deleted);
          el.sectionDiscipline.forEach(el => {
            if(!el.deleted){
              this.umk.umkTotalHours += el.sectionDisciplineHours
            }
          })
        })
        // 
        this.$http.request({
          url: `${this.$store.state.apiuri}/v1/umk` + (this.$route.params.id ? `/${this.$route.params.id}` : ''),
          method: method,
          data: this.umk
        })
      },
      addRequirement() {
        console.log(this.umk)
        this.umkStudentRequirements.push({
          studentRequirementText: '',
          studentRequirementTypeId: 1,
          deleted: false,
        })
      },
      addSection(){
        this.sections.push({
          sectionName: 'Наименование раздела',
          sectionDiscipline: [],
          sectionDescription: 'Описание занятий раздела, что будет выполняться, что будет на лекциях и так далее',
          isShown: true,
          deleted: false,
          sectionResource: [],
          chosenDiscipline: [],
          chosenResource: []
        })
      },
      addDisciplineToSection(e, section){
        if(e){
          section.sectionDiscipline.push({
            disciplineId: e.value,
            disciplineName: e.text,
            sectionDisciplineHours: 0,
            sectionDisciplineTypeId: null
          })
          section.chosenDiscipline = []
        }
      },
      dataDeletedFilter(val ,search, item){
        return !item.deleted
      },
      deleteDicsipline(item) {
        item.deleted = true
        this.feacha = (new Date()).getTime().toString()
      },
      addInternetResource(section) {
        this.dialogNewInternetResource = true
        this.newInternetResource.section = section
      },
      addNewResource(section) {
        this.dialogNewResource = true
        this.newResource.section = section
      },
      saveInternetResource(){
        if(this.$refs.newInternetResourceForm.validate()){
          this.$http.post(`${this.$store.state.apiuri}/v1/resources/add-internet-resource`, this.newInternetResource)
          .then(res => {
            this.newInternetResource.section.resources.push(res.data)
          })
        }
      },
      addResourceToSection(e, section){
        if(e){
          console.log(e)
          let res = this.resources.find(x => x.resourceId === e.value)
          let resource = { ...res, count: 0, deleted: false }
          section.resources.push(resource)
          section.chosenResource = []
        }
      },
      deleteResource(item) {
        item.deleted = true
        this.feacha = (new Date()).getTime().toString()
      },
      addResourceToRequest(resource){
          console.log(resource)
          this.request.resources.push({
            ...resource,
            count: resource.count - resource.resourceCountAvalible,
            requestType: 'procure'
          })
          this.$store.commit('THROW_POPUP', {
            code: '003',
            text: 'Литература была добавлена в заявку'
          })
      },
      addNewResourceToRequest(section) {
        this.request.newResources.push({
          ...this.newResource,
          resourceType: this.selectResourceTypes.find(x => x.resourceTypeId === this.newResource.resorceTypeId).text,
          requestType: 'procure'
        })
        this.newResource.section.resources.push({
          ...this.newResource,
          resourceType: this.selectResourceTypes.find(x => x.resourceTypeId === this.newResource.resorceTypeId).text,
          deleted: false
        })
        this.newResource.section = null
        this.dialogNewResource = false
      },
    }
  }
</script>

<style lang="scss">
  .umk-toolbar {
    // position: fixed;
    z-index: 200;
  }

  .editor__content{
    // font-size: 20px;
    color: black;
  }

  .card-text-editor {
    padding: 20px !important;
    min-height: 150px;
    background:rgb(249, 249, 249);
  }

</style>

<style lang="scss" scoped>

  .sections {
    padding-left: 20px;
    padding-top: 20px;
  }

  .section {
    padding: 20px;
    padding-bottom: 50px;
    position: relative;
    margin-bottom: 20px;
    border-left: 1px solid #BDBDBD;
    
    &--showbtn {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

</style>

