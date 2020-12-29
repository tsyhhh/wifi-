<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <i class="el-icon-tsy-wifi" />
        <span>wifi人体动作识别系统</span>
      </div>
      <el-dropdown trigger="hover">
        <span>
           <img :src="g_User.head_portrait" class="user">

        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item  @click.native="ToChangeFaces">修改头像</el-dropdown-item>
          <el-dropdown-item  @click.native="ToChange">设置</el-dropdown-item>
          <el-dropdown-item  @click.native="ToFeedBack">提交反馈</el-dropdown-item>
          <el-dropdown-item divided @click.native="LogOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <!--    侧边栏  -->
    <el-container>
      <el-aside :width="g_IsCollapsed ?'64px':'200px'">
        <!--   折叠栏     -->
        <div class="toggle-button" @click="ToggleCollapse">|||</div>
        <!-- 侧边栏菜单区  -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse ="g_IsCollapsed"
          :collapse-transition="false"
          router
          :default-active="g_ActivePath"
        >
          <!--一级菜单-->
          <el-submenu :index="item.id +''" v-for="item in g_MenuList" :key="item.id">
            <!--一级菜单的模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="g_IconsObj[item.id]" />
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <!--    index即路由，等待后端写好接口        -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="SaveNavState('/'+subItem.path)">

<!--            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">-->
              <i class="el-icon-menu" />
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--    路由占位符    -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  export default
  {
    data ()
    {
      return {
        g_ActivePath :'',
        g_IsCollapsed :false,
        // 左侧菜单
        g_MenuList: [],
        g_IconsObj: {
          '1000':'el-icon-s-management',
          '200':'el-icon-tsy-run',
          '300':'el-icon-tsy-walk',
          '400':'el-icon-tsy-shake',
          '500':'el-icon-tickets',
          '600':'el-icon-user'
        }
      }
    },
    created () {
      this.g_ActivePath = window.sessionStorage.getItem('g_ActivePath') //设置已有值
    },
    methods: {
        LogOut () {//登出
          window.sessionStorage.clear()
          this.$router.push('/login')
        },
        ToggleCollapse() {//刷新后保持上次选择
          this.g_IsCollapsed = !this.g_IsCollapsed;
        },
        SaveNavState(g_ActivePath) {//记录上次选择
          window.sessionStorage.setItem('g_ActivePath',g_ActivePath)
          this.g_ActivePath = g_ActivePath
        },
        ToChange() {//跳转到改变info界面
          this.$router.push('/ChangeUserInfo')

        },
        ToChangeFaces() {//跳转到改变头像界面
          this.$router.push('/ChangeUserFaces')
        },
        ToFeedBack(){
          this.$router.push('/MyFeedBack')
        }
    },
    computed: {
        g_User () {//获取User
          const userJsonStr = sessionStorage.getItem('user')
          let userEntity = JSON.parse(userJsonStr);
          return userEntity
        }
    },
    async mounted () {
      console.log(this.g_MenuList)
      console.log("---------------")
      const {data:res} =await this.$http.get('menu')
      if(res.status==="success"){
        this.g_MenuList = res.data.MenuList
        console.log(this.g_MenuList)
      }
      else {
        this.$message.error("获取菜单失败")
      }
    }
  }
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #eeeeee;
    padding-left: 0px;
    font-size: 20px;
  >div {
    display: flex;
    align-items: center;
  }
  }
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .el-aside{
    background-color: #333744;

  }
  .el-menu{
    border-right: none;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
