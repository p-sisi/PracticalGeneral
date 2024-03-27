<template>
    <div class="container">
        <!-- 左部菜单 -->
        <el-affix :offset="76">
            <div class="container-menu">
                <div class="menuList"
                    v-for="item in COURSE_MENU"
                    @click="menuChange(item)" 
                    :class="{ 'selectedMenu': item.label === studentStore.activeClassMenu }">{{ item.label }}</div>
            </div>
        </el-affix>


        <!-- 菜单内容 -->
        <div class="container-main">
            <!-- 内容区 -->
            <div class="main-left">
                <router-view></router-view>
            </div>

            <!-- 右侧课程简介 -->
            <div class="main-right">
                <div class="status">
                    <div v-if="studentStore.activeClass.status == 1" class="status-ing">进行中...</div>
                    <div v-else class="status-up">已结束</div>
                </div>
                <div class="title">{{ studentStore.activeClass.className }}</div>
                <div class="time">开课时间：{{ studentStore.activeClass.createTime  }}</div>
                <div class="teacher">
                    <el-avatar> teach </el-avatar>
                    <div>{{ studentStore.activeClass.teacher }}</div>
                </div>
                <div class="student">
                    <span class="iconfont icon-yonghu2"></span>
                    <div>学生<span style="font-weight: 600;">&nbsp;{{ studentStore.activeClass.studentNum }}&nbsp;</span>人</div>
                </div>
                <div class="footer">
                    <div class="code">加课码：<span style="font-weight: 600;">{{ studentStore.activeClass.addCode }}</span></div>
                    <el-button type="danger" @click="exitClass">退出课程</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { COURSE_MENU } from '../../content/student'
import { useStudentStore } from '@/store'
import router from '@/router/index.ts';

const studentStore = useStudentStore();

onMounted(() => {
    //获取公告内容
})

const menuChange = (item: any) => {
    if (studentStore.activeClassMenu === item.label )  return 
    studentStore.setActiveClassMenu(item.label);
    router.push({ name: item.route})
}

//退出课堂
const exitClass = () => {
    
}
</script>

<style scoped lang="scss">
.container {
    &-menu {
        float: left;
        width: 140px;
        height: 80px;
        margin-top: 20px;
        margin-left: 20px;
        color: #fff;
        .menuList {
            height: 40px;
            margin-bottom: 1px;
            text-align: center;
            line-height: 40px;
            background-color: #f4f6fa;
            border-radius: 4px;
            color: black;
            cursor: pointer;
        }
        .selectedMenu {
            background-color: #4186ff;
            border-radius: 4px;
            color: #fff;
        }
    }

    &-main {
        display: flex;
        flex-flow: row nowrap;
        gap: 20px;
        margin: 20px;
        .main-left {
            flex: 1;
            margin-left: 180px;
            margin-bottom: 30px;
        }
        .main-right {
            position: relative;
            width: 16%;
            height: 70vh;
            margin-top: 14px;
            border-radius: 8px;
            box-shadow: 0px 0px 4px rgba(0,0,0,0.2);
            background: linear-gradient(to bottom, #bcd4ff, #fff);
            .status {
                display: flex;
                justify-content: flex-end;
                height: 26px;
                line-height: 26px;
                font-size: 14px;
                .status-ing {
                    padding: 0px 8px;
                    background-color: #ecf8e5;
                    color: #67c23a;
                }
                .status-up {
                    padding: 0px 8px;
                    background-color: #ccc;
                    color: #f7f7f7;
                }
            }
            .title {
                margin: 14px 14px 0px 14px;
                font-size: 28px;
                font-weight: 600;
            }
            .time {
                margin: 0px 14px;
                font-size: 12px;
            }
            .teacher {
                margin: 14px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .student {
                margin: 14px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 4px;
                font-size: 12px;
            }
            .footer {
                position: absolute;
                margin: 12px 14px;
                bottom: 4px;
                display: flex;
                align-items: center;
                gap: 20px;
                .code {
                    font-size: 14px;
                }
            }
        }
    }
}

</style>