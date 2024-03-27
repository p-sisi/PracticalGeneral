<template>
    <div class="container">
        <div class="container-search">
            <div class="search-title">
                <div class="time">
                    <span>开课时间</span>
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
                        <el-option label="未开始" value="未开始" />
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

        <div class="container-table">
            <div class="container-table-title">
                <div class="text">课程列表</div>
                <div class="new">
                    <div>+&nbsp;添加课程</div>
                </div>
            </div>
            <el-table :data="CLASS_TABLE" height="450" stripe>
                <el-table-column type="selection" width="40" />
                <el-table-column fixed prop="classId" label="编号" width="100px" />
                <el-table-column prop="name" label="名称" width="100" />
                <el-table-column prop="uploader" label="上传者" width="80" />
                <el-table-column prop="description" label="状态" width="120" />
                <el-table-column prop="studentCount" label="学生人数" width="100" />
                <el-table-column prop="uploadTime" label="创建时间" width="140" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="container-table-page">
                <el-pagination layout="prev, pager, next" :total="50" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { CLASS_TABLE } from '../../content/admin'

//搜索
const dateValue = ref();
const classStatus = ref();
const inputUploader = ref('');
const handleSearch = () => {

}
const handleReset = () => {
    dateValue.value = '';
    classStatus.value = '';
    inputUploader.value = '';
    ElMessage.success('重置成功')
}

//表格操作
const handleEdit = (index: number, row: any) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: any) => {
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
        &-page {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>