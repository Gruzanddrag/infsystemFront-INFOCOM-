import Axios from "axios"
import store from '../store'
import router from '../router'


function logout(){
    store.commit('SET_AUTHENTICATED_STATUS', false);
    localStorage.setItem('access_token', "")
    router.push('/login')
}


var inst = Axios.create()
  
inst.interceptors.response.use(response => {
    store.commit('SET_AUTHENTICATED_STATUS', true)
    store.commit('SET_LOADING', false)
    return response.data
}, error => {
    let response = error.response
    let res = response ? response.data : null
    if(!res){
        console.dir(error)
        return Promise.reject(error)
    }
    let tokenFromRequest = error.config.headers['Authorization'].split(' ')[1]
    if(res.data.name === "Unauthorized"){
        if(localStorage.getItem('access_token') === ""){
            logout()
        }
        if(!store.state.refreshingState && localStorage.getItem('access_token') === tokenFromRequest ){
            store.commit('SET_REFRESHING_STATE', true);
            store.commit('SET_AUTHENTICATED_STATUS', false);
            let reponseConfig = error.config
            return Axios.get(store.state.apiuri + '/auth/refresh',{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            .then(res => {
                if(res.data.status){
                    console.log(res)
                    localStorage.setItem('access_token', res.data.data.access_token)
                    store.commit('SET_REFRESHING_STATE', false);
                    reponseConfig.baseUrl = undefined
                    return inst.request(reponseConfig)
                }
            })
            .catch(_ => {
                store.commit('SET_LOADING', false)  
                logout()
            })
        } else if(store.state.authenticated){
            let conf = error.config
            conf.baseUrl = undefined
            if(localStorage.getItem('access_token') != null){
                return inst.request(conf)
            } else {
                logout()
            }
        }
    }
    store.commit('SET_LOADING', false)
    return Promise.reject(error);
});

inst.interceptors.request.use(request => {
    store.commit('SET_LOADING', true)
    request.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
    // console.log(`uri: ${request.url}  token:  ${request.headers["Authorization"]}`)
    return request
}, error => {
    return Promise.reject(error);
});

export default inst
