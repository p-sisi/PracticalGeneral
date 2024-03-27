<template>
    <div class="container">
        <el-affix>
            <div class="header">
                <Header></Header>
            </div>
        </el-affix>

        <div class="body">
            <div class="aside">
                <Aside></Aside>
            </div>
            <el-scrollbar max-height="700px">
                <div class="main">
                    <div class="main-header">
                        <!-- FIXME:面包屑未处理 -->
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/' }">课程管理</el-breadcrumb-item>
                            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <!-- 管理台左边菜单子路由出口 -->
                    <router-view></router-view>
                </div>
            </el-scrollbar>
           
        </div>
        
    </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Aside from './Aside.vue'
import { ref } from 'vue'

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    .body {
        display: flex;
        flex-flow: row nowrap;
        min-height: 80vh;
        .aside {
            width: 180px;
        }
        .main {
            flex: 1;
            padding: 16px;
            background-color: #f5f9fa;
            .main-header {
                margin-bottom: 16px;
            }
        }
    }
}
</style>