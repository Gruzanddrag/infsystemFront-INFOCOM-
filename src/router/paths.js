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
    path: '/umks',
    view: 'UMK/Umks',
    name: 'Учебно-Методические комплексы',
  },
  {
    path: '/disciplines',
    view: 'Discipline/Disciplines',
    name: 'Дисциплины',
  },
  {
    path: '/umk/:id',
    view: 'UMK/Umk',
    name: 'Редактирование УМК'
  },
  {
    path: '/umk/',
    view: 'UMK/Umk',
    name: 'Создание УМК'
  },
]
