// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 🔹 使用 Vite 的 import.meta.glob 动态导入所有 Fragment 页面
// 文件路径：src/views/fragment/*.vue
const modules = import.meta.glob('../views/fragment/*.vue')

// 🔹 将文件名映射为路由路径
const routes = Object.keys(modules).map((path) => {
    // 提取文件名，如 'Step5.vue' -> 'step5'
    const fileName = path.match(/\.\/views\/fragment\/(.+)\.vue$/)?.[1]
    if (!fileName) return null

    const routeName = fileName[0].toLowerCase() + fileName.slice(1) // Step5 -> step5
    return {
        path: `/fragment/${routeName}`,
        component: modules[path],
        props: true
    }
}).filter(Boolean) // 过滤掉 null

// 🔹 添加备用路由（可选）
routes.push({
    path: '/settings',
    component: () => import('../views/fragment/Settings.vue'),
    props: true
})

// 🔹 创建并导出路由器
export default createRouter({
    history: createWebHistory(),
    routes
})