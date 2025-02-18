<template>
  <section class="not-authority">
    <img src="./images/no-limit.png" alt="">
    <span>您没有权限访问本系统，请向管理员申请权限</span>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.not-authority {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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