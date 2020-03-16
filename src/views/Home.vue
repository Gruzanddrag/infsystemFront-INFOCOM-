<template>
  <v-container
    fluid
    class="main-container"
  >
    <div class="welcome-wrapper" v-if="!loading">
      <h1>Добро пожаловать в систему управления учебно-методической деятельности,</h1>
      <h1 style="color: #FFD600">Никита Булахов</h1>
    </div>
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
        set: function(val){
          this.$store.commit('SET_USER', val)
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
