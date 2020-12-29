<template >
  <div class="container" >
    <el-header>
      <div>
        <i class="el-icon-tsy-wifi" />
        <span>wifi人体动作识别系统</span>
      </div>
        <span>
          <b style="color: white;font-size: 14px;" @click="ToLogin">登录</b>
          <b style="color: white;font-size: 14px; margin-left: 5px" @click="ToRegister">注册</b>
        </span>
    </el-header>
    <div class="index">
      <!-- 跑马灯  -->
      <div>
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in g_ImgList" :key="item.id">
            <img :src="item.idView" class="image">
          </el-carousel-item>
        </el-carousel>
        <span>

        </span>
      </div>
      <el-card class="MyText">
        <h4>研究背景:</h4>
        <p  >
          在移动互联网技术的飞速发展的今天，WiFi 技术也在不断发展，目前已演变成为人
          类生活中不可或缺的一部分。众所周知，WiFi 信号是动态变化的，信号在从发送方到
          接收方的传输过程中会受到各种各样的外界干扰，这些干扰可能是声音，可能是人类活
          动，或是其他等等。因此探讨人类活动对WiFi 信号产生的影响成为当前的研究热点，
          同时诸多研究人员纷纷投身于该问题的研究探索中。这几年，随着人类对智能化生活需
          求的不断攀升，互联网技术和人工智能技术都在飞速发展，技术的发展往往带来硬件设
          备的革新，因此越来越多的高端WiFi 设备正在广泛的普及，并随之覆盖我们生活的各
          个角落，这在很大程度上给研究人员提供了便利，同时也成为我们探究人类动作对WiFi
          信号影响的新手段。
        </p>
        <h4>CSI科普:</h4>
        <p>
          在该项研究中，我们充分利用了WiFi 信号中隐藏的一大信息资源——信道状态信
          息（Chanel State Information,CSI），CSI 是通信链路的信道属性，它描述了信号在每条
          传输路径上的衰弱因子（信道增益矩阵H中每个元素的值），如信号散射、环境衰弱、
          距离衰减等信息。CSI 可以使通信系统适应当前的信道条件，在多天线系统中为高可
          靠性高速率的通信提供了保障，因此通信链路中CSI 的变化有效的代表了整个WiFi 信
          号的变化。通过提取WiFi 数据包中的CSI 信息，来展开本次基于CSI 的人类动作检测研究。</p>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
    data() {
      return {
        g_ImgList: [
          {id:0,idView:require('../assets/png/csi/csi-1.jpg')},
          {id:1,idView:require('../assets/png/csi/csi-2.jpg')},
          {id:2,idView:require('../assets/png/csi/csi-3.png')},
        ]
      };
    },
    methods: {
        ToLogin() { //跳转到登录界面
          this.$router.push('/login');
        },
        ToRegister() { //跳转到注册界面
          this.$router.push('/Register');
        }
    }
  }
</script>
<style>
  .container{
    background: url("../assets/png/background-1.png") fixed;
    background-size: 100% 100%;
    height: 100%;
  }
  .index{
    width: 80%;
    text-align: center;
    margin-left: 142px;
    width: 80.6%;

  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  .el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #eeeeee;
    padding-left: 0px;
    font-size: 20px;

  }
  .MyText{
    text-indent:2em;
    text-align: left;
  }
</style>
