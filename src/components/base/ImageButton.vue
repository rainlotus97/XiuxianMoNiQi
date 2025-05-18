<template>
    <div class="basic_btn" @click="handleClick" :style="{ background: `url(${bgImage}) 0% 0% / contain no-repeat` }"></div>
</template>
    
<script setup lang='ts'>
defineProps<{
    bgImage: string; // 背景图片 URL
}>();
const emits = defineEmits<{
  (e: 'click'): void;
}>();
const handleClick =()=>{
    emits('click')
}
</script>
    
<style scoped lang="less">
.basic_btn {
    width: 11.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
    background-size: contain;
    box-shadow: 0 0.25rem 0.9375rem rgba(0, 0, 0, 0.2);
    margin: 0 auto;
    cursor: pointer;

    &:hover,
    &:active {
        transform: translateY(2px) scale(0.98);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
}
</style>