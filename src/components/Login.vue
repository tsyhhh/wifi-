<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/png/logo.png" >
      </div>
      <el-form ref="loginFormRef" :model="LoginForm" class="login_form" :rules="LoginFormRules" label-width="0px" >
        <!--用户名-->
        <el-form-item prop="user_name">
          <el-input v-model="LoginForm.user_name" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"/>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="user_pwd">
          <el-input v-model="LoginForm.user_pwd" placeholder="请输入密码" prefix-icon="el-icon-lock" type="password" style="width: 100%"/>
        </el-form-item>
        <!--按钮-->
        <el-form-item>
          <el-button class="whole_button" type="primary" @click="ConfLogin('loginFormRef')">登录</el-button>
        </el-form-item>
        <span @click="ToRegister" class="little_style"> 注册 </span>
        <span @click="ToVerify" class="little_style"> 忘记密码？ </span>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      const c_Reg =(rule, value, callback)=> {
        if (value) {
          const reg = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？ ]')
          if (reg.test(value)) {
            callback(new Error('请不要输入特殊字符!'))
          }
          else {
            callback()
          }
        }
        callback();
      }
      return {
        LoginForm: {
          user_name: '',
          user_pwd: ''
        },
        LoginFormRules: {
          user_name: [
            { required: true, message: '请输入用户名!', trigger: 'blur' },
            { min: 3, max: 7, message: '用户名长度在 3 到 7 以内!', trigger: 'blur' },
            { validator: c_Reg, trigger: 'blur', required: true }
          ],
          user_pwd: [
            { required: true, message: '请输入密码!', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在 6 到 15 以内!', trigger: 'blur' },
            { validator: c_Reg, trigger: 'blur', required: true }
          ]
        }
      }
    },
    methods: {
      ConfLogin (loginFormRef) {//登录接口实现部分
        this.$refs[loginFormRef].validate(async (valid) => {
          if (valid) {//有效
            const { data :info } = await this.$http.post("login",this.LoginForm);
            if(info.status === 'error') {
              return this.$message.error('账号或密码错误!')
            }
            else {
              this.$message.success('登录成功!')
              window.sessionStorage.setItem("token",info.data.jwt)
              const { data: res } = await this.$http.post('check_user_info', {
                user_id: info.data.user_id
              })  //调用接口
              sessionStorage.setItem('user',  JSON.stringify(res.data)) // 保存用户到本地会话
              await this.$router.push('/home')
            }
          }
          else {
            this.$message.error('登录失败!')
            return false
          }
        })
      },
      ToRegister () {//跳转到注册界面
        this.$router.push({ path: '/Register' })
      },
      ToVerify () { //跳转到验证界面
        this.$router.push({ path: '/Verify' })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container{
    background: url("../assets/png/background.png");
    background-size: 100% 100%;
    height: 100%;
  }
  .login_box{
    width: 350px;
    height: 300px;
    //background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    //border: 1px solid #DCDFE6;
    background: transparent;
    transform: translate(-50%, -50%);

    .avatar_box{
      height: 130px;
      width: 130px;
      //border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;  //内边距
      box-shadow: 0 0 2px #dddddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .little_style{
    color: white;
    font-size: 14px;
    margin-left: 23%;
  }

  .whole_button{
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
  }
</style>
