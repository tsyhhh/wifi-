<template>
  <div>
    <el-card>
      <el-select style="width: 100px" v-model="value" placeholder="请选择" @change="ChangeDisable"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-card>

    <!--<el-upload
      action="/api/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :limit="1"
      :show-file-list="false"
      :auto-upload="false"
      :on-exceed="handleExceed"
    >
      <el-button style="margin-left: 10px" :disabled="(this.value==0)?true:false">上传数据?</el-button>
      &lt;!&ndash;        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;
    </el-upload>-->
    <el-card>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/api/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :limit=1
        :on-exceed="handleExceed"
        :before-remove="beforeRemove"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary" @click="consoleFile">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="disabledUpload">上传并解析</el-button>
        <div slot="tip" class="el-upload__tip">只能上传.dat文件，且需要选择类型</div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'UpLoadNew',
    data() {
      return {
        fileList: [],
        options: [{
          value:'1',
          label: 'run'
        }, {
          value:'2',
          label: 'walk'
        },{
          value:'3',
          label: 'Wave'
        }],
        value: '',
        disabledUpload:true,
      };
    },
    methods: {
        ChangeDisable() {
          this.disabledUpload=false
          //console.log(this.disabledUpload)
        },
        submitUpload() {
          this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        consoleFile() {
          console.log(this.fileList)
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        async beforeUpload (file, id) {
          this.disabledUpload=true
          const userJsonStr = sessionStorage.getItem('user')
          let userEntity = JSON.parse(userJsonStr);
          let fd = new FormData()
          let type = this.value

          fd.append('file', file)
          fd.append('user_name', userEntity.user_name)//其他参数
          fd.append('type',type)
          const { data: res } = await this.$http.post('upload', fd)

          if(res.status==='success') {
            this.$message.success('上传成功!加载需要较长时间请耐心等待')
            this.$refs.upload.clearFiles()
            this.disabledUpload=false
            let obj = {
              user_id:res.data.user_id,
              user_name:res.data.user_name,
              type:type,
              file_name:res.data.file_name,
            }

            const { data: res1 } = await this.$http.post('go_py',obj)
            if(res1.status === 'success'){
              this.$message.success('文件解析成功!')
            }
            else {
              this.$message.error('文件解析失败，请重新上传!')
            }
          }
          else {
            this.$message.error('上传失败，请检查大小和格式!')
            this.disabledUpload=false
          }
        }
      }
  }
</script>

<style scoped>

</style>
