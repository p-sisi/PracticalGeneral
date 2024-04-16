<template>
    <div>全部学生（共{{ listData?.length }}人）</div>

    <!-- 学生列表 -->
    <div class="list">
        <el-table :data="listData" height="550" style="width: 80%">
            <el-table-column type="index" width="60" />
            <el-table-column prop="name" label="名字" width="160" />
            <el-table-column prop="account" label="账号" width="160" />
            <el-table-column prop="email" label="邮箱绑定" />
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
 *  获取课程的所有学生
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
.list {
    display: flex;
    justify-content: center;
    width: 90%;
    margin-left: 20px;
    margin-top: 20px;
}
</style>