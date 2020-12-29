<template>
  <div class="register_container">
    <div class="register_box">

      <span style="text-align: center;display:block; margin-top: 30px; text-decoration: underline;size: A5" >修改密码</span>
      <el-form ref="ChangePwdFormRef" :model="g_ChangePwdForm" class="ForgetPwd_form" :rules="g_ChangePwdFormRules" label-width="0px">

        <el-form-item prop="user_oldPwd">
          <el-input v-model="g_ChangePwdForm.user_oldPwd" placeholder="请输入旧密码" prefix-icon="el-icon-lock" type="password"/>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="user_pwd">
          <el-input v-model="g_ChangePwdForm.user_pwd" placeholder="请输入新密码" prefix-icon="el-icon-lock" type="password"/>
        </el-form-item>

        <el-form-item prop="confPassword">
          <el-input v-model="g_ChangePwdForm.confPassword" placeholder="请确认新密码" prefix-icon="el-icon-lock" type="password"/>
        </el-form-item>

        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" style="width:100px;height:40px;" @click="ChangePwd('ChangePwdFormRef')">
            确定
          </el-button>
          <el-button type="danger" style="width:100px;height:40px;" @click="ReturnToInfo">
            取消
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
  export default
  {
    name: 'ChangeUserPwd',
    data ()
    {
      const g_ValidatePass = (rule, value, callback) =>
      {
        if (value === '')
        {
          callback(new Error('请再次输入密码'))
        }
        else if (value !== this.g_ChangePwdForm.user_pwd)
        {
          callback(new Error('两次输入密码不一致!'))
        }
        else
        {
          callback()
        }
      }
      const g_ValidatePass1 = (rule, value, callback) =>
      {
        const passwordReg = /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/
        if (!passwordReg.test(value))
        {
          callback(new Error('密码必须由数字、字母组合,请输入6-15位'))
        }
        else
        {
          callback()
        }
      }

      return {
        g_ChangePwdForm: {
          user_oldPwd:'',
          user_pwd: '',
          confPassword:''
        },
        g_ChangePwdFormRules: {
          user_oldPwd:[
            { required: true, message: '请输入旧密码!', trigger: 'blur' },
          ],
          user_pwd: [
            { required: true, message: '请输入新密码!', trigger: 'blur' },
            { min: 6, max: 15, trigger: 'blur', validator: g_ValidatePass1 }
          ],
          confPassword:[
            { required: true, message: '请再次输入密码!', trigger: 'blur' },
            { validator: g_ValidatePass, trigger: 'blur', required: true }
          ]
        }
      }
    },
    methods:
      {
        ChangePwd(ChangePwdFormRef) //修改密码
        {
          this.$refs[ChangePwdFormRef].validate(async (valid) =>
          {
            if (valid)  //格式正确
            {
              const userJsonStr = sessionStorage.getItem('user')
              let userID = JSON.parse(userJsonStr).user_id;
              let obj=
                {
                  id:userID,
                  old_pwd:this.g_ChangePwdForm.user_oldPwd,
                  new_pwd:this.g_ChangePwdForm.user_pwd
                }
              const { data: res } = await this.$http.post("change_user_pwd2", obj);
              console.log(res)
              if(res.status==='success')  //修改成功
              {
                this.$message.success('修改成功，请重新登录!')
                window.sessionStorage.clear()
                await this.$router.push('/login')   //返回登录界面
              }
              else
              {
                this.$message.error(res.message)
              }
            }
            else  //格式错误
            {
              this.$message.error('修改失败!')
            }
          })
        },
        ReturnToInfo()  //返回修改个人信息界面
        {
          this.$router.push('/ChangeUserInfo')
        }
    }
  }
</script>



<style lang="less" scoped>
  .register_container{
    background-size: 100% 100%;
    height: 100%;
  }
  .register_box{
    width: 400px;
    height: 350px;
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
