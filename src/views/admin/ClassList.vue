<template>
    <!-- 展示课程列表 -->
    <div class="container" v-if="adminStore.isShowCourseList">
        <!-- 搜索区 -->
        <div class="container-search">
            <div class="search-title">
                <div class="time">
                    <span>创建课程时间</span>
                    <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        size="default"
                    />
                </div>
                <div class="status">
                    <span>课程状态</span>
                    <el-select v-model="classStatus" placeholder="课程当前状态" clearable style="width: 160px">
                        <el-option label="进行中" value="进行中" />
                        <el-option label="已结束" value="已结束" />
                    </el-select>
                </div>
                <div class="uploader">
                    <span>任课教师</span>
                    <el-input v-model="inputUploader" style="width: 180px" placeholder="请输入任课教师" />
                </div>
            </div>
            <div class="search-button">
                <el-button type="primary" @click="handleSearch" color="#4186ff">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
        </div>

        <!-- 课程列表区 -->
        <div class="container-table">
            <div class="container-table-title">
                <div class="text">课程列表</div>
                <div class="new" @click="handleNewCourse()">
                    <div>+&nbsp;添加课程</div>
                </div>
            </div>

            <!-- 课程列表表格 -->
            <el-table :data="tableList" height="450" stripe>
                <el-table-column fixed prop="courseNumber" label="课号" width="100px" />
                <el-table-column prop="courseName" label="名称" width="160" />
                <el-table-column prop="teacherName" label="任教老师" width="110" />
                <el-table-column prop="isOver" label="状态" width="100">
                    <template #default="scope">
                        <span v-if="scope.row.isOver == true" class="isOver">已结束</span>
                        <span v-else class="isDoing">进行中</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stuNum" label="学生人数" width="100" />
                <el-table-column prop="createTime" label="创建时间" width="240" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <!-- 展示新建、编辑课程 -->
    <div v-else>
        <ClassEdit></ClassEdit>
    </div>
</template>

<script setup lang="ts">
import ClassEdit from './ClassEdit.vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/store'
import { ref, onMounted, Ref } from 'vue'
import { Course } from '../../content/course'
import { fetchGetAllCourseAdmin } from '../../apis/modules/course'

onMounted(() => {
    getAllCourseList();
})

const adminStore = useAdminStore();

const tableList: Ref<Course[]> = ref([]);   //表格数据
const tableListAll: Ref<Course[]> = ref([]);   //暂存表格数据

/**
 *  获取全部课程列表请求
 */
const getAllCourseList = async () => {
    try {
        const result = await fetchGetAllCourseAdmin();
        tableList.value = result.data;
        tableListAll.value = result.data;
    } catch (error) {
        ElMessage.error('获取课程列表失败')
    }
}

/**
 *  搜索列表数据
 */
const dateValue = ref();
const classStatus = ref();
const inputUploader = ref('');
const handleSearch = () => {
    const filteredList = tableListAll.value.filter((course: any) => {
        // 判断时间范围是否符合搜索条件
        const createTime = new Date(course.createTime).getTime();
        const startDate = dateValue.value ? new Date(dateValue.value[0]).getTime() : 0;
        const endDate = dateValue.value ? new Date(dateValue.value[1]).getTime() : Number.MAX_SAFE_INTEGER;
        const timeInRange = createTime >= startDate && createTime <= endDate;

        // 判断课程状态是否符合搜索条件
        const statusMatched = classStatus.value ? course.isOver === (classStatus.value === '已结束') : true;

        // 判断任课教师是否符合搜索条件
        const teacherMatched = inputUploader.value ? course.teacherName.includes(inputUploader.value) : true;

        // 返回符合所有条件的课程数据
        return timeInRange && statusMatched && teacherMatched;
    });

    // 更新表格数据显示筛选后的课程列表
    tableList.value = filteredList;
}
const handleReset = () => {
    dateValue.value = '';
    classStatus.value = '';
    inputUploader.value = '';
    getAllCourseList();
    ElMessage.success('重置成功')
}

//点击新建课程
const handleNewCourse = () => {
    adminStore.setIsShowCourseList(false);
    adminStore.setIsEdit(false);
}

//表格操作
const handleEdit = (index: number, row: any) => {
    adminStore.setIsShowCourseList(false);
    //保存当前点击的课程item信息
    adminStore.setActiveCourseItem(row);
    adminStore.setIsEdit(true)
}

const handleDelete = (index: number, row: any) => {
    //TODO:执行删除课程请求操作，出现确认弹窗
  console.log(index, row)
}
</script>

<style scoped lang="scss">
$primary-color: #4186ff;
.container {
    &-search {
        width: 100%;
        height: auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-sizing: border-box;
        .search-title {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            gap: 30px;
           
            span {
                font-size: 14px;
                margin-right: 10px;
            }
        }
        .search-button {
            margin-top: 16px;
        }
    }

    &-table {
        width: 100%;
        margin-top: 20px;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-sizing: border-box;
        &-title {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            margin-bottom: 12px;
            .text {
                font-weight: 600;
            }
            .new {
                display: flex;
                flex-flow: row nowrap;
                color: $primary-color;
                font-size: 14px;
                cursor: pointer;
            }
        }
        .isDoing {
            padding: 4px 8px;
            color: #67c23a;
            background-color: #f0f9eb;
        }
        .isOver {
            padding: 4px 8px;
            color: #909399;
            background-color: #f4f4f5;
        }
    }
}
</style>