<template>
  <div>
    <el-card style="width: 500px; position: absolute;left: 55%;top: 40%;transform: translate(-50%, -30%);">

      <span style="text-align: center;display:block; margin-top: 30px; text-decoration: underline;size: A5" >修改个人信息</span>
      <el-form :model="User" status-icon :rules="Rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="用户名" prop="user_name" style="margin : 40px 0 20px 0;">
          <el-input type="text" v-model="User.user_name" autocomplete="off" class="little_lab" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="电话号码" prop="user_tel">
          <el-input type="text" v-model="User.user_tel" autocomplete="off" class="little_lab" :disabled="DisabledAll"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="user_email">
          <el-input type="text" v-model="User.user_email" autocomplete="off" class="little_lab" :disabled="DisabledAll"></el-input>
        </el-form-item>

        <el-form-item label="性别" >
          <el-radio-group v-model="User.user_sex" :disabled="DisabledAll">
            <el-radio  label="F" >男</el-radio>
            <el-radio  label="M" >女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="ChangeDisable">点击修改</el-button>
          <el-button @click="ToChangeUserPwd('ruleForm')">修改密码?</el-button>
        </el-form-item>
        <el-button type="primary" @click="ConfSubmit()" style="width: 100%;float: contour">保存</el-button>
<!--        <el-button @click="" style="width: 40%;">重置</el-button>-->

      </el-form>

    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="DialogVisible"
      width="30%">
      <!--        内容主题区域-->
      <span>确定修改信息?</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="DialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="SubmitForm('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>

  export default
  {
    name: 'ChangeUserInfo',
    data()
    {
      const c_ValidateMobilePhone = (rule, value, callback) =>  //手机号是否有效
      {
        if (value === '')
        {
          callback(new Error('负责人手机号不可为空'))
        }
        else
        {
          if (value !== '')
          {
            const reg = /^1[3456789]\d{9}$/
            if (!reg.test(value))
            {
              callback(new Error('请输入有效的手机号码'))
            }
          }
          callback()
        }
      }
      const c_ValidateEmail = (rule, value, callback) => {    //邮箱是否有效
        if (value === '') {
          callback(new Error('请正确填写邮箱'))
        }
        else {
          if (value !== '') {
            const c_Verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
            if (!c_Verify.test(value)) {
              callback(new Error('请输入有效的邮箱'))
            }
          }
          callback()
        }
      }
      return {
        User: JSON.parse(sessionStorage.getItem('user')),
        DisabledAll:true,
        DialogVisible:false,
        Rules: {
          user_name: [
            { required: true, message: '请输入用户名!', trigger: 'blur' },
            { min: 3, max: 7, message: '用户名长度在 3 到 7 以内!', trigger: 'blur' },
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
            }
          ],
          user_tel:[
            { required: true, message: '请输入手机号!', trigger: 'blur' },
            { validator: c_ValidateMobilePhone, trigger: 'blur', required: true }
          ],
          user_email:[
            {required: true, message: '请输入邮箱!', trigger: 'blur' },
            { validator: c_ValidateEmail, trigger: 'blur', required: true }
          ]
        }
      };
    },
    methods: {
      ConfSubmit() {  //确认提交信息
        this.DialogVisible = true;  //弹出框
      },
      async SubmitForm (ruleForm) { //再次确认是否提交信息
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {//有效
            this.DialogVisible = false  //关闭弹窗
            console.log(this.User)
            const { data: info } = await this.$http.post("change_user_info", this.User);
            if(info.status !=='success') {
              return  this.$message.error(info.message)
            }
            sessionStorage.setItem('user',  JSON.stringify(this.User))
            location.reload()
          }
          else {
            this.DialogVisible = false
            this.$message.error('信息修改失败，请检查是否符合规范!')
          }
        })
      },
      ToChangeUserPwd() {//跳转到修改密码界面
        this.$router.push({ path: '/ChangeUserPwd' })
      },
      ChangeDisable() {//是否修改个人信息
        this.DisabledAll = false;
      }
    }
  }

</script>

<style scoped>

  .avatar_box{
    height: 50px;
    width: 50px;
  /*//border: 1px solid #eeeeee;*/
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 2px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin : 0 0 20px 0;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }

  .user_change{
    width: 650px;
    height: 400px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    background: transparent;
    transform: translate(-50%, -50%);
  }
  .little_lab{
    width: 90%;
  }
  .whole_button{
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
  }
</style>
