<template>
  <div class="Forget_container">
    <div class="Forget_box">
      <!-- 找回密码 -->
      <span style="text-align: center;display:block; margin-top: 30px; text-decoration: underline;size: A5" >找回密码</span>

      <el-form ref="ForgetPwdFormRef" :model="g_ForgetPwdForm" class="ForgetPwd_form" :rules="g_ForgetPwdFormRules" label-width="0px">

        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="g_ForgetPwdForm.password" placeholder="密码6-15位,区分大小写" prefix-icon="el-icon-lock" type="password"/>
        </el-form-item>
        <!--确认密码-->
        <el-form-item prop="confPassword">
          <el-input v-model="g_ForgetPwdForm.confPassword" placeholder="请确认密码" prefix-icon="el-icon-lock" type="password"/>
        </el-form-item>

        <!--确定-->
        <el-form-item>
          <el-button type="primary" style="width:100%;height:40px;" @click="ConfigPwd('ForgetPwdFormRef')">确定</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      const c_ValidatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        }
        else if (value !== this.g_ForgetPwdForm.password) {
          callback(new Error('两次输入密码不一致!'))
        }
        else {
          callback()
        }
      }
      return {
        g_ForgetPwdForm: {
          confPassword: '',
          password: ''
        },
        g_ForgetPwdFormRules: {
          password: [
            { required: true, message: '请输入密码!', trigger: 'blur' },
            {
              type: 'string',
              message: '请输入不包含空格的字符',
              trigger: 'blur',
              transform(value) {
                if (value && value.indexOf(' ') === -1) {//没找到空格
                  return value
                }
                else {
                  return false
                }
              }
            },
            { min: 6, max: 15, message: '请输入长度 6 到 15 的密码!', trigger: 'blur' },
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                const c_PassworDreg = /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/
                if (!c_PassworDreg.test(value)) {
                  callback(new Error('密码必须由数字、字母组合,请输入6-15位'))
                }
                else {
                  callback()
                }
              }
            }
          ],
          confPassword :[
            { required: true, message: '请再次输入密码!', trigger: 'blur' },
            { validator: c_ValidatePass, trigger: 'blur', required: true }
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      async ConfigPwd(ForgetPwdFormRef){  //确认密码
        this.$refs[ForgetPwdFormRef].validate(async (valid) => {
          if (valid) {//有效
            let obj = {
              user_id : sessionStorage.getItem('UserID'),
              user_pwd : this.g_ForgetPwdForm.password
            }
            const { data: res } = await this.$http.post('change_user_pwd',obj)  //post请求
            if (res.status !== 'success')
            {
              return this.$message.error('验证失败!')
            }
            await this.$router.push('/login')
          }
          else    //无效
          {
            console.log('error submit!!')
            this.$message.error('修改失败，请检查输入是否合理!')
          }
        })
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

  .return_login{
    color: cornflowerblue;
    font-size: 10px;
    margin-left: 30px;
  }
</style>
