import store from '../store'

export const roleChekerMixin = {
    methods:{
        isAdmin(){
            console.log(store.state.user.role)
            return store.state.user.role === 'admin'
        },
        isDepartmentHead(){
            return store.state.user.role === 'department-h'
        },
        isDepartmentEmployee(){
            return store.state.user.role === 'department-e'
        },
        isLibraryEmployee(){
            return store.state.user.role === 'library-e'
        },
    }
}
