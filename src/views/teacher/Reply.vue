<template>
    <!-- 头部标签 -->
    <div class="header">
        <span class="header-title">结课答辩</span>
        <span class="header-subtitle">
            <span style="font-size: 12px;">完成学生人数：</span>
            <span>{{finishCount}}/{{ tableData?.length }}</span>
        </span>
    </div>

    <!-- 筛选标签、搜索框 -->
    <div class="detail-list-header">
        <div style="display: flex;">
            <div 
                v-for="item in status" 
                :key="item.value"  
                @click="radioChange(item.label)" 
                class="tabs-temp" 
                :class="{ 'selected': item.label === activeRadio }"
            >
                {{ item.label }}
                </div>
            </div>
        <div class="search">
            <el-input 
            v-model="searchInput" 
            style="width: 240px" 
            placeholder="搜索学生姓名" 
            size="small" 
            :suffix-icon="Search" 
            clearable 
            @click="handleSearchDiscuss"
            @blur="handleSearchDiscuss"
            @keydown.enter="handleSearchDiscuss"/>
        </div>
    </div>

    <!-- 表格 -->
    <div class="table">
        <el-table 
            :data="tableData" 
            style="max-width: 100%" 
            height="450" 
            >
            <el-table-column prop="stuAccount" label="账号" width="110" align="center" fixed />
            <el-table-column prop="stuName" label="姓名" width="100" align="center" fixed />
            <el-table-column prop="status" label="答辩状态" width="80" align="center" fixed >
                <template #default="scope">
                    <div v-if="scope.row.status == 0" class="ing">申请中</div>
                    <div v-else-if="scope.row.status == 1" class="ju">已拒批</div>
                    <div v-else-if="scope.row.status == 2" class="dai">待答辩</div>
                    <div v-else-if="scope.row.status == 3" class="done">已完成</div>
                    <div v-else class="wei">未申请</div>
                </template>
            </el-table-column>
            <el-table-column prop="applyTime" label="申请时间" width="105" align="center">
                <template #default="scope">
                    <span v-if="scope.row.applyTime != null">{{ getStringTime(scope.row.applyTime) }}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column prop="defenceTime" label="答辩时间" width="105" align="center">
                <template #default="scope">
                    <span v-if="scope.row.defenceTime != null">{{ getStringTime(scope.row.defenceTime) }}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column prop="score" align="center" label="分数" width="60">
                <template #default="scope">
                    <span v-if="scope.row.score != null">{{ scope.row.score }}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <el-button size="small" type="success" v-if="scope.row.status == 0">通过</el-button>
                    <el-button size="small" type="danger" v-if="scope.row.status == 0">拒绝</el-button>
                    <el-button size="small">编辑</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { fetchGetReplyHistoryTech } from '../../apis/modules/score'
import { useCommonStore } from '@/store';
import { ElMessage } from 'element-plus';
import { getStringTime } from '../../util/index'

onMounted(() => {
    getAllReplyHistory();
})

const commonStore = useCommonStore();

const status = [
    {
        value: 999,
        label: '全部'
    },
    {
        value: 4,
        label: '未申请'
    },
    {
        value: 0,
        label: '申请中'
    },
    {
        value: 1,
        label: '已拒批'
    },
    {
        value: 2,
        label: '待答辩'
    },
    {
        value: 3,
        label: '已完成'
    },
]

const tableData = ref();
const tableDataAll = ref();

const finishCount = computed(() => {
    return tableDataAll.value?.filter((item: any) => item.status == 3).length;
})

/**
 *  获取学生提交情况
*/
const getAllReplyHistory = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const res = await fetchGetReplyHistoryTech(params);
        tableData.value = res.data;
        tableDataAll.value = res.data;
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

//切换提交状态
const activeRadio = ref('全部') 
const radioChange = (label: any) => {
    if (activeRadio.value === label) return; // 如果已经是选中状态，则不进行操作

    activeRadio.value = label;

    if (label === '全部') {
        // 如果选中的是“全部”标签，则显示全部数据
        tableData.value = tableDataAll.value;
    } else {
        // 否则，根据筛选条件过滤数据
        tableData.value = tableDataAll.value.filter(item =>
            item.status === status.find(item => item.label === label).value
        );
    }
}


//搜索
const searchInput = ref('');
const handleSearchDiscuss = () => {
    const searchText = searchInput.value.trim(); // 获取搜索框中的文本，并去除首尾空格
    if (searchText === '') {
        // 如果搜索文本为空，则显示全部数据
        tableData.value = tableDataAll.value;
    } else {
        // 否则，根据搜索文本过滤数据
        tableData.value = tableDataAll.value.filter(item =>
            item.stuName.includes(searchText) // 假设学生姓名存储在 stuName 属性中
        );
    }
}

</script>

<style scoped lang="scss">

.tabs-temp { 
    height: 26px;
    padding: 2px 16px;
    margin-right: 8px;
    border-radius: 4px;
    background: #f4f6fab4;
    font-size: 14px;
    line-height: 26px;
    cursor: pointer;
}
.tabs-temp.selected { 
    background: #deeaff;
    color: #1472FF;
}
.header {
    display: flex;
    margin-right: 20px;
    justify-content: space-between;
    .header-title {
        font-weight: 600;
    }
}

.detail-list-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: 30px;
}
.table {
    min-height: 100px;
    margin-top: 20px;
    padding: 10px;
    border-radius: 8px;
    background-color: #f8fbff;
    overflow: hidden;
    .ing,.dai{ //申请中、待答辩
        color: #eebe77;
        background-color: #fdf6ec;
    }
    .ju {   //已拒绝
        color: #f56c6c;
        background-color: #fef0f0;
    }
    .done { //已完成
        color: #67c23a;
        background-color: #f0f9eb;
    }
    .wei {  //未申请
        color: #909399;
        background-color: #f4f4f5;
    }
}
.detail-list-table {
    justify-content: center;

    background-color: #f8fbff;
    padding: 20px 20px;

    box-sizing: border-box;
    .no-submit {
        color: #f56c6c;
        background-color: #fef0f0;
    }
    .submit {
        color: #eebe77;
        background-color: #fdf6ec;
    }
    .done {
        color: #67c23a;
        background-color: #f0f9eb;
    }
}
</style>