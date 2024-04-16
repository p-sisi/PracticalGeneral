<template>
    <div class="title">学生成绩分析</div>

    <!-- 分析列表 -->
    <div class="list">
        <el-table :data="listData" height="400" style="width: 100%">
            <el-table-column prop="account" label="账号" width="160" align="center"/>
            <el-table-column prop="name" label="作业得分" width="160" align="center"/>
            <el-table-column prop="name" label="讨论得分" width="160" align="center"/>
            <el-table-column prop="email" label="考勤得分" align="center"/>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchAllCourseStudent } from '../../apis/modules/course';
import { useCommonStore } from '../../store';

onMounted(() => {
    getListDataRequest()
})

const commonStore = useCommonStore();

const listData = ref();

/**
 *  获取课程的所有学生成绩
 */
const getListDataRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchAllCourseStudent(params)
        listData.value = result.data
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

</script>

<style scoped lang="scss">
.title {
    font-weight: 600;
}

.list {
    width: 90%;
    display: flex;
    justify-content: center;
    margin-left: 20px;
    margin-top: 20px;
    padding: 10px;
    background-color: #f8fbff;
    border-radius: 8px;
}
</style>