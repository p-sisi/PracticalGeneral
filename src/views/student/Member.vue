<template>
    <div>全部学生（共{{ listData?.length }}人）</div>

    <!-- 学生列表 -->
    <div class="list">
        <el-table :data="listData" height="400" style="width: 100%">
            <el-table-column type="index" width="60" align="center"/>
            <el-table-column prop="name" label="名字" width="160" align="center"/>
            <el-table-column prop="account" label="账号" width="160" align="center"/>
            <el-table-column prop="email" label="邮箱绑定" align="center">
                <template #default="scope">
                    <span v-if="scope.row.email !== null">{{ scope.row.email }}</span>
                    <span v-else>未绑定</span>
                </template>
            </el-table-column>
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