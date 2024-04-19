<template>
    <div class="container">
        <el-affix>
            <!-- 头部蓝色样式条 -->
            <div class="header">
                <Header></Header>
            </div>
        </el-affix>

        <div class="body">
            <!-- 左边菜单栏 -->
            <div class="aside">
                <Aside></Aside>
            </div>
            <!-- 右侧内容区 -->
            <el-scrollbar max-height="1000px">
                <div class="main">
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

</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    .body {
        display: flex;
        flex-flow: row nowrap;
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
.el-scrollbar {
    width: 100%;
    height: 100%;
}
</style>