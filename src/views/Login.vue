<template>
  <v-container
    fluid
    class="login-container"
  >
      <v-row class="justify-center flex-column align-center">
        <v-col lg="4" xl="3" cols="12">
          <h2 class="mb-4 white--text">Добро пожаловать в систему управления учебно-методической деятельности ВУЗа</h2>
          <v-card dark class="pa-12 auth-card">
            <h1>Войти в систему</h1>
            <v-form class="ma-auto"
                    ref="form"
                    v-model="valid"
                    lazy-validation>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                color="primary"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                color="primary"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passRules"
                :type="showPass ? 'text' : 'password'"
                name="input-10-1"
                label="Пароль"
                @click:append="showPass = !showPass"
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                @click="submit"
              >
                Войти
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
  import Axios from 'axios'
  import {mapState, mapMutations} from "vuex";
  export default {
    data (vc) {
      return {
        valid: false,
        showPass: false,
        snackbar: false,
        password: '',
        passRules: [
          v => !!v || 'Необходимо ввести пароль',
        ],
        email: '',
        emailRules: [
          v => !!v || 'Необходимо ввести email',
          v => /.+@.+\..+/.test(v) || 'Неккоректный email',
        ],
      }
    },
    computed: {
      ...mapState(['apiuri']),
    },
    methods: {
      submit () {
        if(this.$refs.form.validate()){
          this.$http.post(this.apiuri + '/auth/login', {
            email: this.email,
            password: this.password
          })
          .then(res => {
              console.log(res)
              localStorage.setItem('access_token', res.data.access_token);
              console.log(res.data.user)
              this.$store.commit('SET_USER', res.data.user)
              this.$router.push('/')
          })
          .catch(err => {
            console.log(err)
              this.$store.commit('THROW_POPUP', {
                code: '001',
                text: 'Введены неверные данные'
              })

          })
        }
      },
      ...mapMutations(['THROW_POPUP'])
    },
  }
</script>

<style lang="scss" scoped>
  .login-container{
    height: 100vh;
    width: 100vw;
    flex-direction: column;
    display: flex;
    justify-content: center;
  }

  .auth-card{
    text-align: center !important;
  }

  h2 {
    color: #818181;
    text-align: center;
    & .v-card__title{
      text-align: center !important;
    }

  }
</style>
