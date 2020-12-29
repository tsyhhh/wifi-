<template>
  <el-card>
    <h3>跑步模拟与异常信息</h3>
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
        @click.native="changeQuery">
      </el-option>
    </el-select>
    <el-button style="margin-left: 10px" @click.native="getUploadList" :disabled="disabledQuery">查询</el-button>

    <!--    表格形式-->
    <el-table :data="SimuList" boder stripe>

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

<!--    <el-button style="margin-left: 10px" @click="ResetSeries" :disabled="(this.g_Value==0)?true:false">确定</el-button>-->
    <el-dialog fullscreen center :visible.sync="cofShow"   style="width: 1200px;height: 500px;" class="el-dialog">
      <div class="overall" style="float:left">
        <div class="person">
          <div class="head"></div>
          <div class="body">
            <div class="hand left"></div>
            <div class="hand right"></div>
          </div>
          <div class="leg">
            <div class="left"></div>
            <div class="right"></div>
          </div>
        </div>
      </div>
    <div id="main" style="width: 600px;height: 400px;float:right "></div>
    </el-dialog>
  </el-card>
</template>

<script>
  import anime from "animejs/lib/anime.es.js";  //这个无法按规范来，会报错
  import echarts from 'echarts'
  export default {
    name: 'RunSimulation',
    data() {
      return{
        disabledQuery:true,
        User:JSON.parse(sessionStorage.getItem('user')),
        SelUserId:JSON.parse(sessionStorage.getItem('user')).user_id,
        SELUserName:JSON.parse(sessionStorage.getItem('user')).user_name,
        UserOptions:[{
          user_id:JSON.parse(sessionStorage.getItem('user')).user_id,
          user_name:JSON.parse(sessionStorage.getItem('user')).user_name,
        }],
        TimeValue: '',
        g_Series: [],
        g_SeriesDealt: [],
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
        SimuList:[],
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
      changeQuery(){
        this.disabledQuery=false
      },
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
          type: '1',
          page_num: this.queryInfo.pageNum,
          time: this.TimeValue,
          page_size: this.queryInfo.pageSize
        }
        const { data: res } = await this.$http.post('check_user_movementlist', obj) //调用接口获取数据
        this.SimuList = [];
        for(let i = 0;i< res.data.list.length;i++) {//加载数据
          this.SimuList.push(res.data.list[i]);
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
            file_type:1 ,
            move_type:'abnormal',
            type: 1
          }
        if(obj.user_name ===''){
          obj.user_name = this.User.user_name;
        }
          const { data: res } = await this.$http.post('check_user_movement',obj)  //获取信息
          //console.log(res.data.content[0])

          this.g_Series = [];
          if(res.data.content!=null){
            for(let i = 0;i< res.data.content.length;i++){
              this.g_Series.push({
                type: 'line',
                smooth: true,
                showSymbol: false,
                data: res.data.content[i]
              });
            }
            this.DrawLine();
          }
          else {
            this.$alert("异常信息获取失败!")
          }
          this.Play();
        },
        Play() {
          anime
            .timeline({
              easing: "easeInOutQuad", //动画速率
              direction: "alternate", //返回执行
              duration: 600, //动画时间
              loop: true //执行次数 true 为无限次
            })
            .add({ targets: ".person", rotate: [10, 20] }, 0) //身体是否倾斜
            .add({ targets: ".hand.left", rotate: [80, -50] }, 0) //左手晃动幅度
            .add({ targets: ".hand.right", rotate: [-50, 80] }, 0) //右手晃动幅度
            .add({ targets: ".leg .left", rotate: [30, -60] }, 0) //左脚晃动幅度
            .add({ targets: ".leg .right", rotate: [-60, 30] }, 0); //右脚晃动幅度
        },
        DrawLine() {
          const myChart = echarts.init(document.getElementById('main'))
          const option = {
            title: {
                text: '异常信息'
              },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
              }],
            yAxis: [{
                type: 'value'
              }],
            series: this.g_Series,
          }
          myChart.showLoading({
            text: 'loading',
            color: '#c23531',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.2)',
            zlevel: 0,
          });
          setTimeout(() => {
            // setOption前隐藏loading事件
            myChart.hideLoading();
            myChart.setOption(option,true);
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
  };

</script>

<style lang="scss" scoped>
  .overall {
    position: absolute;
    width: 50%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .person {
    transform-origin: 50% 100%; /*旋转元素的基点位置*/
    * {
      margin: 0 auto;
    }
    .head {
      width: 40px;
      height: 40px;
      background: black;
      border-radius: 50%;
    }
    .body {
      width: 44px;
      height: 100px;
      border-radius: 40px;
      background: black;
      margin-top: 4px;
      position: relative;
      //手样式
      .hand {
        //肩膀
        position: absolute;
        width: 20px;
        height: 50px;
        left: calc(50% - 5px);
        top: 14px;
        border-radius: 20px;
        background: black;
        transform-origin: 50% 0;
        &::after {
          //手臂
          content: "";  //与 :before 及 :after 伪元素配合使用，来插入生成内容
          width: 20px;
          height: 50px;
          border-radius: 20px;  //向 div 元素添加圆角边框
          background: black;
          position: absolute;
          bottom: 10px;
          left: -6px;
          transform-origin: 50% 100%;
          transform: rotate(130deg); //手臂弯曲幅度
        }
      }
      .hand.left {
        z-index: -1;  //设置元素的堆叠顺序
      }
    }
    .leg {
      width: 20px;
      position: relative;
      top: -20px;
      .left,
      .right {
        // 大腿
        width: 20px;
        height: 60px;
        background: black;
        border-radius: 20px;
        position: absolute;
        transform-origin: 50% 0;
        &::after {
          //小腿
          content: "";
          width: 20px;
          height: 60px;
          border-radius: 20px;
          background: black;
          position: absolute;
          bottom: 10px;
          left: 4Wpx;
          transform-origin: 50% 100%;
          transform: rotate(-130deg); //小腿弯曲幅度
        }
      }
    }
  }
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
