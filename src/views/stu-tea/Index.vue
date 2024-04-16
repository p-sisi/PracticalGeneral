<template>
    <div class="container">
        <el-affix>
            <div class="header">
                <div style="display: flex;gap: 40px;">
                    <!-- 左边 -->
                    <div class="header-left">
                        <span class="iconfont icon-shuben-book3"></span>
                        <div v-show="commonStore.userType == '学生'">实训管理系统（学生端）</div>
                        <div v-show="commonStore.userType == '教师'">实训管理系统（教师端）</div>
                    </div>

                    <!-- 中间菜单头 -->
                    <div class="tabs-change">
                        <div 
                            v-for="item in commonStore.headerMenu"   
                            @click="radioChange(item)" 
                            class="tabs-temp" 
                            :class="{ 'selected': item === commonStore.activeHeaderMenu }"
                        >
                            <el-tooltip :content="item" placement="bottom" effect="light">
                                <span>{{ item }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                </div>


                <!-- 右边 -->
                <div class="header-right">
                    <div style="cursor: pointer;" @click="handleClickNotice">
                        <span class="iconfont icon-xiaoxi"></span>
                        <span style="margin-left: 2px;">公告</span>
                    </div>
                    <div class="header-right-add" v-show="commonStore.userType == '学生'" @click="dialogVisible = true">
                        <el-icon><CirclePlus /></el-icon>
                        <div>加入课程</div>
                    </div>
                    <div class="header-right-user">
                        <el-avatar :icon="UserFilled" size="small" :src="`${BASE_ERL}/file/images/${commonStore.userInfo.headImg}`"> </el-avatar>
                        <div v-if="commonStore.userType == '学生'">学生：{{ commonStore.userInfo.name }}</div>
                        <div v-else>教师：{{ commonStore.userInfo.name }}</div>
                        <el-dropdown>
                            <div style="color: #fff;">
                                <el-icon><arrow-down /></el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleClickMyClass">我的课程</el-dropdown-item>
                                    <el-dropdown-item @click="handleChangePassword">修改密码</el-dropdown-item>
                                    <el-dropdown-item divided @click="handleLoginOut">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="header-right-divide"></div>
                    <el-popconfirm title="确定要退出登录吗？" @confirm="handleLoginOut">
                        <template #reference>
                            <span class="iconfont icon-tuichu" style="cursor: pointer;"></span>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </el-affix>

        <div class="body">
            <!-- 学生端、教师端子路由出口 -->
            <router-view></router-view>
        </div>

        <!-- 加入课程弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            title="加入课程"
            width="500"
            draggable
        >
        <div>
            <span>课堂加课码：</span>
            <el-input v-model="inputCode" style="width: 300px" placeholder="请输入课程加课码" clearable maxlength="6"/>
        </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleAddCourse" color="#4186ff"> 加入</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CirclePlus, UserFilled, ArrowDown, Close } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useStudentStore, useCommonStore, useTeacherStore } from '@/store'
import { fetchAddCourse } from '../../apis/modules/course';
import router from '../../router';
import { useRouter } from 'vue-router';
import { BASE_ERL } from '../../content/common';

const route = useRouter();

const studentStore = useStudentStore();
const commonStore = useCommonStore();
const teacherStore = useTeacherStore();

const dialogVisible = ref(false);
const inputCode = ref('');

// 加入课程
const handleAddCourse = async () => {
    try {
        const params = {
            addCode: inputCode.value
        }
        const result = await fetchAddCourse(params);
        const newClass = result.data

        ElMessage.success('加入课程成功！');
        dialogVisible.value = false;
        inputCode.value = '';

        commonStore.setActiveHeaderMenu(newClass.courseName);
        commonStore.addHeaderMenu(newClass.courseName);
        commonStore.setActiveClass(newClass);
        commonStore.setCourseData([...commonStore.courseData, newClass]);
        
        if(commonStore.userType == '学生'){
            router.push({ name: 'student__notice',query: { id: newClass.courseId }})
        } else {
            router.push({ name: 'teacher_notice',query: { id: newClass.courseId }})
        }

    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

// 头部菜单切换
const radioChange = (item:any) => {
    if (commonStore.activeHeaderMenu === item )  return 
    if (item == '首页') {
        if(commonStore.userType == '学生'){
            router.push({name: 'student_home'});
        }else {
            router.push({name: 'teacher_index'});
        }
    }else {
        commonStore.setActiveClass( commonStore.courseData.filter( (value:any) => value.courseName == item)[0] )
        console.log(commonStore.activeClass)
        if(commonStore.userType == '学生') {
            router.push({ name: 'student_notice',query: { id: commonStore.activeClass.courseId }})
        } else {
            router.push({ name: 'teacher_notice',query: { id: commonStore.activeClass.courseId }})
        }
    }
    commonStore.setActiveHeaderMenu(item);

    //左侧菜单切换至“课程公告”
    studentStore.setActiveClassMenu('课程公告');
    teacherStore.setActiveLeftMenu('课程公告')
}

//点击公告
const handleClickNotice = () => {
    if(route.currentRoute.value.query.id) {
        router.push({name: 'student_notice'})
    } else {
        studentStore.setActiveHomeTab('公告栏')
    }
}

//点击我的课程
const handleClickMyClass = () => {
    router.push({name: 'student_home'})
    studentStore.setActiveHomeTab('我的课程');

    commonStore.setActiveHeaderMenu('首页')
}

//修改密码
const handleChangePassword = () => {
    //TODO:修改密码请求
}

//退出登录
const handleLoginOut = () => {
    router.push('/login');
    //清空store中数据
    commonStore.initStore();
    //清除localStorage中的token
    localStorage.removeItem('Token');
}
</script>

<style lang="scss" scoped>
// 头部菜单样式
.tabs-change {
    display: flex;   
    flex-flow: row nowrap;
    gap: 20px;
    align-items: center;
    color: #fff;
    .tabs-temp {   
        max-width: 70px;
        height: 30px;
        padding: 4px 0px;
        font-size: 12px;
        line-height: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .tabs-temp.selected {  
        border-bottom: 2px solid #fff;
        border-radius: 2px;
        font-size: 16px;
    }
}


.container {
    width: 100%;
    height: 100vh;
    .header {
        height: 50px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        background-color: #4186ff;
        &-left {
            height: 100%;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 14px;
            margin-left: 16px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            span {
                font-size: 22px;
            }
            .el-icon {
                margin-left: 40px;
                cursor: pointer;
            }
        }
        &-right {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 14px;
            margin-right: 16px;
            color: #fff;
            font-size: 14px;
            &-add, &-user{
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                gap: 2px;
                cursor: pointer;
            }
            &-divide {
                width: 1px;
                height: 14px;
                background-color: #ccc;
            }
        }
    }
}
</style>