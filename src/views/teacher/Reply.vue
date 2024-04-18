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
            @keydown.enter="handleSearchDiscuss"
            @focus="activeRadio = '全部'"/>
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
            <el-table-column prop="status" label="答辩状态" width="90" align="center" fixed >
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
            <el-table-column prop="score" align="center" label="分数" width="60" sortable >
                <template #default="scope">
                    <span v-if="scope.row.score != null">{{ scope.row.score }}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <el-tooltip class="box-item" content="通过答辩申请" placement="top">
                        <el-button size="small" type="success" @click="changeReplyStatus(scope.row,2)" v-if="scope.row.status == 0">通过</el-button>
                    </el-tooltip>
                    <el-tooltip class="box-item" content="拒绝答辩申请" placement="top">
                        <el-button size="small" type="danger" @click="changeReplyStatus(scope.row,1)" v-if="scope.row.status == 0">拒绝</el-button>
                    </el-tooltip>
                    <el-button size="small" @click="handleClickEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteReply(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 删除答辩记录弹出的对话框 -->
    <el-dialog
        v-model="deleteDialogVisible"
        title="提示"
        width="300"
    >
        <span>确定删除<span style="margin: 0 10px;font-size: 18px;">{{ activeReplyItem.stuName }}</span>的答辩记录？</span>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="danger" @click="deleteReplyRequest()">删除</el-button>
        </div>
        </template>
    </el-dialog>

    <!-- 编辑答辩记录的抽屉 -->
    <el-drawer v-model="editDrawerVisible" :with-header="false" size="40%">
        <span style="font-weight: 600;">编辑答辩信息</span>
        <div class="content">
            <div class="content-edit">
                <div>
                    <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
                    <span style="color: #999">{{ activeReplyItem.stuName }}</span>
                </div>
                <div>
                    <span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
                    <span style="color: #999">{{ activeReplyItem.stuAccount }}</span>
                </div>
                <div>
                    <span>申请状态：</span>
                    <el-select v-model="editStatus" placeholder="请选择状态" style="width: 200px">
                        <el-option
                            v-for="item in selectStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                        </el-select>
                </div>
                <div v-if="editStatus !== 1">
                    <span>答辩时间：</span>
                    <el-date-picker v-model="editTime" type="datetime"placeholder="请选择答辩时间"/>
                </div>
                <div style="display: flex;align-items: center;" v-if="editStatus == 3">
                    <span>分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</span>
                    <span><el-input v-model="editScore" style="width: 50%" placeholder="分数" /></span>
                </div>
                <div v-if="editStatus == 3">
                    <span>评语：</span>
                    <el-input v-model="editComment" style="width: 100%" placeholder="请输入评语" type="textarea"  :rows="4"/>
                </div>
            </div>
            <div class="content-btn">
                <el-button @click="editDrawerVisible = false">取消</el-button>
                <el-button type="primary" @click="editStudentReply()">修改</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { fetchGetReplyHistoryTech, fetchDeleteReply, fetchChangeReplyStatus, fetchEditReplyStatus } from '../../apis/modules/score'
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

const selectStatus = [
    {
        label: '通过申请，等待答辩',
        value: 2
    },
    {
        label: '拒绝该申请',
        value: 1
    },
    {
        label: '已完成',
        value: 3
    }
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
    if (activeRadio.value === label) return; 

    activeRadio.value = label;

    if (label === '全部') {
        // 如果选中的是“全部”标签，则显示全部数据
        tableData.value = tableDataAll.value;
    } else {
        // 否则，根据筛选条件过滤数据
        tableData.value = tableDataAll.value.filter((item: any) =>
            item.status === status.find(item => item.label === label)?.value
        );
    }
}


//搜索
const searchInput = ref('');
const handleSearchDiscuss = () => {
    const searchText = searchInput.value.trim(); 
    if (searchText === '') {
        // 如果搜索文本为空，则显示全部数据
        tableData.value = tableDataAll.value;
    } else {
        // 否则，根据搜索文本过滤数据
        tableData.value = tableDataAll.value.filter((item: any) =>item.stuName.includes(searchText) 
        );
    }
}

const deleteDialogVisible = ref(false);

const activeReplyItem = ref();   //单前选择的答辩记录，用于编辑和删除

const deleteReply = (row: any) => {
    deleteDialogVisible.value = true;
    activeReplyItem.value = row;
}

/**
 *  删除答辩记录
 */
const deleteReplyRequest = async () => {
    try {
        await fetchDeleteReply({
            defenceId: activeReplyItem.value.id
        })
        ElMessage.success('删除成功')
        //删除后重新获取列表
        getAllReplyHistory()
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

/**
 *  审批学生答辩记录请求：同意，拒绝
 */
const changeReplyStatus = async (row: any,status: number) => {
    try {
        await fetchChangeReplyStatus({
            defenceId: row.id,
            status: status
        })
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

const editDrawerVisible = ref(false);

const editTime = ref('');   //编辑新输入答辩时间
const editScore = ref('');   //编辑新输入答辩成绩
const editComment = ref('');   //编辑新输入答辩评语
const editStatus = ref<any>();     //编辑新输入的答辩状态


//点击表格的编辑
const handleClickEdit = (row: any) => {
    editDrawerVisible.value = true;
    //更新当前答辩记录
    activeReplyItem.value = row;

    editTime.value = activeReplyItem.value.defenceTime;
    editScore.value = activeReplyItem.value.score;
    editComment.value = activeReplyItem.value.comment;
    editStatus.value = row.status
}

/**
 *  修改学生答辩信息：状态、时间、分数、评语
 */
const editStudentReply = async () => {
    try {
        await fetchEditReplyStatus({
            id: activeReplyItem.value.id,
            status: editStatus.value,
            defenceTime: editStatus.value == 1 ? null : new Date(editTime.value).getTime(),
            score: editStatus.value == 2 || editStatus.value == 1 ? null :editScore.value ,
            comment: editStatus.value == 2 || editStatus.value == 1? null : editComment.value ,
        })
        ElMessage.success('修改成功')
        //修改后重新获取列表
        getAllReplyHistory()
    } catch (error: any) {
        ElMessage.error(error.message);
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

//编辑弹框样式
.content {
    height: 90%;
    display: flex;
    gap: 20px;
    flex-flow: column nowrap;
    justify-content: space-between;
    .content-edit {
        display: flex;
        margin-top: 20px;
        margin-left: 20px;
        flex-flow: column nowrap;
        gap: 10px;
        span {
            font-size: 14px;
        }
    }
    .content-btn {
        display: flex;
        justify-content: flex-end;
        margin-right: 30px;
    }
}

//表格样式
::v-deep .el-table .cell {
    padding: 0px;
}
</style>