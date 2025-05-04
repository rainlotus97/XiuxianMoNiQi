<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { MediaCheckHelper, type MediaHelperType, type MediaHelperCallback } from './utils/mediaHelper';
import { useBasicStore } from './stores/basicStore';
import { DocumentViewChange } from './utils/viewChangeUtils';
import TabBar from './components/base/TabBar.vue';

const basicStore = useBasicStore();
const medialHelperCallback: MediaHelperCallback = (data: MediaHelperType) => {
  basicStore.updateMediaHelperType(data);
  console.log('MediaCheckHelper callback:', data);
};


onMounted(() => {
  // 初始化 MediaCheckHelper
  MediaCheckHelper.init(medialHelperCallback);
  // 设置初始的 mediaHelperType
  const mediaHelperType = MediaCheckHelper.getMediaHelperType();
  // 更新 store 中的 mediaHelperType
  basicStore.updateMediaHelperType(mediaHelperType);
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

</script>

<template>
  <div class="main_box">
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
</template>

<style scoped lang="less">
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
./stores/commonStore./utils/documentViewChange./utils/mediaCheckHelper./stores/basicStore./utils/viewChangeUtils./utils/mediaHelper