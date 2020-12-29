<template>
  <el-card>
    <h3>摇手相位</h3>
    <el-select @change="selectGet" v-if="User.user_type!=='0'"  style="width: 200px" v-model="SelUserId" placeholder="请选择">
      <el-option
        v-for="item in UserOptions"
        :key="item.user_id"
        :label="item.user_name"
        :value="item.user_id"
      ></el-option>
    </el-select>

    <el-select  style="width: 200px;margin-left: 10px" v-model="TimeValue" placeholder="请选择时间段">
      <el-option
        v-for="item in TimeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click.native="getUploadList">
      </el-option>
    </el-select>

    <!--    表格形式-->
    <el-table :data="PhaseList" boder stripe>

      <el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="文件名" prop="file_name"></el-table-column>
        <el-table-column label="上传人" prop="user_name"></el-table-column>
        <el-table-column label="上传时间" prop="time"></el-table-column>
        <!--            操作-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-magic-stick" size="mini" @click="LookContent(scope.row.file_name)"></el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--    echarts 表格-->
    <el-dialog fullscreen center :visible.sync="cofShow"   style="width: 1200px;height: 500px;" class="el-dialog">
      <div id="main" style="height: 400px; width: 500px ;float:left "  ></div>
      <div id="mainDealt" style="height: 400px; width: 500px;float:right "></div>
    </el-dialog>
  </el-card>
</template>

<script>
  import echarts from 'echarts'
  export default
  {
    name: 'WavePhase',
    data() {
      return{
        User:JSON.parse(sessionStorage.getItem('user')),
        g_Series: [],
        g_SeriesDealt: [],
        UserOptions:[{
          user_id:JSON.parse(sessionStorage.getItem('user')).user_id,
          user_name:JSON.parse(sessionStorage.getItem('user')).user_name,
        }],
        TimeOptions: [
          {
            label:'所有数据',
            value:'0'
          },
          {
            label:'一天内',
            value:'1'
          },
          {
            label:'一周内',
            value:'2'
          }
        ],
        PhaseList:[],
        TimeValue: '',
        SelUserId:JSON.parse(sessionStorage.getItem('user')).user_id,
        SELUserName:JSON.parse(sessionStorage.getItem('user')).user_name,
        queryInfo :{
          pageNum:1,
          pageSize:5
        },
        cofShow:false,
        total:0,
        file_name:'',
      }
    },
    methods: {
      selectGet(val){
        let obj = {}
        obj = this.UserOptions.find(function(item){
          return item.user_id === val
        })
        //console.log(obj);
        this.SELUserName = obj.user_name
        //console.log(this.SELUserName)
      },
      async getUploadList () {
        let obj = {
          user_id: this.SelUserId,
          type: '3',
          page_num: this.queryInfo.pageNum,
          time: this.TimeValue,
          page_size: this.queryInfo.pageSize
        }
        const { data: res } = await this.$http.post('check_user_movementlist', obj) //调用接口获取数据
        this.PhaseList = [];

        for(let i = 0;i< res.data.list.length;i++) {//加载数据
          this.PhaseList.push(res.data.list[i]);
        }
        this.total = res.data.sum
      },
      LookContent(FileName){
        this.file_name = FileName;
        console.log(FileName)
        this.open()
      },

      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUploadList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getUploadList()
      },

      open(){
        this.cofShow = true;
        setTimeout( ()=>  {
          this.ResetSeries()
        },100)},

      async ResetSeries() {

        let obj = {
          user_name:this.SELUserName,
          file_name: this.file_name,
          file_type:3 ,
          move_type:'phase',
          type: 0
        }
        let obj1 = {
          user_name:this.SELUserName,
          file_name: this.file_name,
          file_type:3 ,
          move_type:'phase',
          type: 1
        }
        if(obj.user_name ===''){
          obj.user_name = this.User.user_name;
          obj1.user_name = this.User.user_name;
        }
        const { data: res } = await this.$http.post('check_user_movement',obj)  //获取数据
        const { data: res_dealt } = await this.$http.post('check_user_movement',obj1)//获取数据

        this.g_Series = [];
        this.g_SeriesDealt = [];//清空原有数据
        for(let i = 0;i< res.data.content.length;i++) {//加载数据
          this.g_Series.push({
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: res.data.content[i]
          });
        }
        for(let i = 0;i< res_dealt.data.content.length;i++)//加载数据
        {
          this.g_SeriesDealt.push({
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: res_dealt.data.content[i]
          });
        }
        this.DrawLine();
      },
      DrawLine()  //画图
      {
        const myChart = echarts.init(document.getElementById('main'))
        const myChartDealt = echarts.init(document.getElementById('mainDealt'))
        let option =
          {
            title:
              {
                text: '幅度信息'
              },
            toolbox:
              {
                feature:
                  {
                    saveAsImage: {}
                  }
              },
            grid:
              {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: this.g_Series,
          }
        myChart.showLoading({
          text: 'loading',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.2)',
          zlevel: 0,
        });
        myChartDealt.showLoading({
          text: 'loading',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.2)',
          zlevel: 0,
        });
        setTimeout(() => {
          // setOption前隐藏loading事件
          myChart.hideLoading();
          myChartDealt.hideLoading();
          myChart.setOption(option,true);
          option.series=this.g_SeriesDealt
          option.title.text='处理结果:'
          myChartDealt.setOption(option,true);
        }, 1000);
      }
    },
    async mounted () {
      let obj={
        manager_id :this.User.user_id,
      }
      if(this.User.user_type !=='0'){
        const { data: list } = await this.$http.post('check_user_list',obj)//获取数据
        console.log(list)
        for(let i=0;i<list.data.length;i++){
          this.UserOptions.push(list.data[i])
        }
      }

    }
  }
</script>

<style scoped>
  .el-dialog {
    display: flex;  /*弹性布局*/
    flex-direction: column;/*垂直显示*/
    margin:0 !important;/*偏移*/
    position:absolute;  /*对定位的元素，相对于 static 定位以外的第一个父元素进行定位*/
    top:10%;
    left:10%;

  }
  .el-dialog .el-dialog__body {
    flex:1;
    overflow: auto;
  }

</style>
