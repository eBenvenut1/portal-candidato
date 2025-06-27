/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const GestoresController = () => import('#controllers/gestors_controller')
import { middleware } from '#start/kernel'


router.group(() => {
  router.get('/', async () => {
    return {
      hello: 'world',
    }
  }).use(middleware.auth())

  router.post("user/register", [UsersController, 'store'])
  router.post("gestor/register", [GestoresController, 'store'])
  router.post('/login', [UsersController, 'login'])
  router.get('users/profile', [UsersController, 'profile']).use(middleware.auth())
  router.get('dashboard/candidatos', [UsersController, 'index']).use(middleware.isgestor())
  router.post('/send-meeting-email', [GestoresController, 'notifyCandidato'])
  router.get('user/search', [UsersController, 'searchCandidato']).use(middleware.isgestor())
  router.put('user/', [UsersController, 'editProfile']).use(middleware.auth())




}).prefix('/api')
