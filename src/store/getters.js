// https://vuex.vuejs.org/en/getters.html

export default {
  isAdmin: state => state.user.role === 'admin',
  isDepartmentEmployee: state => state.user.role === 'department-e',
  isDepartmentHead: state => state.user.role === 'department-h',
  isLibraryEmployee: state => state.user.role === 'library-e',
}
