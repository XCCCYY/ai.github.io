<!-- src/App.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Live2DModel from './components/Live2DModel.vue'
import GlassShards from './components/GlassShards.vue'

const route = useRoute()

// 判断是否为内容页（需要隐藏 Live2D 和碎片）
const isContentPage = computed(() => {
  return route.path.startsWith('/fragment/')
})
</script>

<template>
  <!-- 固定层：Live2D 和 玻璃碎片（非内容页时显示） -->
  <Live2DModel v-if="!isContentPage" />
  <GlassShards v-if="!isContentPage" />

  <!-- 路由出口：内容页在这里显示 -->
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url("./assets/弹幕.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>