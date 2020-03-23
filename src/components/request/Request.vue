<template>
  <v-dialog v-model="activator" max-width="1000px" @click:outside="$emit('update:activator', false)">
      <v-card class="px-6">
        <v-card-title>
          Заявка на закуп/ издание литературы
        </v-card-title>
        <v-subheader>Новая литература</v-subheader>
        <v-data-table
          class="mb-12"
          :headers="resourceHeaders"
          :items="request.newResources"
        >
          <template v-slot:item.count="{ item }">
            <v-text-field 
              color="grey"
              :disabled="item.resourceTypeId === 3"
              type="number"
              v-model="item.count"
            ></v-text-field>
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
          <template v-slot:item.requestType="{ item }">
            <v-select 
              :items="requestTypes"
              v-model="item.requestType"
              color="grey"
            >               
            </v-select>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                  <v-btn
                  v-on="on"
                  @click="deleteResource(item, request.newResources)"
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
        <v-subheader>Сущесвующая литература</v-subheader>
        <v-data-table
            :headers="resourceHeaders"
            :items="request.resources"
          >
            <template v-slot:item.count="{ item }">
              <v-text-field 
                color="grey"
                :disabled="item.resourceTypeId === 3"
                type="number"
                v-model="item.count"
              ></v-text-field>
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
            <template v-slot:item.requestType="{ item }">
              <v-select 
                :items="requestTypes"
                v-model="item.requestType"
                color="grey"
              >               
              </v-select>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                    v-on="on"
                    @click="deleteResource(item, request.resources)"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" text @click="sendRequest">
              Отослать
            </v-btn>
            <v-btn color="blue" text @click="$emit('update:activator', false)">
              Отмена
            </v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>

    export default {
        props: {
          request: {
              type: Object,
              default() {
                return {
                  newResources: [],
                  resources: []
                }
              } 
          },
          activator: {
              type: Boolean,
              default: false
          },
        },
        data: _ => ({
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
            },
            {
              text: 'Тип ресурса',
              value: 'resourceType'
            },
            {
              text: 'Тип запроса',
              value: 'requestType'
            },
            {
              text: 'Действия',
              value: 'action', 
              sortable: false
            },
          ],
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
        }),
        watch: {
          activator: function(newVal){
            console.log(newVal)
            this.$emit("update:activator", newVal)
          },
          request: {
            handler: function(newVal){
              this.$emit("update:request", newVal)
            },
            deep: true
          }
        },
        created: function() {
          
        },
        beforeDestroy () {
        },
        methods: {
          deleteResource(item, arr){
            let pos = arr.map(el => el.resourceName).indexOf(item.resourceName)
            arr = arr.splice(pos, 1)
          },
          sendRequest(){
            this.request.done = true
            this.request.newResources.forEach(element => {
              delete element.section
              this.$http.post(`${this.$store.state.apiuri}/v1/requests/create-new-resource`, element)
              .catch(err => {
                this.request.done = false
              })              
            });
            this.request.resources.forEach(element => {
              delete element.section
              this.$http.post(`${this.$store.state.apiuri}/v1/requests`, element)
              .catch(err => {
                this.request.done = false
              })              
            });
          }
        }
    }
</script>