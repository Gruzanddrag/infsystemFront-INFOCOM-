import Axios from "axios"
import store from '../store'
import router from '../router'


var inst = Axios.create()
  
inst.interceptors.response.use(response => {
    let res = response.data
    if(!res.status && res.data.name === "Unauthorized"){
        if(!localStorage.getItem('access_token')){
            router.push('/login')
        }
    }
    return response
}, error => {
    return Promise.reject(error);
});

inst.interceptors.request.use(request => {
    console.log(request)
    return request
}, error => {
    return Promise.reject(error);
});

export default inst
