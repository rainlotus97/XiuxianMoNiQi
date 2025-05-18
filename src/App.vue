<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { MediaCheckHelper, type MediaHelperType, type MediaHelperCallback } from './utils/mediaHelper';
import { useBasicStore } from './stores/basicStore';
import { DocumentViewChange } from './utils/viewChangeUtils';
import TabBar from './components/base/TabBar.vue';
import { ref } from 'vue';
import router from './router/router';
import ImageButton from './components/base/ImageButton.vue';
const basicStore = useBasicStore();
const medialHelperCallback: MediaHelperCallback = (data: MediaHelperType) => {
  basicStore.updateMediaHelperType(data);
  console.log('MediaCheckHelper callback:', data);
};
let isLogin = ref(false);

onMounted(() => {
  // 初始化 MediaCheckHelper
  MediaCheckHelper.init(medialHelperCallback);
  // 设置初始的 mediaHelperType
  const mediaHelperType = MediaCheckHelper.getMediaHelperType();
  // 更新 store 中的 mediaHelperType
  basicStore.updateMediaHelperType(mediaHelperType);
  viewChange(mediaHelperType);
});

// Listen for media query changes
watch(
  () => basicStore.mediaHelperType,
  (newValue: MediaHelperType) => {
    console.log('Media query changed:', newValue);
    viewChange(newValue);
  }
);

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

const login = () => {
  isLogin.value = true;
  router.replace('/cultivation')
}
const register = () => {
  console.log('暂未开放!');

}
</script>

<template>
  <div class="main_box" v-if="isLogin">
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
    <div class="btn_area">
      <image-button class="login_btn" bg-image="/src/assets/images/login.png" @click="login" />
      <image-button class="register_btn" bg-image="/src/assets/images/register.png" @click="register" />
    </div>
  </div>
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