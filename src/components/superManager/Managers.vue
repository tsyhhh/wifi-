<template>
  <el-card>
    <h3>管理员列表</h3>
    <el-table :data="ManagerInfoList" boder stripe>

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
            <el-tooltip effect="dark" content="取消管理员角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeManagerById(scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="查看管理用户" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="LookManagerById(scope.row)"></el-button>
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
    name: 'Managers',
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
        ManagerList:[],
        ManagerInfoList:[],
        total:0,
      }
    },
    methods: {
      formatRole(row){
        //console.log(row)
        return row.user_sex === '' ? "未定义" :  row.user_sex === '1'? "男": "女" ;
      },
      formatRole1(row){
        return row.user_type === '1' ? "管理员" :  row.user_type === '0'? "普通用户": "超级管理员" ;
      },
      async getManagerList() {
        let obj = {
          super_id:this.queryInfo.user_id,
          page_num:this.queryInfo.pageNum,
          page_size:this.queryInfo.pageSize
        }
        const {data :res } = await this.$http.post('check_manager_list',obj)
        if(res.status !== 'success') {
          return this.$message.error(res.message)
        }
        else{
          this.total = res.data.sum
          this.ManagerList = [];
          for(let i = 0; i<res.data.list.length;i++){
            this.ManagerList.push(res.data.list[i])
          }
        }
      },
      async LookManagerById (userInfo) {
        let text =[];
        const { data: list } = await this.$http.post('check_user_list', {
          manager_id :userInfo.user_id,
        })
        for(let i=0;i<list.data.length;i++){
          text.push(list.data[i].user_name)
        }
        this.$alert(text.toString(), '该管理员所管理用户有:', {
          confirmButtonText: '确定',
          type: 'info'
        })
      },
      async removeManagerById (userInfo) {
        let obj ={
          super_id: this.queryInfo.user_id,
          manager_id:userInfo.user_id
        }
        //console.log(obj)
        const { data: res } = await this.$http.post('remove_manager', obj)
        if(res.status==="success"){
          if(res.data.is_remove===true){
            this.$message.success("删除管理员身份成功")
            await this.getManagerList()
          }else {
            this.$message.error("删除管理员身份失败!")
          }
        }
        else {
          this.$message.error(res.message)
        }
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getManagerList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        this.getManagerList()
      },
      async getManagerInfo() {
        await this.getManagerList();
        console.log(this.ManagerList)
        for(let i=0;i<this.ManagerList.length;i++){
          const { data: res } = await this.$http.post('check_user_info', {
            user_id: this.ManagerList[i].manager_id
          })  //调用接口
          this.ManagerInfoList.push(res.data)
        }
      },
    },
    created () {
      this.getManagerInfo()
    },
  }
</script>

<style scoped>

</style>
