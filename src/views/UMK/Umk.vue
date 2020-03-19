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
        <!-- <v-spacer></v-spacer> -->
        <v-btn v-if="!collapes" @click="save()" color="primary" class="black--text">
          Сохранить
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
                Юридичсеское обоснование
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
                <v-btn icon>
                  <v-icon large>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>



  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import TextEditor from '../../components/text-editor/TextEditor'

  export default {
    components:{
      TextEditor
    },
    data () {
      return {
        umk: {
            umkName: '',
            umkLawJustification: '',
            umkPurpose: '',
            umkStudentRequirements: []
        },
        requirementTypes: [],
        collapes: false
      }
    },
    created: function(){
      if(this.$route.params.id){
        this.$http.get(this.apiuri + `/v1/umk/${this.$route.params.id}`)
        .then(res => {
          this.umk = res.data
        })
        this.$http.get(`${this.$store.state.apiuri}/v1/student-requirement-type`)
        .then(res => {
          // console.log(res.data)
          this.requirementTypes = res.data
        })
      }
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
      }
    },
    methods: {
      save(){
        let method = this.$route.params.id ? 'put' : 'post'
        this.$http.request({
          url: `${this.$store.state.apiuri}/v1/umk` + (this.$route.params.id ? `/${this.$route.params.id}` : ''),
          method: method,
          data: this.umk
        })
      }
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
    background:rgb(241, 241, 241);
  }

</style>
