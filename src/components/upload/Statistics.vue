<template>
  <el-card>
    <h3>个人上传数据统计数据:</h3>
    <div id="main" style="height: 400px; width: 500px ;float: left"></div>
    <div id="mainDealt" style="height: 400px; width: 500px;float:right "></div>
  </el-card>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'Statistics',
    data() {
      return {
        SeriesData: [],
        SeriesDataX: [],
        SeriesDataY: []
      }
    },
    methods: {
      drawLine() {
        const myChart = echarts.init(document.getElementById('main'))
        const myChart2 = echarts.init(document.getElementById('mainDealt'))
        const option = {
          backgroundColor: '#2c343c',
          title: {
            text: '组成情况:',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [{
              name: '组成部分',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: this.SeriesData.sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              labelLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              animationType: 'scale',
              animationEasing: 'elasticOut'
            }
          ]
        };
        const option2 = {
          backgroundColor: '#FFFAF0',
          title: {
            text: '具体数据:',
            left: 'center',
            top: 20,
          },
          xAxis: {
            type: 'category',
            data: this.SeriesDataX
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.SeriesDataY,
            type: 'bar'
          }]
        };
        myChart.setOption(option,true)
        myChart2.setOption(option2,true)
      }
    },
    async mounted () {
      let obj = {
          user_id:JSON.parse(sessionStorage.getItem('user')).user_id,
        }
      const { data: res } = await this.$http.post('statistics',obj)
      this.SeriesData=res.data
      let xray =[];
      let yray =[];
      for(let i = 0;i< res.data.length;i++) {
        xray.push(res.data[i].name);
        yray.push(res.data[i].value);
      }
      this.SeriesDataX = xray
      this.SeriesDataY = yray
      /*console.log(this.SeriesData)
      console.log(this.SeriesDataX)
      console.log(this.SeriesDataY)*/
      this.drawLine();
    }

  }
</script>

<style scoped>

</style>
