/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */

export default [
  {
    path: '/',
    view: 'Home',
    name: 'Главная',
  },
  {
    path: '/login',
    view: 'Login',
    name: 'login',
  },
  {
    path: '/umk',
    view: 'UMK/Umk',
    name: 'Учебно-Методические комплексы',
  },
]
