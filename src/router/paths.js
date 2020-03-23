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
    path: '/discipline-types',
    view: 'DisciplineTypes/DisciplineTypes',
    name: 'Типы дисциплин',
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
  {
    path: '/requests',
    view: 'Requests/Requests',
    name: 'Заявки в библиотеку'
  },
  {
    path: '/library',
    view: 'Library/Library',
    name: 'Библиотека'
  },
  {
    path: '/library-movement',
    view: 'Library/LibraryMovement',
    name: 'Движения ресурсов'
  },
  {
    path: '/users',
    view: 'Users/Users',
    name: 'Пользователи'
  },
]
