<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { MediaCheckHelper, type MediaHelperType, type MediaHelperCallback } from '@/utils/mediaHelper';
import { useBasicStore } from './stores/basicStore';
import { DocumentViewChange } from './utils/viewChangeUtils';
import TabBar from '@/components/base/TabBar.vue';
import { ref } from 'vue';
import router from '@/router';
import ImageButton from '@/components/base/ImageButton.vue';
import RegisterView from '@/components/register/RegisterView.vue';
import login_btn from '@/assets/images/login_btn.png';
import register_btn from '@/assets/images/register_btn.png';
import { ShowType, type SaveDataInfo } from './common/common';
import { PlayerDataManager } from './utils/playerdata/playerDataManager';
import type { Ref } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import SaveDataPage from '@/components/base/SaveDataPage.vue';

const basicStore = useBasicStore();
// 媒体查询回调
const medialHelperCallback: MediaHelperCallback = (data: MediaHelperType) => {
  basicStore.updateMediaHelperType(data);
  console.log('MediaCheckHelper callback:', data);
};

let showType = ref(ShowType.LOGIN);
// 当前的存储数据
let currentSaveData: Ref<SaveDataInfo | null> = ref(null);
onMounted(() => {
  // 初始化 MediaCheckHelper
  MediaCheckHelper.init(medialHelperCallback);
  // 设置初始的 mediaHelperType
  const mediaHelperType = MediaCheckHelper.getMediaHelperType();
  // 更新 store 中的 mediaHelperType
  basicStore.updateMediaHelperType(mediaHelperType);
  viewChange(mediaHelperType);
  initPlayerData();
});

// 初始化用户数据
const initPlayerData = () => {
  PlayerDataManager.initData()
  showType.value = PlayerDataManager.isLoginIn() ? ShowType.HOME : ShowType.LOGIN;
  currentSaveData.value = basicStore.getCurrentPlayer()
}

// 监听媒体查询类型
watch(
  () => basicStore.mediaHelperType,
  (newValue: MediaHelperType) => {
    console.log('Media query changed:', newValue);
    viewChange(newValue);
  }
);

// 监听是否主动回到登录页
watch(
  () => basicStore.isBackToLogin,
  (newValue: boolean) => {
    console.log('isBackToLogin changed:', newValue);
    initPlayerData();
  }
);

// 视图大小变更
const viewChange = (mediaType: MediaHelperType) => {
  let fontSize = 16;
  if (mediaType.gridColumns === 4) {
    fontSize = 16;
  } else if (mediaType.gridColumns === 8) {
    fontSize = 18;
  } else {
    fontSize = 20;
  }
  DocumentViewChange.setWindowFontSize(fontSize);
  const tabBarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tab-bar-height'));
  DocumentViewChange.setWindowAvoidArea(20, 20, 20, 25 + tabBarHeight * fontSize);
}

onUnmounted(() => {
  // 清理 MediaCheckHelper
  MediaCheckHelper.destroy();
});

// 点击登录
const login = () => {
  const isUserExist = PlayerDataManager.isUserExist();
  if (!isUserExist) {
    register();
    return;
  }
  showType.value = ShowType.HOME;
  basicStore.setBackToLogin(false);
  router.replace('/cultivation')
}
// 注册页模态框显示变量
const showRegisterModal = ref(false)

// 打开注册页
const register = () => {
  showType.value = ShowType.REGISTER;
  showRegisterModal.value = true
}

// 关闭注册页，需要重新更新数据
const closeView = () => {
  currentSaveData.value = basicStore.getCurrentPlayer()
  showType.value = ShowType.LOGIN;
  showRegisterModal.value = false
}

// 显示存档页面
const showSaveDataPage = ref(false);

// 打开存档模态框
const openSaveDataPageModal = () => {
  showSaveDataPage.value = true;
}

const selectIdChange = (val: string) => {
  console.log(val);
  initPlayerData();
}
</script>

<template>
  <!-- 游戏内首页 -->
  <div class="main_box" v-if="showType === ShowType.HOME">
    <div class="main_nav"></div>
    <div class="main_content">
      <TabBar />
      <router-view v-slot="{ Component }">
        <KeepAlive :max="4">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </div>
    <div class="main_footer"></div>
  </div>

  <!-- 登录主页 -->
  <div class="main_box login_view" :class="{
    grid4: basicStore.mediaHelperType.gridColumns === 4 ||
      (basicStore.mediaHelperType.gridColumns > 4 && basicStore.mediaHelperType.orientationType === 'portrait'),
    grid8: basicStore.mediaHelperType.gridColumns > 4 && basicStore.mediaHelperType.orientationType !== 'portrait'
  }" v-else>
    <div class="image_area">
      <div class="title">
        <img src="./assets/images/banner.png" width="100%" height="fit-content" alt="" srcset="">
      </div>
      <div class="main_person">
        <img src="./assets/images/main_person.png" width="100%" height="fit-content" alt="" srcset="">
      </div>
    </div>
    <div class="current_user" v-show="currentSaveData">
      <span class="username">{{ currentSaveData?.nickName }}</span>
      <svg @click="openSaveDataPageModal" t="1748780636568" class="icon re_select" viewBox="0 0 1204 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="9501" width="200" height="200">
        <path
          d="M792.937412 787.094588a366.411294 366.411294 0 0 1-215.762824 66.43953c-10.24-0.180706-20.178824-0.903529-30.177882-1.626353-4.035765-0.421647-8.131765-1.084235-12.16753-1.686589a302.260706 302.260706 0 0 1-23.311058-3.553882c-4.698353-0.783059-9.396706-2.108235-13.974589-3.19247a334.426353 334.426353 0 0 1-22.287058-5.421177c-3.493647-1.385412-6.746353-2.409412-10.24-3.855059a279.732706 279.732706 0 0 1-25.057883-9.035294l-5.421176-2.16847a646.384941 646.384941 0 0 1-28.129883-13.673412c-0.301176-0.240941-0.783059-0.421647-1.14447-0.602353a367.435294 367.435294 0 0 1-83.84753-62.945883l-1.264941-1.325176a307.380706 307.380706 0 0 1-26.262588-29.756235 366.411294 366.411294 0 0 1-80.715294-229.376H310.211765L155.105882 252.687059 0 485.315765h96.858353c0 101.857882 31.924706 196.367059 85.835294 274.672941 0.662588 1.204706 1.084235 2.409412 1.807059 3.373176 5.541647 8.131765 11.866353 15.480471 17.769412 22.889412 2.349176 2.770824 4.336941 5.541647 6.746353 8.613647a542.900706 542.900706 0 0 0 30.479058 33.310118 481.882353 481.882353 0 0 0 109.025883 81.799529l3.19247 1.746824c11.444706 6.204235 23.311059 11.926588 35.177412 17.106823l8.854588 3.915294c10.360471 4.336941 20.841412 8.011294 31.442824 11.625412 4.939294 1.746824 9.999059 3.433412 15.058823 5.059765 9.276235 2.650353 18.672941 5.059765 28.190118 7.168 6.384941 1.505882 12.528941 3.132235 19.034353 4.276706 2.650353 0.662588 5.12 1.505882 7.770353 1.807059 9.035294 1.626353 18.070588 2.409412 27.045647 3.493647 3.252706 0.602353 6.505412 1.204706 9.697882 1.505882a480.978824 480.978824 0 0 0 325.51153-85.353412 58.187294 58.187294 0 0 0 14.45647-80.956235 57.825882 57.825882 0 0 0-81.01647-14.275765m273.167059-301.778823a480.918588 480.918588 0 0 0-85.172706-273.950118c-0.843294-1.325176-1.325176-2.710588-1.987765-3.915294a593.438118 593.438118 0 0 0-21.383529-27.467294 34.334118 34.334118 0 0 1-2.409412-3.312941A484.592941 484.592941 0 0 0 774.144 40.779294c-2.048-0.843294-3.794824-1.746824-5.842824-2.529882a582.475294 582.475294 0 0 0-34.334117-12.589177C730.051765 24.335059 725.835294 22.889412 721.739294 21.684706a486.279529 486.279529 0 0 0-30.418823-7.951059c-5.662118-1.204706-11.444706-2.710588-17.167059-3.855059-2.831059-0.481882-5.421176-1.325176-8.372706-1.927529-7.649882-1.204706-15.179294-1.987765-22.889412-2.891294-5.360941-0.602353-10.480941-1.385412-15.841882-1.987765a501.76 501.76 0 0 0-38.550588-1.987765c-2.288941 0-4.577882-0.301176-6.927059-0.301176-0.421647 0-0.783059 0.060235-1.204706 0.180706A480.316235 480.316235 0 0 0 303.585882 88.365176a58.127059 58.127059 0 1 0 66.861177 95.171765 365.206588 365.206588 0 0 1 246.241882-64.63247c3.312941 0.240941 6.445176 0.722824 9.758118 1.204705 8.734118 1.084235 17.468235 2.228706 26.021647 4.096 3.734588 0.602353 7.529412 1.626353 11.083294 2.409412 8.493176 1.927529 16.745412 3.915294 24.937412 6.384941 2.710588 0.783059 5.180235 1.686588 7.710117 2.650353 9.456941 3.072 18.733176 6.264471 27.708236 10.11953 0.963765 0.240941 1.807059 0.963765 2.770823 1.264941a369.724235 369.724235 0 0 1 139.565177 104.929882 367.073882 367.073882 0 0 1 83.727059 233.35153H852.931765l155.346823 232.688941 154.925177-232.688941H1066.164706z"
          fill="var(--color-accent)" p-id="9502"></path>
      </svg>
    </div>
    <div class="btn_area">
      <image-button class="login_btn" :bg-image="login_btn" @click="login" />
      <image-button class="register_btn" :bg-image="register_btn" @click="register" />
    </div>
  </div>
  <!-- 注册页 -->
  <BaseModal v-model:visible="showRegisterModal" title="创建角色" :mask-closable="true" :hide-footer="true">
    <template #default>
      <register-view @close="closeView" />
    </template>
  </BaseModal>
  <!-- 存档页 -->
  <SaveDataPage @update:selected-id="selectIdChange" title="读取存档" :mask-closable="true" v-model:show="showSaveDataPage" />
</template>

<style lang="less">
.login_view {
  background-color: #e6f8f8;

}

.grid4 {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .image_area {
    flex: 3;
    display: flex;
    flex-direction: column;

    .title {
      flex: 1;
      display: flex;
      align-items: end;
      width: 85%;
      margin: 0 auto;
    }

    .main_person {
      flex: 2.5;
      display: flex;
      align-items: center;
      width: 95%;
      margin: 0 auto;
    }
  }

  .btn_area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .login_btn {
      transition: all 0.4s ease-in-out;
      margin: 1rem auto 1.875rem;
    }

    .register_btn {
      transition: all 0.5s ease-in-out;
    }
  }
}

.grid8 {
  display: flex;
  flex-direction: column;

  .image_area {
    flex: 5;
    display: flex;
    flex-direction: column;

    .title {
      flex: 1;
      display: flex;
      align-items: end;
      width: 25%;
      height: 0;
      margin: 0 auto;
    }

    .main_person {
      flex: 3;
      display: flex;
      align-items: center;
      width: 35%;
      margin: 0 auto;
    }
  }

  .btn_area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .login_btn {
      transition: all 0.5s ease-in-out;
    }

    .register_btn {
      transition: all 0.5s ease-in-out;
    }
  }
}

.current_user {
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .username {
    color: var(--color-main);
    font-size: 1.625rem;
    margin-right: 1.25rem;
  }

  .re_select {
    width: 1.75rem;
    height: 1.75rem;
    cursor: pointer;
    user-select: none;
  }
}

.main_box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .main_content {
    width: 100%;
    padding-left: var(--size-avoid-left);
    padding-right: var(--size-avoid-right);
    height: calc(100vh - var(--size-avoid-top) - var(--size-avoid-bottom));
    overflow: auto;
  }
}

.main_nav {
  width: 100%;
  min-height: var(--size-avoid-top);
  transition: min-height 0.5s;
}

.main_footer {
  width: 100%;
  min-height: var(--size-avoid-bottom);
  transition: min-height 0.5s;
}
</style>