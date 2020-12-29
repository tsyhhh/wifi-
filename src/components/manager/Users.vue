<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

<!--      卡片视图区域 -->
      <el-card>
        <h3>用户列表</h3>
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入用户名进行添加" v-model="queryInfo.query" clearable>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button @click="addUser">添加用户</el-button>
          </el-col>
        </el-row>

        <el-table :data="userInfoList" boder stripe>

          <el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="用户名" prop="user_name"></el-table-column>
            <el-table-column label="邮箱" prop="user_email"></el-table-column>
            <el-table-column label="性别" prop="user_sex" :formatter="formatRole"></el-table-column>
            <el-table-column label="电话" prop="user_tel"></el-table-column>
            <el-table-column label="角色" prop="user_type" :formatter="formatRole1"></el-table-column>

<!--            操作-->
            <el-table-column label="操作">
              <template slot-scope="scope">
<!--                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>-->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row)"></el-button>
                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
<!--        分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
  <!--    添加用户的弹窗  -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%">
<!--        内容主题区域-->
        <span>确定要添加该用户进入你的管理列表吗</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    name: 'Users',
    data() {
      return{
        User:JSON.parse(sessionStorage.getItem('user')),
        dialogVisible:false,
        queryInfo :{
          query :'',
          pageNum:1,
          pageSize:5
        },
        userList:[],
        userInfoList:[],
        total:3
      }
    },
    created () {
      this.getUserInfo()
    },
    methods: {
      formatRole(row){
        //console.log(row)
        return row.user_sex === '' ? "未定义" :  row.user_sex === '1'? "男": "女" ;
      },
      formatRole1(row){
        return row.user_type === '1' ? "管理员" :  row.user_type === '0'? "普通用户": "超级管理员" ;
      },
      async getUserList() {
        if(this.User.user_type ==='1'){
          const { data: list } = await this.$http.post('check_user_list', { //获取数据
            manager_id :this.User.user_id,
          })
          if(list.status==="success"){
            for(let i=0;i<list.data.length;i++){
              this.userList.push(list.data[i])
            }
            if(list.data.length===0){
              this.$message.info("当前没有被您管理的用户")
            }
          }
          else{
            this.$message.error(list.message)
          }
        }
        else if(this.User.user_type ==='2'){
          let obj={
            super_id:this.User.user_id,
            page_num:this.queryInfo.pageNum,
            page_size:this.queryInfo.pageSize
          }
          const { data: list } = await this.$http.post('check_all_list', obj)
          if(list.status==="success"){
            for(let i=0;i<list.data.length;i++){
              this.userList.push(list.data[i])
            }
            this.total = list.sum
          }
          else{
            this.$message.error(list.message)
          }
        }
      },
      async getUserInfo() {
        await this.getUserList();
        for(let i=0;i<this.userList.length;i++){
          const { data: res } = await this.$http.post('check_user_info', {
            user_id: this.userList[i].user_id
          })  //调用接口
          this.userInfoList.push(res.data)
        }
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        this.getUserList()
      },
      async addUser () {
        let obj = {
          manager_id: this.User.user_id,
          normal_name: this.queryInfo.query
        }
        const { data: res } = await this.$http.post('adduser', obj)  //调用接口
        if(res.status ==="success"){
          if(res.data.success===true) this.$message.success("添加成功")
          else this.$message.error("添加失败")
          await this.getUserList()
        }
        else {
          this.$message.error(res.message)
        }
      },
      removeUserById(userInfo) {
        console.log(userInfo)
        const res = this.$confirm('此操作将从你的管理列表中移除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //删除用户
          let obj = {
            manager_id:this.User.user_id,
            normal_id:userInfo.user_id
          }
          const { data: res } = await this.$http.post('removeuser', obj)  //调用接口
          if(res.status==='success'){
            if(res.data.success===true)
              this.$message.success("移除成功")
            else  this.$message.error("移除失败")
          }
          else {
            this.$message.success(res.message)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
       // console.log(res)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
