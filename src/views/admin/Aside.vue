<template>
    <div class="aside">
        <el-menu
            default-active="class"
            class="el-menu-vertical-demo"
            router="true"
            @open="handleOpen"
            @close="handleClose"
      >
            <el-menu-item index="class">
                <span class="iconfont icon-wodekecheng"></span>
                <span>课程管理</span>
            </el-menu-item>

            <el-sub-menu index="user">
                <template #title>
                    <span class="iconfont icon-yonghu2"></span>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="user-teacher" @click="handleClickSubMenu">教师</el-menu-item>
                <el-menu-item index="user-student" @click="handleClickSubMenu">学生</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="notice">
                <span class="iconfont icon-gonggao"></span>
                <span>公告管理</span>
            </el-menu-item>
            
            <el-menu-item index="log">
                <span class="iconfont icon-rizhi"></span>
                <span>操作日志管理</span>
            </el-menu-item>
      </el-menu>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleClickSubMenu = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style scoped lang="scss">
:root {
    --bg-color: #ccc;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    min-height: 92.5vh;
}
.iconfont {
    margin-right: 10px;
}
</style>