import Axios from "axios"
import store from '../store'
import router from '../router'


var inst = Axios.create()
  
inst.interceptors.response.use(response => {
    store.commit('SET_AUTHENTICATED_STATUS', true)
    store.commit('SET_LOADING', false)
    return response.data
}, error => {
    let response = error.response
    let res = response.data
    if(res.data.name === "Unauthorized"){
        if(localStorage.getItem('access_token') === ""){
            store.commit('SET_AUTHENTICATED_STATUS', false);
            localStorage.setItem('access_token', "")
            router.push('/login')
        }
        if(!store.state.refreshingState){
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
                store.commit('SET_AUTHENTICATED_STATUS', false);
                localStorage.setItem('access_token', "")
                router.push('/login')   
            })
        } else {
            reponseConfig.baseUrl = undefined
            return inst.request(reponseConfig)
        }
    }
    store.commit('SET_LOADING', false)
    return Promise.reject(error);
});

inst.interceptors.request.use(request => {
    store.commit('SET_LOADING', true)
    request.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
    // console.log(request)
    return request
}, error => {
    return Promise.reject(error);
});

export default inst
