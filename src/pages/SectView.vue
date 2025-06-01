<template>
    <div class="main_page">
        宗门
        <div class="btn" @click="backToLogin">返回登录页</div>
        <div class="btn" @click="saveData">保存数据</div>
    </div>
</template>
    
<script setup lang='ts'>
import router from '@/router';

// import { Person, SlideType } from '@/common/battle/person';
import { useBasicStore } from '@/stores/basicStore';
// import { encryptData } from '@/utils/cryptTools';

const basicStore = useBasicStore();
// let person = new Person('陈平安', SlideType.FRIENDLY)
const saveData = () => {
    // const userData = encryptData(JSON.stringify(person))
    // basicStore.saveData(userData)
}

const backToLogin = () => {
    basicStore.setBackToLogin(true);
    router.replace('/')
}
</script>
    
<style lang="less" scoped>
.btn {
    width: 5.375rem;
    height: 2.375rem;
    border-radius: 0.25rem;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    text-align: center;
    line-height: 2.375rem;
    background-color: rgb(9, 135, 239);
    color: #fff;
}
</style>