<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { LogUtil } from '../../utils/logUtils';

// 滚动容器 Ref
const scrollContainer = ref<HTMLElement | null>(null)
// 是否允许自动滚动
const shouldAutoScroll = ref(true)
// 滚动事件节流标识
let isScrolling = false

// 监听数据变化（示例数组）
const messageList = LogUtil.LOG_LIST;
watch(messageList, () => {
    if (!shouldAutoScroll.value) return

    nextTick(() => {
        scrollToBottom()
    })
})

// 滚动到底部方法
const scrollToBottom = () => {
    if (!scrollContainer.value) return
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

// 判断是否在底部
const isAtBottom = (threshold = 5): boolean => {
    if (!scrollContainer.value) return true
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value
    return scrollHeight - (scrollTop + clientHeight) < threshold
}

// 滚动事件处理器（带节流）
const handleScroll = () => {
    if (isScrolling) return
    isScrolling = true

    requestAnimationFrame(() => {
        shouldAutoScroll.value = isAtBottom()
        isScrolling = false
    })
}

// 初始化事件监听
onMounted(() => {
    scrollContainer.value?.addEventListener('scroll', handleScroll)
})

// 清理事件监听
onUnmounted(() => {
    scrollContainer.value?.removeEventListener('scroll', handleScroll)
})

const returnToBottom = () => {
    const timer = setTimeout(() => {
        shouldAutoScroll.value = true;
        scrollToBottom();
        clearTimeout(timer)
    }, 350);
}
</script>

<template>
    <div class="log_view">
        <div ref="scrollContainer" class="scroll-container">
            <div v-for="(msg, index) in messageList" :key="index" class="message-item" v-html="msg">
            </div>
        </div>
        <transition name="fade-slide">
            <div v-show="!shouldAutoScroll" class="back-button" @click="returnToBottom">
                ↓ 返回底部
            </div>
        </transition>
    </div>
</template>

<style lang="less">
.log_view {
    width: 100%;
    height: 15.625rem;
    position: relative;

    .scroll-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        position: absolute;
    }


    .message-item {
        padding: 0.625rem;
    }

    .log-friendly {
        color: #2ecc71;
        font-size: 1.125rem;
        font-weight: bold;
        /* 绿 */
    }

    .log-enemy {
        color: #f33c28;
        font-size: 1rem;
        font-weight: bold;
        /* 红 */
    }

    .log-de_buff {
        color: #a406f9;
        font-weight: bolder;
    }


    .log-buff {
        color: #f7fe3c;
        font-size: 1rem;
        font-weight: bolder;
    }

    .log-system {
        color: #999;
        font-style: italic;
    }

    .log-primary {
        font-size: 1.125rem;
        color: #4980f6;
    }

    .log-danger {
        font-size: 1rem;
        color: #f90909;
    }

    .back-button {
        position: absolute;
        right: 20px;
        bottom: 20px;
        padding: 8px 16px;
        border-radius: 20px;
        background: #2196f3;
        color: white;
        border: none;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s ease;
    }

    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.3s ease;
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }
}
</style>