<!-- src/views/fragment/Step5.vue -->
<template>
    <div class="content-page">
        <div class="card">
            Settings
            <button @click="$router.back()">确认更改</button>
        </div>
    </div>
</template>

<style scoped>
.content-page {
    position: fixed;
    inset: 0;
    z-index: 2000;
    backdrop-filter: blur(4px);
    text-align: center;
    padding: 20px;
}

.card {
    position: relative;
    left: 16.25rem;
    top: 15rem;
    width: 43.75rem;
    height: 143.75rem;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    /* 启用垂直滚动 */
    /* 隐藏默认滚动条（可选） */
    scrollbar-width: none;
}

button {
    position: absolute;
    bottom: 0;
    left: 14.375rem;
    padding: 10px 20px;
    font-size: clamp(40px, 8.8vw, 56px);
    background: #aa69e85a;
    color: white;
    border: none;
    border-radius: 1.1rem;
    cursor: pointer;
}
</style>