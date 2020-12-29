<template>
  <div>
    <el-card>
      <h3>我的反馈</h3>
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogVisible = true">提交新反馈</el-button>
      <el-button type="text"  @click="GetManager">或许你想申请成为管理人员？</el-button>
      <el-table :data="feedBackList" boder stripe>
        <el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="反馈内容" prop="content"></el-table-column>
          <el-table-column label="反馈时间" prop="time"></el-table-column>
          <el-table-column label="是否回复" prop="status"  :formatter="formatRole"></el-table-column>

          <!--            操作-->
          <el-table-column label="操作">
            <template slot-scope="scope">

              <el-tooltip effect="dark" content="查看回复内容" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-info" size="mini" @click="LookContent(scope.row)" :disabled="!(scope.row.status)"></el-button>
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
      <el-dialog
        title="新建反馈"
        :visible.sync="dialogVisible"
        width="30%">
        <!--        内容主题区域-->
        <textarea v-model="TextFeedBack" style="width: 100%;height: 50px"></textarea>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false" size="small">取 消</el-button>
              <el-button type="primary" @click="GetPushFeedBack" size="small">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'MyFeedBack',
    data(){
      return{
        TextFeedBack:'',
        dialogVisible:false,
        queryInfo :{
          user_id:JSON.parse(sessionStorage.getItem('user')).user_id,
          pageNum:1,
          pageSize:5
        },
        feedBackList:[],
        total:0,
      }
    },
    methods: {
      formatRole(row){
        return row.status === 1 ? "已回复" :  "未回复" ;
      },
      async getFeedBackList() {
        let obj={
          user_id:this.queryInfo.user_id,
          page_num:this.queryInfo.pageNum,
          page_size:this.queryInfo.pageSize
        }
        const {data :res } = await this.$http.post('user_check_feedback',obj)
        if(res.status !== 'success') {
          return this.$message.error('获取反馈列表失败!')
        }
        else{
          this.total = res.data.sum
          this.feedBackList = [];
          for(let i = 0; i<res.data.list.length;i++){
            this.feedBackList.push(res.data.list[i])
          }
        }
      },
      async LookContent (FB) {
        const { data: res } = await this.$http.post('check_reply', {
          fb_id:FB.fb_id
        })
        if(res.status === "success"){
          this.$alert(res.data.reply, '反馈内容', {
            confirmButtonText: '确定',
            type: 'info'
          })
        }
        else{
          this.$message.error('获取回复失败!')
        }
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getFeedBackList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        this.getFeedBackList()
      },
      async GetPushFeedBack(){
        let obj={
          user_id:this.queryInfo.user_id,
          content:this.TextFeedBack
        }
        if(this.TextFeedBack===''){
          this.$message.error('请输入反馈内容!')
        }
        else {
          const { data: res } = await this.$http.post('feedback',obj)//获取数据
          if(res.status==="success"){
            this.TextFeedBack = '';
            this.$message.success('反馈成功，请耐心等待回复!')
            this.dialogVisible = false;
            await this.getFeedBackList();
          }
          else {
            this.$message.error('反馈失败!')
          }
        }
      },
      async GetManager () {
        const { data: res } = await this.$http.post('apply_manager', {
          user_id:this.user_id,
        })//获取数据
        if (res.status === "success") {
          this.$message.success('申请成功，请耐心等待!')
        } else {
          this.$message.error('申请失败!请稍后再试')
        }
      }
    },
    created () {
      this.getFeedBackList();
    }
  }
</script>

<style scoped>

</style>
