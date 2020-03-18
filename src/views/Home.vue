<template>
  <v-container
    fluid
    class="main-container"
  >
  <v-row style="height: 100%;" class="align-center" justify="center">
    <v-col v-if="!loading" class="text-center" lg=5>
        <h1>Добро пожаловать в систему управления учебно-методической деятельности,</h1>
        <h1 style="color: #FFD600">{{`${user.surname} ${user.name} ${user.patronymic}`}}</h1>
        <h2 v-if="$store.getters.isAdmin" style="color:gray" >Администратор</h2>
    </v-col>
  </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    created: function(){
    },
    methods: {},
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
