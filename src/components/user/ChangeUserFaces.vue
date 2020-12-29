<template>
  <div>
    <!--<ul>
      <li v-for ="item in g_List" :key="item">
        <el-image :src="item.img"></el-image>
      </li>
    </ul>-->
    <div class="overall" style="float:left">
      <h3>目前可选择头像为:</h3>
      <span>
        <el-image v-for="item in g_List" :key="item.id" style="width: 100px; height: 100px" :src="item.url" @click="ChangeFaces(item)"></el-image>
      </span>
    </div>
    <div style="float:right ; width: 300px">
      <h3>您当前选择头像为:</h3>
      <span style="flex-wrap: wrap;">
        <el-image :src="g_UserFaces" style="width: 300px; height: 300px"></el-image>
        <el-button style="width: 300px" @click="ConfineChange">确定</el-button>
      </span>
    </div>
  </div>

</template>

<script>
  export default
  {
    name: 'ChangeUserFaces',
    data ()
    {
      return {
        g_UserFaces: JSON.parse(sessionStorage.getItem('user')).head_portrait,
        g_User: JSON.parse(sessionStorage.getItem('user')),
        g_List : []
      }
    },
    methods:
      {
        ChangeFaces(item)       //修改头像
        {
          this.g_UserFaces = item.url;
          this.g_User.head_portrait = item.url;
        },
        async ConfineChange (){   //确认是否修改
          console.log(this.g_User.head_portrait)
          const { data: info } = await this.$http.post("change_user_info", this.g_User);
          if(info.status !=='success') {
            this.$message.error('修改失败!')
          }
          else {
            this.g_User.head_portrait = this.g_UserFaces
            sessionStorage.setItem('user',  JSON.stringify(this.g_User))
            location.reload()
          }
        }
    },
    async mounted () {
      const { data: res } = await this.$http.get('check_headportrait')  //获取头像列表
      this.g_List = res.data
    }
  }
</script>


<style scoped>
  .overall {
    position: absolute;
    width: 50%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
