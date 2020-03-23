<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card dark>
          <v-card-title>Панель управления пользователями</v-card-title>
          <v-divider inset></v-divider>
          <v-card-actions>
            <v-btn text color="primary" @click="openDialog({ name: '', surname: '', patronymic:'', phone:'', role: '', email: ''}, 'add')">
              Зарегистрировать нового пользователя
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Список пользователей
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
            item-key="userId"
          >
          <template v-slot:item.resourceId = "{ item, header, value }">
            <div class="d-flex align-center">
            </div>
          </template>
          <template v-slot:item.role = "{ item, value }">
              {{ roles.find(x => x.value === value).text }}
          </template> 
          <template v-slot:item.userId = "{ item, value }">
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
              <span>Изменить Профиль</span>
            </v-tooltip>
          </template> 
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="editUserDialog" max-width="600px">
      <v-card>
       <v-form ref="editUserDialog">
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field label="Фамилия" v-model="userToEdit.surname" ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Имя" v-model="userToEdit.name" ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Отчество" v-model="userToEdit.patronymic" ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Телефон" v-model="userToEdit.phone" ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email" v-model="userToEdit.email" ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-if="!userToEdit.userId" label="Пароль" v-model="userToEdit.password" ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select label="Роль" v-model="userToEdit.role" :items="roles" ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editRequestDialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="save(userToEdit)">Сохранить</v-btn>
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
            text: 'Фамилия',
            value: 'surname'
          },
          {
            text: 'Имя',
            value: 'name'
          },
          {
            text: 'Отчество',
            value: 'patronymic'
          },
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Телефон',
            value: 'phone'
          },
          {
            text: 'Роль',
            value: 'role'
          },
          {
            text: 'Действия',
            value: 'userId', 
            sortable: false
          },
        ],
        userToEdit: {
          name: '',
          surname: '',
          patronymic: 0,
          phone: '',
          email: '',
          role: ''
        },
        editUserDialog: false,
        items: [],
        mode: 'add', // edit
        roles: [
          {
            text: 'Администратор',
            value: 'admin'
          },
          {
            text: 'Сотрудник кафедры',
            value: 'department-e'
          },
          {
            text: 'Заведующий кафедрой',
            value: 'department-h'
          },
          {
            text: 'Сотрудник библиотеки',
            value: 'library-e'
          },
        ]
      }
    },
    created: function(){
      this.refresh()
    },
    computed: {},
    methods: {
      refresh(){
        this.$http.get(this.$store.state.apiuri + "/auth/index")
        .then(res => this.items = res.data)
        this.$http.get(this.$store.state.apiuri + "/v1/resource-types")
        .then(res => this.resourceTypes = res.data)
      },
      openDialog(item, mode){
        this.userToEdit = Object.assign(this.userToEdit, item) 
        this.userToEdit.password = ""
        this.mode = mode
        this.editUserDialog = true
      },
      save({ userId, ...parametras}){
        if(this.mode === 'add'){
          this.$http.post(this.$store.state.apiuri + '/auth/registration', parametras)
          .then(_ => {
            this.editUserDialog = false
            this.refresh()
          })
        } else if(this.mode === 'edit'){
          console.l0og
          this.$http.put(this.$store.state.apiuri + '/auth/update', parametras, {
            params: {
              id: userId
            }
          })
          .then(_ => {
            this.editUserDialog = false
            this.refresh()
          })
        } 
      }
    },
  }
</script>

<style lang="scss">
</style>
