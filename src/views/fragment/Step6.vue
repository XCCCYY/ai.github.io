<!-- src/components/fragments/Step6Content.vue -->
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Live2DModel from '@/components/Live2DModel.vue'

// 是否正在说话
const isTalking = ref(false)
// 是否正在倾听
const isListening = ref(false)
// 对话历史
const messages = ref([])

// 模型实例引用（用于控制动作）
let live2dModel = null

// 初始化语音识别
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
recognition.lang = 'zh-CN'
recognition.continuous = true
recognition.interimResults = true

// 语音合成
const synth = window.speechSynthesis

// 开始语音识别
const startListening = () => {
    isListening.value = true
    recognition.start()
}

// 停止识别
const stopListening = () => {
    isListening.value = false
    recognition.stop()
}

// 发送用户语音到后端并获取回复
// ✅ 正确：调用你自己的后端 API
const sendToLLM = async (text) => {
    try {
        // ✅ 改为调用本地 /api/chat
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })

        const data = await res.json()
        const reply = data.reply || '我暂时无法联网，但很高兴见到你！'

        // ✅ 添加到对话历史
        messages.value.push({ role: 'user', content: text })
        messages.value.push({ role: 'ai', content: reply })

        // ✅ 让模型说话
        speak(reply)
    } catch (error) {
        console.error('Request failed:', error)
        const fallback = '我暂时无法联网，但很高兴见到你！'
        messages.value.push({ role: 'user', content: text })
        messages.value.push({ role: 'ai', content: fallback })
        speak(fallback)
    }
}

// 模型说话
const speak = (text) => {
    isTalking.value = true
    stopListening() // 停止监听

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 1 // 语速
    utterance.pitch = 1 // 音调

    utterance.onstart = () => {
        // 开始说话 → 触发嘴型动画
        if (live2dModel) {
            live2dModel.startMouthMovement() // 假设 Live2D 支持此方法
            live2dModel.setExpression('happy') // 根据内容调整表情
        }
    }

    utterance.onend = () => {
        isTalking.value = false
        // 说完后继续监听
        startListening()
    }

    synth.speak(utterance)
}

// 挂断通话
const hangUp = () => {
    stopListening()
    synth.cancel()
    // 回到主界面
    window.history.back()
}

// 监听语音识别结果
recognition.onresult = (event) => {
    let finalTranscript = ''
    let interimTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
            finalTranscript += transcript
        } else {
            interimTranscript += transcript
        }
    }

    if (finalTranscript) {
        sendToLLM(finalTranscript)
    }
}

// 错误处理
recognition.onerror = (event) => {
    console.warn('Speech recognition error', event.error)
}

// 模型加载完成回调
const onModelReady = (model) => {
    live2dModel = model
    // 可以设置初始表情
    live2dModel.setExpression('normal')
}

onMounted(() => {
    startListening()
})

onUnmounted(() => {
    stopListening()
    synth.cancel()
})
</script>

<template>
    <!-- 全屏透明玻璃层 -->
    <div class="glass-call-container">
        <!-- Live2D 模型居中 -->
        <div class="model-wrapper">
            <Live2DModel @ready="onModelReady" />
        </div>

        <!-- 对话历史（可选显示） -->
        <div class="chat-history">
            <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
                <strong>{{ msg.role === 'user' ? '你' : '角色' }}:</strong> {{ msg.content }}
            </div>
        </div>

        <!-- 挂断按钮 -->
        <button class="hang-up-btn" @click="hangUp">
            挂断
        </button>

        <!-- 状态指示 -->
        <div class="status-indicator">
            <span v-if="isListening">🎙️ 倾听中...</span>
            <span v-if="isTalking">🗣️ 说话中...</span>
        </div>
    </div>
</template>

<style scoped>
.glass-call-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: white;
}

.model-wrapper {
    width: 400px;
    height: 500px;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
}

.chat-history {
    max-height: 200px;
    overflow-y: auto;
    width: 80%;
    font-size: 14px;
    opacity: 0.8;
    text-align: left;
    margin-bottom: 20px;
}

.message {
    margin: 4px 0;
    padding: 4px 8px;
    border-radius: 8px;
}

.message.user {
    background: rgba(255, 255, 255, 0.2);
}

.message.ai {
    background: rgba(100, 180, 255, 0.3);
}

.hang-up-btn {
    position: absolute;
    bottom: 40px;
    padding: 12px 30px;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.status-indicator {
    position: absolute;
    top: 40px;
    font-size: 18px;
    font-weight: bold;
}
</style>