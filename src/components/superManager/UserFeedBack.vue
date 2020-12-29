<template>
  <el-card>
    <h3>反馈列表</h3>
    <!--<el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入用户名进行查询" v-model="queryInfo.query" @click="getFeedBackList" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>-->

    <el-table :data="feedBackList" boder stripe>

      <el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="user_name"></el-table-column>
        <el-table-column label="联系电话" prop="tel"></el-table-column>
        <el-table-column label="反馈时间" prop="time"></el-table-column>
        <el-table-column label="是否回复" prop="answer"  :formatter="formatRole"></el-table-column>

        <!--            操作-->
        <el-table-column label="操作">
          <template slot-scope="scope">

            <el-tooltip effect="dark" content="查看反馈信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-info" size="mini" @click="LookContent(scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="回复反馈" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="AnswerBack(scope.row)"></el-button>
            </el-tooltip>

<!--            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>-->
            <!--<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>-->

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
      title="回复用户"
      :visible.sync="dialogVisible"
      width="30%">
      <!--        内容主题区域-->
<!--      应该把用户反馈内容也放这里暂时没有写-->
<!--      <textarea aria-label="反馈内容" v-model=""> </textarea>-->
      <textarea v-model="TextReply" style="width: 100%;height: 50px"></textarea>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="GetAns">确 定</el-button>
        </span>
    </el-dialog>

  </el-card>
</template>

<script>
  export default {
    name: 'UserFeedBack',
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
        feedBackList:[],
        total:0,
      }
    },
    created () {
      this.getFeedBackList()
    },
    methods: {
      AnswerBack(row){
        this.dialogVisible = true;
        this.backId = row.fb_id;
      },
      async GetAns () {
        let obj = {
          fb_id:this.backId,
          reply:this.TextReply
        }
        if(this.TextFeedBack===''){
          this.$message.error('请输入回复内容!')
        }
        else {
          const { data: res } = await this.$http.post('reply_feedback', obj)
          if(res.status === "success"){
            this.dialogVisible = false;
            this.$message.success("回复成功")
          }
          else {
            this.$message.error(res.message)
          }
          await this.getFeedBackList()
        }
      },
      formatRole(row){
        //console.log(row)
        return row.answer.Valid === false ? "未回复" :  "已回复" ;
      },
      async getFeedBackList() {
        let obj = {
          super_id:this.queryInfo.user_id,
          page_num:this.queryInfo.pageNum,
          page_size:this.queryInfo.pageSize
        }
        const {data :res } = await this.$http.post('check_feedback',obj)
        if(res.status !== 'success') {
          return this.$message.error(res.message)
        }
        else{
          this.total = res.data.sum
          this.feedBackList = [];
          for(let i = 0; i<res.data.check_feedback.length;i++){
            this.feedBackList.push(res.data.check_feedback[i])
            // console.log(res.data[i].answer)
          }
        }
      },
      LookContent(userInfo){
        this.$alert(userInfo.content, '反馈内容', {
          confirmButtonText: '确定',
          type: 'info'
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getFeedBackList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        this.getFeedBackList()
      }
    }
  }
</script>

<style scoped>

</style>
