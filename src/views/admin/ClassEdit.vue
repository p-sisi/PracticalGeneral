<template>
    <!-- 返回 -->
    <div class="back" @click="clickBack()">< 返回课程列表</div>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/store'

const adminStore = useAdminStore();

//点击返回
const clickBack = () => {
    adminStore.setIsShowCourseList(true);
}
</script>

<style scoped lang="scss">
// 返回按钮
.back {
    font-size: 14px;
    cursor: pointer;
}
.back:hover {
    color: #4186ff;
}
</style>