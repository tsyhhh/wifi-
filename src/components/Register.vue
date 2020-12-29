<template>
  <div class="register_container">
    <div class="register_box">

      <span style="text-align: center;display:block; margin-top: 30px; text-decoration: underline;size: A5" >欢迎使用</span>
      <el-form ref="registerFormRef" :model="RegisterForm" class="ForgetPwd_form" :rules="RegisterFormRules" label-width="0px">

        <!--用户名-->
        <el-form-item prop="user_name">
          <el-input v-model="RegisterForm.user_name" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"/>
        </el-form-item>
        <!--手机号，验证码按钮-->
        <el-form-item prop="user_tel">
          <el-input v-model="RegisterForm.user_tel" placeholder="请输入手机号" prefix-icon="el-icon-phone"/>
        </el-form-item>

        <!--验证码-->
        <el-form-item prop="user_email">
          <el-input v-model="RegisterForm.user_email" placeholder="请输入邮箱" prefix-icon="el-icon-message"/>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="user_pwd">
          <el-input v-model="RegisterForm.user_pwd" placeholder="密码6-15位,区分大小写" prefix-icon="el-icon-lock" type="password"/>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" style="width:100px;height:40px;" @click="ConfRegister('registerFormRef')">确定</el-button>
          <span class="return_login" @click="ReToLogin">使用已有用户登录</span>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
export default {
  data () {
     const c_ValidName =(rule, value, callback)=> {
      if (value)  //更新
      {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('用户名请不要输入汉字!'));
        }
        else {
          callback();
        }
      }
      callback(); //回调
    }
    const c_ValidateMobilePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('负责人手机号不可为空'))
      }
      else {
        if (value !== '') {//不为空
          const reg = /^1[3456789]\d{9}$/
          if (!reg.test(value)) {//不符合一般的手机号
            callback(new Error('请输入有效的手机号码'))
          }
        }
        callback()
      }
    }
    const c_ValidateEmail = (rule, value, callback) => {
      if (value === '') {//邮箱为空
        callback(new Error('请正确填写邮箱'))
      }
      else {
        if (value !== '') {
          const verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
          if (!verify.test(value)) {  //无效的邮箱
            callback(new Error('请输入有效的邮箱'))
          }
        }
        callback()
      }
    }
    return {
      RegisterForm: {
          user_tel: '',
          user_name: '',
          user_pwd: '',
          user_email :'',
          user_sex:'',
      },
      RegisterFormRules: {
        user_name: [
          { required: true, message: '请输入用户名!', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符!', trigger: 'blur' },
          { validator: c_ValidName, trigger: 'blur', required: true },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const reg = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？ ]')
              if (reg.test(value)) {
                callback(new Error('用户名请不要输入特殊字符!'))
              }
              else {
                callback()
              }
            }
          }],
        user_pwd: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度请输入 6 到 15位!', trigger: 'blur' },
          {
            type: 'string',
            message: '请输入不包含空格的字符',
            trigger: 'blur',
            transform(value) {
              if (value && value.indexOf(' ') === -1) {
                return value
              }
              else {
                return false
              }
            }
          },
          {
            min: 6, max: 15,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const passwordReg = /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/
              if (!passwordReg.test(value)) {
                callback(new Error('密码必须由数字、字母组合,请输入6-15位'))
              }
              else {
                callback()
              }
            }
          },],
        user_tel:[
          { required: true, message: '请输入手机号!', trigger: 'blur' },
          { validator: c_ValidateMobilePhone, trigger: 'blur', required: true }
        ],
        user_email:[
          {required: true, message: '请输入邮箱!', trigger: 'blur' },
          { validator: c_ValidateEmail, trigger: 'blur', required: true },
          { min: 1, max: 160, message: '请输入长度 1 到 16 个字符的邮箱!', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ConfRegister (registerFormRef) { //注册实现功能
      this.$refs[registerFormRef].validate(async (valid) => {
        if (valid) {  //有效
          const { data :res } = await this.$http.post("register",this.RegisterForm);
          console.log(res);
          if(res.status === 'error') {//error
            return this.$message.error(res.message)
          }
          else {
            this.$message.success('注册成功,请返回登录页面登录!')
            await this.$router.push('/login')
          }
        }
        else {
          console.log('error submit!!')
          this.$message.error('注册失败，请检查输入是否合理!')
          return false
        }
      })
    },
    ReToLogin () { //返回login页面
      this.$router.push('/login')
    }
  }
}
</script>



<style lang="less" scoped>
  .register_container{
    background: url("../assets/png/background.png");
    background-size: 100% 100%;
    height: 100%;
  }
  .register_box{
    width: 400px;
    height: 400px;
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
