import { exception } from "vue-analytics";

// https://vuex.vuejs.org/en/state.html

export default {
  apiuri: 'http://localhost:8081/backend/web',
  editorText: '',
  codes: {
    // заглушка
    '000': {
      href: false,
      color: 'red'
    },
    // error without href
    '001': {
      href: false,
      color: 'red'
    },
    // error with href
    '002': {
      href: true,
      color: 'red'
    },
    // success without href
    '003': {
      href: false,
      color: 'green'
    },
  },
  snackbar: false,
  popup: {
    text: '',
    hrefText: '',
    href: '#',
    code: '000'
  },
  blacklisted: false,
  loading: false,
  refreshingState: false,
  unauthenticated: true,
  roles: {
    'admin': {
      color: '#1E88E5',
      name: 'Администратор'
    },
    'super_admin': {
      color: '#5E35B1',
      name: 'Главный администратор'
    },
    'unknown': {
      color: '#F44336',
      error: true,
      name: 'Пожалуйста авторизуйтесь'
    },
    'guest': {
      color: '#FBC02D',
      name: 'Гость'
    }
  },
  user: {
    name: 'Неизвестный',
    email: 'no-know@mail.what',
    role: 'unknown'
  },
  urls: []
}
