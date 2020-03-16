export const tokenHandler = {
    methods:{
        catchTokenException(err_data, store, repeated){
            const msg = err_data.msg
            if(msg === "TOKEN_MISSING" || msg === "TOKEN_INVALID" || msg === "NOT_AVAILABLE_FOR_CURRENT_USER"){
                store.commit('THROW_POPUP', {
                  'text': 'У вас нет прав на это',
                  'code': '002',
                  'hrefText': 'Авторизоваться',
                  'href': '/login',
                })
            } else {
                store.commit('THROW_POPUP',{
                  'text': 'Что-то пошло не так',
                  'code': '001',
                  'hrefText': 'Авторизоваться',
                  'href': '/login',
                })
            }
        }
    }
}
