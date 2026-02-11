<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div v-if="visible" class="modal-mask" @click.self="handleMaskClick">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-header" v-if="title">
                            <h3>{{ title }}</h3>
                            <span class="modal-close" @click="close">×</span>
                        </div>
                        <div class="modal-body">
                            <slot />
                        </div>
                        <div class="modal-footer" v-if="!hideFooter">
                            <slot name="footer">
                                <div style="color: var(--text-secondary);" @click="close">关闭</div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>
  
<script setup lang="ts">

const props = defineProps<{
    /**
     * 双向绑定展示模态框
     */
    visible: boolean;
    /**
     * 标题文案
     */
    title?: string;
    /**
     * 是否隐藏底部，优先级高于插槽的展示
     */
    hideFooter?: boolean;
    /**
     * 点击遮盖层是否关闭模态框
     */
    maskClosable?: boolean;
}>()

const emit = defineEmits(['update:visible'])

function close() {
    emit('update:visible', false)
}

function handleMaskClick() {
    if (props.maskClosable !== false) {
        close()
    }
}
</script>
  
<style scoped>
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-wrapper {
    width: 95%;
    max-width: 31.25rem;
    margin: 0 auto;
}

.modal-container {
    background-color: var(--bg-paper);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.3);
    animation: modal-in 0.3s ease;
    color: var(--color-accent);
}

.modal-header {
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 1rem;
}

.modal-footer {
    padding: 0.5rem 1rem;
    border-top: 1px solid #eee;
    text-align: right;
}

.modal-close {
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

@keyframes modal-in {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
  