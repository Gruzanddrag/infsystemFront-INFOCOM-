import Axios from "axios"
import store from '../store'
import router from '../router'


var inst = Axios.create()
  
inst.interceptors.response.use(response => {
    let res = response.data
    if(!res.status && res.data.name === "Unauthorized"){
        if(localStorage.getItem('access_token') === ""){
            store.commit('SET_AUTHENTICATED_STATUS', false);
            localStorage.setItem('access_token', "")
            router.push('/login')
        }
        if(!store.state.refreshingState){
            store.commit('SET_REFRESHING_STATE', true);
            store.commit('SET_AUTHENTICATED_STATUS', false);
            let reponseConfig = response.config
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
                    let config = reponseConfig
                    config.baseUrl = undefined
                    return inst.request(config)
                } else {
                    store.commit('SET_AUTHENTICATED_STATUS', false);
                    localStorage.setItem('access_token', "")
                    router.push('/login')   
                }
            })
        } else {
            let config = response.config
            config.baseUrl = undefined
            return inst.request(config)
        }
    }
    store.commit('SET_AUTHENTICATED_STATUS', true);
    store.commit('SET_LOADING', false)
    return res
}, error => {
    return Promise.reject(error);
});

inst.interceptors.request.use(request => {
    store.commit('SET_LOADING', true)
    request.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
    return request
}, error => {
    return Promise.reject(error);
});

export default inst
