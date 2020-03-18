// https://vuex.vuejs.org/en/getters.html

export default {
  isAdmin: state => state.user.role === 'admin',
}
