<template>
    <div class="container">
        <!-- 左部菜单 -->
        <el-affix :offset="76">
            <!-- 学生端 -->
            <div class="container-menu" v-if="commonStore.userType == '学生'">
                <div class="menuList"
                    v-for="item in COURSE_MENU_STU"
                    @click="menuChange(item)" 
                    :class="{ 'selectedMenu': item.label === studentStore.activeClassMenu }">{{ item.label }}</div>
            </div>
            <!-- 教师端 -->
            <div class="container-menu" v-else>
                <div class="menuList"
                    v-for="item in COURSE_MENU_TCH"
                    @click="menuChange(item)" 
                    :class="{ 'selectedMenu': item.label === teacherStore.activeLeftMenu }">{{ item.label }}</div>
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
                    <div v-if="!commonStore.activeClass.isOver" class="status-ing">进行中...</div>
                    <div v-else class="status-up">已结束</div>
                </div>
                <div class="title">{{ commonStore.activeClass.courseName }}</div>
                <div class="time">课号：{{ commonStore.activeClass.courseNumber }}</div>
                <div class="time">开课时间：{{ (commonStore.activeClass.createTime).split(' ')[0]  }}</div>

                <!-- 教师端不展示教师名称及头像 -->
                <div class="teacher" v-show="commonStore.userType == '学生'">
                    <el-avatar> teach </el-avatar>
                    <div>{{ commonStore.activeClass.teacherName }}</div>
                </div>

                <div class="student">
                    <span class="iconfont icon-yonghu2"></span>
                    <div>学生<span style="font-weight: 600;">&nbsp;{{ commonStore.activeClass.stuNum }}&nbsp;</span>人</div>
                </div>
                <div class="footer">
                    <div class="code">加课码：<span style="font-weight: 600;">{{ commonStore.activeClass.addCode }}</span></div>
                    <el-button type="danger" @click="dialogVisible = true">退出课程</el-button>
                </div>
            </div>
        </div>

        <!-- 退出课堂弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            title="提示"
            width="400"
        >
            <span>你确定要退出课程<span style="font-size: 17px;color: #4186ff;margin:0px 8px;">{{ commonStore.activeClass.courseName }}</span>?</span>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="exitClass" color="#4186ff">退出</el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { COURSE_MENU_STU, COURSE_MENU_TCH } from '../../content/common'
import { useStudentStore, useCommonStore, useTeacherStore } from '@/store'
import router from '@/router/index.ts';
import { fetchExitCourseByStudent } from '../../apis/modules/course';
import { ElMessage } from 'element-plus';

const studentStore = useStudentStore();
const commonStore = useCommonStore();
const teacherStore = useTeacherStore();

//切换左侧菜单
const menuChange = (item: any) => {
    if(commonStore.userType == '学生') {
        if (studentStore.activeClassMenu === item.label )  return 
        studentStore.setActiveClassMenu(item.label);
    }else {
        if (teacherStore.activeLeftMenu === item.label )  return 
        teacherStore.setActiveLeftMenu(item.label);
    }
   
    router.push({ name: item.routeName})
}

//退出课堂
const dialogVisible = ref(false);
const exitClass = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
        }
        await fetchExitCourseByStudent(params);
        ElMessage.success('退出课堂成功');
        
        if(commonStore.userType == '学生'){
            router.push({name: 'student_home'});
        }else {
            router.push({name: 'teacher_index'});
        }
        
    } catch (error) {
        ElMessage.error('退出课堂失败');
    }
}
</script>

<style scoped lang="scss">
.container {
    &-menu {
        float: left;
        width: 140px;
        height: 80px;
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