<template>

  <draggable
    class="dragArea"
    tag="ul"
    :list="children"
    :group="{ name: 'g1' }"
    v-bind="dragOptions"
  >
    <li v-for="el in children" :key="el.id">
      <v-card class="mb-3">
        <v-fade-transition hide-on-leave>
          <div class=" d-flex align-center" v-if="!el.editing">
            <v-card-title>{{el.text}}</v-card-title>
            <v-btn icon @click="el.editing = true"><v-icon>mdi-pencil-outline</v-icon></v-btn>
            <v-btn icon @click="delUrl(el.id)"><v-icon>mdi-close</v-icon></v-btn>
          </div>
          <div v-else class="pa-4 editing">
            <v-text-field
              v-model="el.text"
              label="Текст ссылки"
            ></v-text-field>
            <v-select
              v-model="el.url_id"
              :items="$store.state.urls"
            >
            </v-select>
            <v-text-field
              v-if="!el.url_id "
              v-model="el.customUrl"
              label="Другой URl"
            ></v-text-field>

            <v-btn text color="blue" @click="el.editing = false">Сохранить</v-btn>
          </div>
        </v-fade-transition>
      </v-card>
<!--      <nested-draggable v-if="el.group" :children="el.children" :class="{ dashes: el.children.length === 0, 'deep-level': el.group}" />-->
    </li>
  </draggable>
</template>
<script>
  import draggable from "vuedraggable";
  export default {
    props: {
      children: {
        required: true,
        type: Array
      }
    },
    data() {
      return {
        drag: false
      }
    },
    components: {
      draggable
    },
    methods:{
      delUrl(id){
        let ind = this.children.findIndex(x => x.id === id)
        this.children.splice(ind, 1)
      }
    },
    computed:{
      dragOptions() {
        return {
          animation: 100,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      },
    },
    name: "nested-draggable"
  };
</script>

<style scoped lang="scss">
  .dragArea {
    min-height: 50px;
    list-style: none;

    & li {
      margin-top:10px
    }
  }
  .dashes {
    border: 3px #4caf50 dashed;
  }

  .deep-level{
    background: white;

    & li .v-card{
      border:3px solid #4caf50;
    }
  }
</style>

