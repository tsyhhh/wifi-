<template>
  <div class="Forget_container">
    <div class="Forget_box">

      <span style="text-align: center;display:block; margin-top: 30px; text-decoration: underline;size: A5" >找回密码</span>
      <el-form ref="ForgetPwdFormRef" :model="ForgetPwdForm" class="ForgetPwd_form" label-width="0px">

        <!--手机号，和验证码按钮-->
        <el-form-item prop="tel">
          <el-input v-model="ForgetPwdForm.tel" placeholder="请输入手机号" prefix-icon="el-icon-phone" style="width: 66%"/>
          <el-button type="primary" style="margin-left: 10px" @click="SendCode(this)" :disabled="g_Disabled">
            {{ConfString}}
          </el-button>
        </el-form-item>

        <!--验证码-->
        <el-form-item>
          <el-input v-model="ForgetPwdForm.security_code" placeholder="请输入验证码" prefix-icon="el-icon-info"/>
        </el-form-item>

        <!--确定和返回-->
        <el-form-item class="btns">
          <el-button type="primary" style="width:100px;height:40px;" @click="ToForgetPwd('ForgetPwdFormRef')">确定</el-button>
          <span class="return_login" @click="ReToLogin">使用已有用户登录</span>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        g_Disabled: false,
        Interval:undefined,
        TotalCount:0,
        ForgetPwdForm: {
          tel: '',
          security_code:''
        },
      }
    },
    computed: {
      ConfString() {//验证码倒计时
        return this.TotalCount !==0? `${this.TotalCount}秒`: "获取验证码"
      }
    },
    methods: {
      async ToForgetPwd() {//忘记密码接口
        const { data: res } = await this.$http.post('verify', {
          tel : this.ForgetPwdForm.tel,
          security_code : this.ForgetPwdForm.security_code
        })
        if (res.status !== 'success') {//成功
          return this.$message.error('验证失败!')
        }
        window.sessionStorage.setItem('UserID',res.data.user_id)
        await this.$router.push('/ForgetPwd')
      },
      ReToLogin () { //返回login界面
        this.$router.push('/login')
      },
      SendCode () { //发送验证码
        const reg = /^1[0-9]{10}$/
        if (this.ForgetPwdForm.tel === '') {
          this.$message('请输入手机号码')
        }
        else if (!reg.test(this.ForgetPwdForm.tel)) {
          this.$message('手机格式不正确')
        }
        else {
          this.g_Disabled=true
          this.TotalCount=60
          this.GetCode()    //60秒过倒计时过后才能调用的事件
          this.Interval=setInterval(()=> {
            this.TotalCount--
            if(this.TotalCount === 0)
            {
              clearInterval(this.Interval)
              this.g_Disabled=false
            }
          },1000);
        }
      },
      async GetCode() {//验证验证码是否正确接口
        const { data: res } = await this.$http.post('send_code', {
          tel : this.ForgetPwdForm.tel
        })  //调用接口
        console.log(res)
        if (res.status !== 'success') {
          return this.$message.error('数据读取失败!')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .Forget_container{
    background: url("../assets/png/background.png");
    background-size: 100% 100%;
    height: 100%;
  }

  .Forget_box{
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    border: 1px solid #DCDFE6;
    transform: translate(-50%, -50%);

    .avatar_box{
      height: 130px;
      width: 130px;
      //border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
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
  .ForgetPwd_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns{
    display: flex;
    justify-content: center;
  }
  .return_login{
    color: cornflowerblue;
    font-size: 10px;
    margin-left: 30px;
  }
</style>
