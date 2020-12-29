<template>
  <el-card>
    <h3>申请列表</h3>
    <el-table :data="userList" boder stripe>
      <el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="user_name"></el-table-column>
        <el-table-column label="联系电话" prop="tel"></el-table-column>
        <el-table-column label="申请时间" prop="time"></el-table-column>

        <!--            操作-->
        <el-table-column label="操作">
          <template slot-scope="scope">

            <el-tooltip effect="dark" content="同意" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-circle-check" size="mini" @click="LookContent(scope.row)"></el-button>
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
</template>

<script>
  export default {
    name: 'ApplicationManager',
    data(){
      return{
        TextReply:'',
        dialogVisible:false,
        backId:'',
        queryInfo :{
          user_id:JSON.parse(sessionStorage.getItem('user')).user_id,
          pageNum:1,
          pageSize:5
        },
        userList:[],
        total:0,
      }
    },
    created () {
      this.getApplicationList()
    },
    methods: {
      formatRole(row){
        //console.log(row)
        return row.answer.Valid === false ? "未回复" :  "已回复" ;
      },
      async getApplicationList() {
        let obj = {
          super_id:this.queryInfo.user_id,
          page_num:this.queryInfo.pageNum,
          page_size:this.queryInfo.pageSize,
        }
        const {data :res } = await this.$http.post('check_apply_list',obj)
        if(res.status !== 'success') {
          return this.$message.error(res.message)
        }
        else{
          this.total = res.data.sum
          this.userList = [];
          for(let i = 0; i<res.data.list.length;i++){
            this.userList.push(res.data.list[i])
          }
        }
      },
      LookContent(userInfo){
        let obj = {
          super_id: this.queryInfo.user_id,
          user_id:userInfo.user_id
        }
        const res = this.$alert(userInfo.content, '确定添加该用户为管理人员吗？', {
          confirmButtonText: '确定',
          type: 'info'
        }).then(async () => {
          const {data :res } = await this.$http.post('add_manager',obj)
          if(res.data.is_add === true){
            this.$message({
              type: 'info',
              message: '添加成功'
            });
          }
          else {
            this.$message({
              type: 'info',
              message: '添加失败'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消添加该用户为管理人员'
          });
        });
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getApplicationList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        this.getApplicationList()
      },
      addUser() {
        this.dialogVisible = true
      },
    }
  }
</script>

<style scoped>

</style>
