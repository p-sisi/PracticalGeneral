<template>
    <div style="font-weight:600;">操作日志</div>

    <!-- 操作日志表格 -->
    <div class="table">
        <div class="table-title">
            <div class="title">学生列表</div>
            <div class="search">
                <span style="font-size:14px">操作类型：</span>
                <el-select
                    v-model="selectValue"
                    placeholder="Select"
                    style="width: 100px"
                    >
                    <el-option
                        v-for="item in type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                    />
                    </el-select>
                <div>
                    <el-input v-model="input" style="width: 200px" placeholder="请输入操作者名字"  :prefix-icon="Search" clearable @blur="selectData()"/>
                </div>
                <el-button type="primary" @click="selectData()">筛选</el-button>
            </div>
            
        </div>

        <div class="table-list">
            <el-table :data="tableList" height="300" stripe>
                <el-table-column prop="handlerName" label="操作者名字" width="100" align="center"/>
                <el-table-column prop="logType" label="操作类型" width="110">
                    <template #default="scope">
                        <span>{{type.filter((item: any) => item.value == scope.row.logType)[0].label}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="操作内容" width="400"/>
                <el-table-column prop="time" label="操作时间"/>
            </el-table>
        </div>
    </div>

    <!-- 页码 -->
    <div class="page">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20,30, 50, 100, 200]"
            :small="small"
            layout="sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchGetLog } from '../../apis/modules/log'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';

onMounted(() => {
    getAllLogRequest(5)
})

const tableList = ref();        //表格数据

const currentPage = ref(1);     //当前页码
const pageSize = ref(20);       //当前页大小
const total = ref(0);           //数据总数
const input = ref('');
const selectValue = ref('全部');    //选择类型

const selectType = computed(() => {
    return type.filter((item) => item.label == selectValue.value)[0].value;
})

const type = [
    {
        label: '全部',
        value: 5
    },
    {
        label: '错误信息',
        value: 0
    },
    {
        label: '更新信息',
        value: 1
    },
    {
        label: '删除信息',
        value: 2
    },
    {
        label: '新增信息',
        value: 3
    },
    {
        label: '其他信息',
        value: 4
    }
]

const handleSizeChange = (value: number) => {
    pageSize.value = value
}
const handleCurrentChange = (value: number) => {
    currentPage.value = value
    getAllLogRequest(selectType.value);
}

const selectData = () => {
    getAllLogRequest(selectType.value);
};

/**
 *  获取操作日志
 */
const getAllLogRequest = async (type:number) => {
    try {
        const params = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            type,
            name: input.value
        }
        const result = await fetchGetLog(params);
        tableList.value = result.data.info;
        total.value = result.data.pages * pageSize.value

    } catch (error: any) {
        ElMessage.error(error.message)
    }
}


</script>

<style scoped lang="scss">
//表格
.table {
    width: 100%;
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    .table-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        .title {
            font-weight: 600;
        }
        .search {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }
        .new {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 10px;
            color: #4186ff;
            font-size: 14px;
            cursor: pointer;
        }
    }
    .table-list {
        .isDoing {
            padding: 4px 8px;
            color: #67c23a;
            background-color: #f0f9eb;
        }
        .isEnable {
            padding: 4px 4px;
            color: #909399;
            background-color: #f4f4f5;
        }
    }
}
.page {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    margin-top: 10px;
}
</style>