<!-- src/components/Live2DModel.vue -->
<template>
    <canvas ref="liveCanvas" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

// 全局暴露 PIXI
window.PIXI = PIXI

const liveCanvas = ref(null)
let app = null
let model = null

const getScaleWithVerticalMargin = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const totalVerticalMargin = h * 0.7
    const availableHeight = h - totalVerticalMargin // 模型最大可用高度
    // Cubism 模型通常“站立”高度约为 2000px 左右（具体看 .moc3 导出设置）
    // 可通过调试获取：console.log(model?.bounds?.height)
    const NATURAL_MODEL_HEIGHT = 2000 // 常见 Live2D 模型默认高度，可调整

    // 计算基于高度的缩放
    let scaleFromHeight = availableHeight / NATURAL_MODEL_HEIGHT

    // 同时考虑宽度：不超过宽度的 80%
    const availableWidth = w * 0.8
    const NATURAL_MODEL_WIDTH = 1000 // 估算宽度
    let scaleFromWidth = availableWidth / NATURAL_MODEL_WIDTH

    // 取更小的缩放值，确保不溢出
    let scale = Math.min(scaleFromHeight, scaleFromWidth)

    // 安全范围限制
    const minScale = 0.08
    const maxScale = 0.35
    scale = Math.min(Math.max(scale, minScale), maxScale)

    // 居中定位
    const x = w * 0.5
    const y = h * 0.5 // 垂直居中

    return { scale, x, y }
}

/**
 * 更新布局
 */
const updateLayout = () => {
    if (!app || !model) return
    const { scale, x, y } = getScaleWithVerticalMargin()
    model.scale.set(scale)
    model.position.set(x, y)
}

// ================================
// 🎮 生命周期
// ================================

onMounted(async () => {
    const canvas = liveCanvas.value
    if (!canvas) return

    app = new PIXI.Application({
        view: canvas,
        autoStart: true,
        backgroundAlpha: 0,
        resizeTo: window,
    })

    try {
        model = await Live2DModel.from('/models/灵蝶之狐/灵蝶之狐模型/芊芊.model3.json')
        model.anchor.set(0.5, 0.5) // 中心锚点
        app.stage.addChild(model)

        // 👉 关键：首次加载后尝试打印模型真实高度（用于调试）
        // 可在浏览器控制台查看，然后替换上面的 NATURAL_MODEL_HEIGHT
        setTimeout(() => {
            if (model && model.bounds) {
                console.log('Live2D 模型实际高度:', model.bounds.height)
                console.log('建议更新 NATURAL_MODEL_HEIGHT 为此值')
            }
        }, 100)

        // 启用交互
        model.interactive = true
        model.on('pointerdown', () => {
            console.log('Live2D 模型被点击！')
        })

        // 初始布局
        updateLayout()

        // 监听 resize
        const handleResize = () => updateLayout()
        app.renderer.on('resize', handleResize)
        window.__live2d_resize = handleResize

    } catch (error) {
        console.error('❌ Live2D 模型加载失败:', error)
    }
})

onBeforeUnmount(() => {
    if (app && app.renderer && window.__live2d_resize) {
        app.renderer.off('resize', window.__live2d_resize)
        delete window.__live2d_resize
    }

    if (model) {
        model.destroy({ children: true, texture: true, baseTexture: true })
        model = null
    }

    if (app) {
        app.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true,
            context: true
        })
        app = null
    }
})
</script>

<style scoped>
canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: block;
    outline: none;
    touch-action: none;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    pointer-events: none;
}
</style>