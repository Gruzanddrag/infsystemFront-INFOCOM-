import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#FFD600',
        secondary: '#FFD600',
        tertiary: '#495057',
        accent: '#82B1FF',
        error: '#f55a4e',
        info: '#00d3ee',
        success: '#5cb860',
        warning: '#ffa21a',
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
  lang: {
    locales: { ru },
    current: 'ru',
  },
})
