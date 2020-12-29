<template>
  <div>
    <el-card>
      <el-select style="width: 200px" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @click.native="getUploadListNative">
        </el-option>
      </el-select>

      <el-table :data="UploadList" boder stripe>

        <el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="类型" prop="type" :formatter="formatRole"></el-table-column>
          <el-table-column label="名称" prop="file_name"></el-table-column>
          <el-table-column label="上传时间" prop="time"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)">删除</el-button>
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

  </div>
</template>

<script>
  export default {
    name: 'UploadRecords',
    data() {
      return{
        dialogVisible:false,
        queryInfo :{
          user_id :JSON.parse(sessionStorage.getItem('user')).user_id,
          pageNum:1,
          pageSize:5
        },
        options: [{
          value:1,
          label: 'run'
        }, {
          value:2,
          label: 'walk'
        },{
          value:3,
          label: 'Wave'
        }],
        value: '',
        UploadList:[],
        total:0
      }
    },
    created ()
    {

    },
    methods:
      {
        formatRole(row) {
          switch (row.type) {
            case '1': return  '跑步';
            case '2': return  '行走';
            case '3': return  '摇手';
          }
        },
        getUploadListNative(){
          this.queryInfo.pageSize =5;
          this.queryInfo.pageNum =1;
          this.getUploadList();
        },
        async getUploadList() {
          let obj=
            {
              user_id :JSON.parse(sessionStorage.getItem('user')).user_id,
              type : this.value.toString(),
              time : '0',
              page_num :this.queryInfo.pageNum,
              page_size:this.queryInfo.pageSize
            }
          const {data :res } = await this.$http.post('check_user_movementlist',obj)
          if(res.status !== 'success') {
            return this.$message.error('获取用户列表失败!')
          }
          else {
            this.UploadList = res.data.list
            this.total =res.data.sum
          }
          console.log(res)
        },
        handleSizeChange(newSize) {
          this.queryInfo.pageSize = newSize
          this.getUploadList()
        },
        handleCurrentChange(newPage){
          this.queryInfo.pageNum = newPage
          this.getUploadList()
        },
        async DeleteContent (Info) {
          let obj={
            user_id:this.queryInfo.user_id,
            type:Info.type,
            file_name:Info.file_name
          }
          console.log(obj)
          const { data: res } = await this.$http.post('del_file', obj)
          if(res.status==='success'){
            this.$message.success("文件删除成功");
            if(this.total -1 === (this.queryInfo.pageNum-1)*this.queryInfo.pageSize){
              this.queryInfo.pageNum=this.queryInfo.pageNum-1;
            }
            await this.getUploadList()
          }
          else {
            this.$message.success("文件删除失败");
          }
        },
        open(Info) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.DeleteContent(Info)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
  }
</script>

<style lang="less" scoped>

</style>
