<template>
    <div class="container">
        <div class="container-header">
            <div class="title">实训教学过程</div>
            <div class="introduce">解锁创新教学，畅享实训之旅！为您提供全方位的教学支持和管理工具。轻松规划、组织和追踪实训课程，让学生获得实践技能，激发潜能。</div>
            <div class="introduce">全面管理学生、教师和资源，提供实时监控和评估，助力优化教学效果。打破传统教学束缚，开启互动协作新时代！</div>
            <el-input 
                v-show="commonStore.userType == '学生'"
                class="input" 
                v-model="addClassNumber" 
                style="width: 300px" 
                placeholder="请输入加课码" 
                maxlength="6">
                <template #append>
                    <el-button :icon="Right" @click="handleAddCourse">立即加入</el-button>
                </template>
            </el-input>
        </div>

        <el-affix :offset="120">
            <div class="container-tab">
                <div class="tabList"
                    v-for="value in ['我的课程','公告栏']"
                    @click="tabChange(value)" 
                    :class="{ 'selectedTab': value === studentStore.activeHomeTab }">{{ value }}</div>
            </div>
        </el-affix>

        <div class="container-body">
            <!-- 课程列表 -->
            <div class="class-list" v-show="studentStore.activeHomeTab == '我的课程'">
                <div style="display: flex;justify-content: space-between;">
                    <div class="title">
                        <div> 课程状态</div>
                        <div class="tabs-change">
                            <div 
                                v-for="item in CLASS_STATUS" 
                                :key="item.value"  
                                @click="classStatusChange(item.label)" 
                                class="tabs-temp" 
                                :class="{ 'selected': item.label === activeClassStatus }">{{item.label}}</div>
                        </div>
                    </div>
                    <div class="search">
                        <el-input 
                        v-model="searchClassValue" 
                        style="width: 240px" 
                        placeholder="搜索课程名称、授课老师" 
                        :suffix-icon="Search"
                        @blur="handleSearch"
                        @keydown.enter="handleSearch"/>
                    </div>
                </div>

                <!-- 课程列表 -->
                <div class="list">
                    <div 
                        v-if="courseData.length !== 0"
                        class="list-item"
                        v-for="item in courseData"
                        :key="item.courseId"
                        @click="handleClickClass(item)"
                        >
                        <div class="name">{{ item.courseName }}</div>
                        <el-image style="width: 100%; height: 180px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fit" />
                        <div class="user">

                            <!-- 学生端不展示课号及创建时间 -->
                            <div v-show="commonStore.userType == '教师'">
                                <span style="font-size: 12px;">课号：{{ item.courseNumber }}</span>
                            </div>

                            <span v-if="item.isOver == false" style="color:#529949">进行中...</span>
                            <span v-else style="color: #ccc;">已结束</span>

                            <!-- 教师端不展示教师头像及姓名 -->
                            <div v-show="commonStore.userType == '学生'" class="user-detail" >
                                <el-avatar size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                                <span>{{ item.teacherName }}</span>
                            </div>

                        </div>
                    </div>
                    <div v-else class="list-empty">
                        <img src="/src/assets/images/no-message.png" alt="">
                        <span>暂无课程</span>
                    </div>
                </div>
            </div>

            <!-- 公告 -->
            <div class="notice" v-show="studentStore.activeHomeTab == '公告栏'">
                <!-- 公告类型 -->
                <div class="notice-type">
                    <div class="type-container">
                        <div 
                            class="type" 
                            v-for="item in ['系统公告','课程公告']" 
                            :class="{ 'selected': item === activeNoticeType }" 
                            @click="noticeTypeChange(item)">
                            {{ item }}
                        </div>
                    </div>
                    
                    <div class="btn">
                        <el-popconfirm title="确定将所有公告标为已读？" @confirm="handleAllRead">
                            <template #reference>
                                <div class="read">全部标为已读</div>
                            </template>
                        </el-popconfirm>
                        <div class="refresh" @click="handleRefresh">
                            <el-icon :class="{ 'is-loading' : isRefreshLoading }" style="display: block;margin-top: 4px;margin-right: 4px;">
                                <Loading />
                            </el-icon>
                            <div >刷新</div>
                        </div>
                    </div>
                </div>
                <!-- 公告列表 -->
                <div class="notice-item">
                    <div 
                        class="item"
                        v-for="item in courseNoticeData"
                        :class="{ 'read': item.isRead , 'unread': item.isRead }"
                        @click="noticeItemClick(item)"
                        >
                        <div class="item-title">
                            <div>{{ item.title }}</div>
                            <span style="color:#ccc;font-size: 14px;" v-if="item.isRead">已读</span>
                            <span style="color: #4186ff;cursor: pointer;font-size: 14px;" v-else @click.stop="handleRead(item)">标为已读</span>
                        </div>
                        <div class="item-content">{{item.content}}</div>
                        <div class="item-footer">
                            <div>来源：{{ item.noticeType == 0 ? '系统' : item.courseName }}</div>
                            <div>发布：{{ item.createTime }}</div>
                            <div>最近一次更新：{{item.updateTime}}</div>
                            <div>发布者：{{ item.creatorName }}</div>
                        </div>
                    </div>
                    <div class="refresh-mask" v-if="isRefreshing"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { Right, Search, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { CLASS_STATUS } from '../../content/student'
import { Course } from '../../content/course';
import { Notice } from '../../content/notice';
import { useStudentStore, useCommonStore } from '@/store'
import router from '@/router/index.ts';
import { fetchGetAllCourseNotice, fetchGetAllSysNotice, fetchReadNotice } from '../../apis/modules/notice';
import { fetchGetAllCourseStudent, fetchGetAllCourseTeacher, fetchAddCourse } from '../../apis/modules/course';

const studentStore = useStudentStore();
const commonStore = useCommonStore();

onMounted(() => {
    getNoticeListRequest('系统公告');
    getClassListRequest();
})

const isRefreshing = ref(false);   //刷新遮罩层

const tabChange = (label: any) => {
    if (studentStore.activeHomeTab === label )  return 
    studentStore.setActiveHomeTab(label);
}

//加入课程
const addClassNumber = ref('');
const handleAddCourse = async () => {
    try {
        const params = {
            addCode: addClassNumber.value
        }
        await fetchAddCourse(params);
        ElMessage.success('加入课程成功！');

        getClassListRequest();
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

//获取课程
const courseData: Ref<Course[]> = ref([]);  //处理后的课程列表
const courseDataAll: Ref<Course[]> = ref([]);  //所有课程列表
const getClassListRequest = async () => {
    try {
        let result: any;
        if(commonStore.userType == '教师') {
            result = await fetchGetAllCourseTeacher();
        }else {
            result = await fetchGetAllCourseStudent();
        }
        console.log(result.data)
        courseData.value = result.data;
        courseDataAll.value = result.data;

        //保存课程数据
        commonStore.setCourseData(result.data)
    } catch (error) {
        ElMessage.error('获取课程失败，请稍候再试！')
    }
}

//点击课程item
const handleClickClass = (item:any) => {
    commonStore.setActiveClass(item);

    if(!commonStore.headerMenu.includes(item.courseName)) {
        commonStore.addHeaderMenu(item.courseName);
    }
        
    commonStore.setActiveHeaderMenu(item.courseName);

    if(commonStore.userType == '教师') {
        router.push({ name: 'teacher_resource',query: { id: item.courseId }})
    }else {
        router.push({ name: 'student_resource',query: { id: item.courseId }})
    }
}

//切换课程状态
const activeClassStatus = ref('全部');
const classStatusChange = (label: any) => {
    if (activeClassStatus.value === label )  return 

    activeClassStatus.value = label;

    courseData.value = courseDataAll.value;
    
    if(label == '全部') {
        courseData.value = courseDataAll.value;
    } else if(label == '进行中') {
        courseData.value = courseData.value.filter((item:any) => item.isOver == false);
    } else {
        courseData.value = courseData.value.filter((item:any) => item.isOver == true);
    };

    if(searchClassValue.value !== '') {
        handleSearch();
    }
}

const searchClassValue = ref('');

/*
*   获取公告列表
*   type: 公告类型
*   isRefresh: 是否刷新
*/
const courseNoticeData: Ref<Notice[]> = ref([]);   //公告列表

const getNoticeListRequest = async(type: string) => {
    try {
        isRefreshing.value = true;
        let result = null;
        if(type == '系统公告') {
            result = await fetchGetAllSysNotice();
        }else {
            result = await fetchGetAllCourseNotice();
        }
        courseNoticeData.value = result.data;
        isRefreshLoading.value = false;
        isRefreshing.value = false;
    } catch (error) {
        console.log('获取公告失败', error);
    }
}

// 切换公告类型
const activeNoticeType = ref('系统公告') 
const noticeTypeChange = (label: any) => {
    if (activeNoticeType.value === label )  return 
    activeNoticeType.value = label;

    getNoticeListRequest(activeNoticeType.value);
}

const noticeItemClick = (item: any) => {
    //TODO:如果公告类型不为系统公告，则根据课程id跳转至所有课程详情页
    if(item.noticeType == 'system') return
    //TODO:根据id跳转
    console.log(item)
}

//已读公告
const setReadNoticeRequest = async (ids: any[]) => {
    try {
        const params = {
            ids
        }
        await fetchReadNotice(params);
        getNoticeListRequest(activeNoticeType.value);
    } catch (error) {
        ElMessage.error('修改失败，请稍候再试！');
    }
}

const handleRead = async (item: any) => {
    const idArray = [item.noticeId];
    setReadNoticeRequest(idArray);
}

const handleAllRead = () => {
    const idArray: any[] = courseNoticeData.value.filter( (item: any) => item.isRead == false ).map( (item: any) => item.noticeId );
    setReadNoticeRequest(idArray)
}

//刷新公告
const isRefreshLoading = ref(false);
const handleRefresh = () => {
    if(isRefreshLoading.value == true) return

    isRefreshLoading.value = true;
    getNoticeListRequest(activeNoticeType.value);
} 

//搜索
const handleSearch = () => {
    if(searchClassValue.value == '') {
        return courseData.value = courseDataAll.value;
    }
    classStatusChange(activeClassStatus.value);
    courseData.value = courseData.value.filter((item:any) => {
        return (
            item.courseName.includes(searchClassValue.value) || 
            item.teacherName?.includes(searchClassValue.value)  
        )
    });
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 200vh;
    &-header {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        padding: 16px 0px;
        background-image: url('../../assets/images/student-home.jpg');
        background-size: 100% 100%;
        .title {
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 6px;
        }
        .introduce {
            font-size: 12px;
        }
        .input {
            margin-top: 20px;
            ::v-deep .el-input__wrapper {
                font-size: 12px;
            }
            ::v-deep .el-input-group__append {
                background-color: #4186ff;
                color: #fff;
            }
        }
    }

    &-tab {
        float: left;
        width: 140px;
        height: 100px;
        margin-top: 20px;
        margin-left: 20px;
        color: #fff;
        .tabList {
            height: 50px;
            margin-bottom: 1px;
            text-align: center;
            line-height: 50px;
            background-color: #f4f6fa;
            border-radius: 4px;
            color: black;
            cursor: pointer;
        }
        .selectedTab {
            background-color: #4186ff;
            border-radius: 4px;
            color: #fff;
        }
    }

    &-body {
        padding: 20px 40px;
        margin-left: 180px;

        .class-list {
            .title {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
                .tabs-change {
                    display: flex;  
                    flex-direction: row;
                    .tabs-temp {   
                        height: 32px;
                        padding: 2px 16px;
                        margin-right: 8px;
                        border-radius: 4px;
                        background: #f4f6fa;
                        font-size: 14px;
                        line-height: 32px;
                        cursor: pointer;
                    }
                    .tabs-temp.selected {     
                        background: #e9f2ff;
                        color: #1472FF;
                    }
                }
            }
            .list {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                gap: 40px;
                padding: 20px 30px;
                &-item {
                    min-width: 260px;
                    min-height: 260px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px #ccc;
                    transition: all .3s;
                    .name {
                        width: 100%;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        font-weight: 600;
                    }
                    .user {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 10px;
                        font-size: 15px;
                        margin: 0px 16px;
                        &-detail {
                            display: flex;
                            justify-content: baseline;
                            gap: 10px;
                        }
                    }
                }
                &-item:hover {
                    box-shadow: 0px 0px 10px #5a8bd6;
                }
                &-empty {
                    width: 100%;
                    margin-top: 40px;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    img {
                        width: 100px;
                    }
                    span {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }
        
        // 公告
        .notice {
            &-type {
                width: 84%;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                gap: 20px;
                .type-container {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    gap: 20px;
                    .type {
                        width: 80px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        cursor: pointer;
                    }
                }
                .btn {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    font-size: 14px;
                    margin-top: 10px;
                    cursor: pointer;
                    .read {
                        color: #1472FF;
                    }
                    .refresh {
                        display: flex;
                    }
                }
                .selected {
                    border-bottom: 2px solid #1472FF;
                    color: #1472FF;
                    font-weight: 600;
                }
            }
            &-item {
                position: relative;
                width: 80%;
                margin: 18px;
                .item {
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0px 0px 10px #ebeaeac9;
                    &-title {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        div {
                            font-weight: 600;
                            font-size: 20px;
                        }
                    }
                    &-content {
                        font-size: 14px;
                    }
                    &-footer {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        margin-top: 8px;
                        font-size: 13px;
                        color: #908d8d;
                    }
                }
                .read {
                    color: #c1c1c1;
                    .item-footer {
                        color: #c1c1c1;
                    }
                }
                // 遮罩层效果
                .refresh-mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    padding-top: 30px;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8); /* 使用半透明的白色作为背景 */
                    z-index: 9999; /* 确保遮罩在最上层 */
                    display: flex;
                    justify-content: center;
                    }

                    .refresh-mask::before {
                        content: "";
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        border: 4px solid #ccc;
                        border-top-color: #333;
                        border-radius: 50%;
                        animation: spin 1s linear infinite; /* 添加旋转动画效果 */
                    }

                    @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                    }
            }
        }
    }
}
</style>