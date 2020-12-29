<template>
  <el-card>
    <h3>登录日志:</h3>
    <!--<el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入用户名进行查询" v-model="queryInfo.query" @click="getLogList" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>-->

    <el-table :data="LogList" boder stripe>

      <el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="user_name"></el-table-column>
        <el-table-column label="上线时间" prop="time"></el-table-column>

        <!--            操作-->
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
    name: 'SignInLog',
    data(){
      return{
        dialogVisible:false,
        queryInfo :{
          user_id:JSON.parse(sessionStorage.getItem('user')).user_id,
          pageNum:1,
          pageSize:5
        },
        LogList:[],
        total:0,
      }
    },
    methods: {
      async getLogList() {
        let obj={
          super_id:this.queryInfo.user_id,
          page_num:this.queryInfo.pageNum,
          page_size:this.queryInfo.pageSize
        }
        const {data :res } = await this.$http.post('check_login_logger',obj)
        if(res.status !== 'success') {
          return this.$message.error(res.message)
        }
        else{
          this.total = res.data.sum
          this.LogList = [];
          for(let i = 0; i<res.data.length;i++){
            this.LogList.push(res.data[i])
          }
        }
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getLogList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        this.getLogList()
      },
    },
    created () {
      this.getLogList();
    }
  }
</script>

<style scoped>

</style>
