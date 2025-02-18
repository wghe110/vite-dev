<template>
  <div class="wrap-404">
    <img src="./images/404.png" alt="">
    <span>您访问的页面不存在</span>
    <router-link to="/">
      <el-button>返回首页</el-button>
    </router-link>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.wrap-404 {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  // background-color: #fff;

  >img {
    width: 400px;
  }

  >span {
    padding: 24px;
  }
}
</style>