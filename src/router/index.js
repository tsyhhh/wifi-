import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import home from '../components/Home'
import Register from '../components/Register'
import ForgetPwd from '../components/ForgetPwd'
import Welcome from '../components/Welcome'
import Verify from '../components/Verify'
import UnFind from '../components/UnFind'

//个人
import ChangeUserInfo from '../components/user/ChangeUserInfo'
import ChangeUserPwd from '../components/user/ChangeUserPwd'
import ChangeUserFaces from '../components/user/ChangeUserFaces'
import MyFeedBack from '../components/user/MyFeedBack'

//管理员
import Users from '../components/manager/Users'

//超级管理员
import ApplicationManager from '../components/superManager/ApplicationManager'
import SignInLog from '../components/superManager/SignInLog'
import UserFeedBack from '../components/superManager/UserFeedBack'
import Managers from '../components/superManager/Managers'

//个人
import UpLoadNew from '../components/upload/UpLoadNew'
import Statistics from '../components/upload/Statistics'
import UploadRecords from '../components/upload/UploadRecords'

import RunSimulation from '../components/simulation/RunSimulation'
import walkSimulation from '../components/simulation/WalkSimulation'
import WaveSimulation from '../components/simulation/WaveSimulation'

import WavePhase from '../components/phase/WavePhase'
import WalkPhase from '../components/phase/WalkPhase'
import RunPhase from '../components/phase/RunPhase'

import WaveAmplitude from '../components/amplitude/WaveAmplitude'
import RunAmplitude from '../components/amplitude/RunAmplitude'
import WalkAmplitude from '../components/amplitude/WalkAmplitude'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Welcome', },
  { path: '/login', component: Login },
  { path: '/Welcome', component: Welcome },
  { path: '/Register', component: Register },
  { path: '/Verify', component: Verify },
  { path: '/ForgetPwd', component: ForgetPwd },
  { path: '/home', component: home, meta: {
      roles: ['0', '1', '2']
    },
    children:[
      { path: '/ChangeUserInfo', component: ChangeUserInfo ,meta: {
          roles: ['0', '1', '2']
        }},
      { path: '/ChangeUserPwd', component: ChangeUserPwd ,meta: {
          roles: ['0', '1', '2']
        }},
      { path: '/ChangeUserFaces', component: ChangeUserFaces,meta: {
          roles: ['0', '1', '2']
        } },
      { path: '/MyFeedBack', component: MyFeedBack ,meta: {
          roles: ['0', '1', '2']
        }},

      { path: '/Users', component: Users ,meta: {
          roles: [ '1', '2']
        }},

      { path: '/UserFeedBack', component: UserFeedBack ,meta: {
          roles: ['2']
        }},
      { path: '/Managers', component: Managers ,meta: {
          roles: ['2']
        }},
      { path: '/ApplicationManager', component: ApplicationManager ,meta: {
          roles: [ '2']
        }},
      { path: '/SignInLog', component: SignInLog,meta: {
          roles: ['2']
        } },

      { path: '/Statistics', component: Statistics ,meta: {
          roles: ['0', '1', '2']
        }},
      { path: '/UploadRecords', component: UploadRecords ,meta: {
          roles: ['0', '1', '2']
        }},
      { path: '/UpLoadNew', component: UpLoadNew ,meta: { roles: ['0', '1', '2'] }},

      { path: '/RunSimulation', component: RunSimulation ,meta: { roles: ['0', '1', '2'] }},
      { path: '/walkSimulation', component: walkSimulation,meta: { roles: ['0', '1', '2'] } },
      { path: '/WaveSimulation', component: WaveSimulation,meta: { roles: ['0', '1', '2'] } },

      { path: '/WavePhase', component: WavePhase ,meta: { roles: ['0', '1', '2'] }},
      { path: '/WalkPhase', component: WalkPhase,meta: { roles: ['0', '1', '2'] } },
      { path: '/RunPhase', component: RunPhase,meta: { roles: ['0', '1', '2'] } },
      { path: '/WaveAmplitude', component: WaveAmplitude,meta: { roles: ['0', '1', '2'] } },
      { path: '/RunAmplitude', component: RunAmplitude,meta: { roles: ['0', '1', '2'] } },
      { path: '/WalkAmplitude', component: WalkAmplitude ,meta: { roles: ['0', '1', '2'] }}
    ] },
  { path: '/UnFind', component: UnFind },
  { path: '*', redirect: '/UnFind', },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) =>
{
  if (to.path === '/login'||to.path === '/Register'||to.path === '/ForgetPwd'||to.path === '/Verify'||to.path === '/Welcome'||to.path==='/UnFind') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  const userInfo = JSON.parse(window.sessionStorage.getItem('user'))
  if (!tokenStr) return next('/login')
  if(to.meta.roles.includes(userInfo.user_type)){
    next()
  }
  else {
    next({path: '/UnFind'})
  }

})

export default router
