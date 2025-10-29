<!-- src/components/GlassShards.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['hide']) // 定义事件
const leftFragments = [
    { id: 'step5', imgSrc: './img/icon_3d06sz848ac/playingnormal.png', label: '模型切换' },
    { id: 'step6',imgSrc:'./img/icon_3d06sz848ac/yuyin.png', label: '语音', },
    { id: 'step7',imgSrc:'./img/icon_3d06sz848ac/aixin.png', label: '性格调教', },
    { id: 'step8',imgSrc:'./img/icon_3d06sz848ac/ic_gushi.png', label: '长期记忆', }
]

const rightFragments = [
    { id: 'settings',imgSrc:'./img/icon_3d06sz848ac/mendianshezhi.png', label: '设置', },
    { id: 'step9',imgSrc:'./img/icon_3d06sz848ac/shouji.png', label: '桌宠', },
    { id: 'step10',imgSrc:'./img/icon_3d06sz848ac/fangzi-copy.png', label: '唤醒词', }
]

// ✅ 点击时带上 ?from=shard
// 点击事件处理
const handleFragmentClick = (fragment) => {
    console.log('点击了碎片:', fragment.label, 'ID:', fragment.id)
    // 跳转到对应内容页（使用路径而非命名路由）
    router.push({
        path: `/fragment/${fragment.id}`,
        query: { from: 'shard' } // 可选：传递来源信息
    })
}
</script>

<!-- src/components/Fragments.vue -->
<template>
    <div class="fragments-container left">
        <div v-for="fragment in leftFragments" :key="fragment.id" class="fragment-wrapper"
            @click="handleFragmentClick(fragment)">
            <button class="fragment-btn" role="button">
                <div class="bubble-content">
                    <div class="icon-container">
                        <img :src="fragment.imgSrc">
                    </div>
                    <div class="label">{{ fragment.label }}</div>
                </div>
            </button>
        </div>
    </div>

    <div class="fragments-container right">
        <div v-for="fragment in rightFragments" :key="fragment.id" class="fragment-wrapper"
            @click="handleFragmentClick(fragment)">
            <button class="fragment-btn" role="button">
                <div class="bubble-content">
                    <div class="icon-container">
                        <img :src="fragment.imgSrc">
                    </div>
                    <div class="label">{{ fragment.label }}</div>
                </div>
            </button>
        </div>
    </div>
</template>

<style scoped>
/* 容器布局 */
.fragments-container {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 4vh;
    z-index: 10;
}

.left {
    left: 6vw;
}

.right {
    right: 6vw;
}

/* 外层包裹 */
.fragment-wrapper {
    width: 14vw;
    height: 14vw;
    min-width: 70px;
    min-height: 70px;
    position: relative;
    cursor: pointer;
    /* 点击手型提示 */
}

/* 水泡按钮 - 核心样式 */
.fragment-btn {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, #a899f162, #c4c1d336);
    border: 2px solid #ffffff80;
    box-shadow:
        0 0 20px #87cefa99,
        0 0 0 2px #ffffff4d,
        inset 0 0 10px #ffffff80;
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
    cursor: pointer;
    outline: none;
    border: none;
    padding: 0;
}

/* 水泡内容容器 */
.bubble-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
}

/* 图标容器 */
.icon-container {
    width: 60%;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8%;

    /* 图标样式 */
    img {
        position: relative;
        top: 3.125rem;
        width: 100%;
        opacity: 0.8;
        font-size: 1.2em;
    }
}

/* 文字标签 */
.label {
    font-size: clamp(40px, 8.8vw, 56px);
    color: #9d91dcfd;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1px;
    white-space: nowrap;
    position: relative;
    top: 3.0667vw;
}

/* 内部漂浮光斑动画 */
.fragment-btn::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 15%;
    width: 15%;
    height: 15%;
    background: #ffffff66;
    border-radius: 50%;
    animation: float-bubbles 3s infinite linear;
    z-index: 0;
}

.fragment-btn::after {
    content: '';
    position: absolute;
    top: 30%;
    right: 20%;
    width: 10%;
    height: 10%;
    background: #ffffff4d;
    border-radius: 50%;
    animation: float-bubbles 4s infinite linear reverse;
    z-index: 0;
}

@keyframes float-bubbles {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.4;
    }

    20% {
        transform: translate(2px, -2px) scale(1.1);
        opacity: 0.6;
    }

    40% {
        transform: translate(-1px, -4px) scale(0.9);
        opacity: 0.5;
    }

    60% {
        transform: translate(3px, -6px) scale(1.2);
        opacity: 0.7;
    }

    80% {
        transform: translate(-2px, -8px) scale(0.8);
        opacity: 0.4;
    }

    100% {
        transform: translate(1px, -10px) scale(1);
        opacity: 0.3;
    }
}

/* 原地缓慢抖动动画 */
@keyframes wiggle {

    0%,
    100% {
        transform: rotateX(0deg) rotateY(0deg) translateZ(0);
    }

    25% {
        transform: rotateX(2deg) rotateY(1deg) translateZ(2px);
    }

    50% {
        transform: rotateX(-1deg) rotateY(-1deg) translateZ(1px);
    }

    75% {
        transform: rotateX(1deg) rotateY(0.5deg) translateZ(3px);
    }
}

.fragment-btn {
    animation: wiggle 3s infinite alternate;
}

/* 悬停增强效果 */
.fragment-btn:hover {
    transform: scale(1.15) rotateX(10deg) rotateY(10deg) translateZ(10px);
    box-shadow:
        0 15px 40px #a497e59c,
        0 0 0 2px #c4c1d3b5,
        0 0 30px #C4C1D3;
}

.fragment-btn:active {
    transform: scale(1.05) translateZ(5px);
}
</style>