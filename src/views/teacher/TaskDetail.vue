<template>
    <!-- 头部面包屑 -->
    <div class="flex-row">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item to="task">作业列表</el-breadcrumb-item>
            <el-breadcrumb-item to="task_detail" v-if="teacherStore.breadNum >= 2">作业详情</el-breadcrumb-item>
            <el-breadcrumb-item to="stu_detail" v-if="teacherStore.breadNum >= 3">学生作业详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <!-- 作业详情 -->
    <div class="detail">
        <!-- 作业基本信息 -->
        <div class="detail-info ">
            <div class="header flex-row">
                <div class="header-title flex-row">
                    <span class="iconfont icon-zuoye-xuanzhong"></span>
                    <div>{{ teacherStore.activeTask.title }}</div>
                </div>
                <div class="header-status">
                    <span class="ing" v-if="new Date(teacherStore.activeTask.deadTime).getTime() > new Date().getTime()">进行中</span>
                    <span class="end" v-else>已截止</span>
                </div>
                <div class="header-num">{{ teacherStore.activeTask.commitNum }} / {{ commonStore.activeClass.stuNum }}</div>
            </div>
            <div class="divide"></div>
            <div class="content">
                <div>{{ teacherStore.activeTask.content }}</div>
            </div>
            <div class="footer flex-row">
                <div class="footer-time">
                    <span>发布：{{ teacherStore.activeTask.createTime }}</span>
                    <span>截止：{{ teacherStore.activeTask.deadTime }}</span>
                </div>
                <div class="footer-btn">
                    <el-button type="primary" color="#4186ff" size="small" @click="clickEditBtn">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteDialogVisible = true">删除</el-button>
                </div>
            </div>
        </div>


        <!-- 作业提交列表 -->
        <div class="detail-list">
            <div class="detail-list-header flex-row">
                <div class="flex-row">
                    <div 
                        v-for="item in radio" 
                        :key="item.status"  
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

            <!-- 提交表格 -->
            <div class="detail-list-table flex-row" >
                <el-table 
                    :data="tableData" 
                    style="width: 92%" 
                    height="450" 
                    >
                    <el-table-column prop="stuName" label="姓名" width="150" align="center"/>
                    <el-table-column prop="commitTime" label="提交时间" width="200" sortable align="center">
                        <template #default="scope">
                            <span v-if="scope.row.commitTime != null">{{ scope.row.commitTime }}</span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="score" label="得分" width="200" sortable align="center">
                        <template #default="scope">
                            <span v-if="scope.row.score != null">{{ scope.row.score }}</span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="commitStatus" label="提交状态">
                        <template #default="scope" >
                            <div @click="clickTableStatus(scope.row)">
                                <div v-if="scope.row.commitStatus == 0" class="no-submit table-status">未提交</div>
                                <div v-else-if="scope.row.commitStatus == 1" class="submit table-status">已提交</div>
                                <div v-else class="score table-status">已批改</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

    
    <!-- 删除作业对话框 -->
    <el-dialog
        v-model="deleteDialogVisible"
        title="提示"
        width="400"
        >
        <span>确定删除<span style="font-size: 16px;color: #4186ff;margin: 0px 10px;">{{ teacherStore.activeTask.title }}</span>?</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleDeleteTask()" color="#4186ff">删除</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 编辑抽屉 -->
    <el-drawer 
        v-model="editDrawerVisible" 
        size="50%" 
        title="编辑作业"
        @close="handleCloseDrawer">
            <div class="edit-new-drawer flex-column">
                <div>
                    <el-form
                        ref="newFormRef"
                        style="max-width: 600px"
                        :model="newFromData"
                        :rules="rulesForm"
                        label-width="auto"
                        class="demo-ruleForm"
                        status-icon
                    >
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="newFromData.title"  type="textarea" :rows="2"/>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <el-input v-model="newFromData.content"  type="textarea" :rows="10"/>
                        </el-form-item>
                        <el-form-item label="截止时间" prop="deadTime">
                            <el-date-picker
                                v-model="newFromData.deadTime"
                                type="datetime"
                                placeholder="请选择时间"
                            />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn flex-row">
                    <el-button  type="primary"  @click="submitFormEdit(newFormRef)">更新</el-button>
                </div>
            </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, reactive } from 'vue';
import { useCommonStore, useTeacherStore } from '@/store';
import { Search } from '@element-plus/icons-vue'
import { fetchTaskSubmitList, fetchDeleteTask, fetchEditTask } from '../../apis/modules/task';
import { Task_Tech_Commit } from '../../content/task'
import { getStringTime } from '../../util/index'
import { useRouter } from 'vue-router';
import type { FormRules, FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';

onMounted(() => {
    getTaskSubmitList()
})

const commonStore = useCommonStore();
const teacherStore = useTeacherStore();

const router = useRouter();

//删除
const deleteDialogVisible = ref(false);

/*
*   删除作业请求
*/
const handleDeleteTask = async() => {
    try {
        const params = {
            homeworkId: teacherStore.activeTask.id
        }
        await fetchDeleteTask(params);
        deleteDialogVisible.value = false;
        teacherStore.setBreadNum(1);

        //跳转到作业列表页
        router.push('/teacher/class_detail/task')
    } catch (error: any) {
        console.log(error)
    }
}

const editDrawerVisible = ref(false);

//点击编辑按钮
const clickEditBtn = () => {
    editDrawerVisible.value = true;
    newFromData.title = teacherStore.activeTask.title;
    newFromData.content = teacherStore.activeTask.content;
}

const newFormRef = ref<FormInstance>()

const newFromData = reactive({
    title: '',
    content: '',
    deadTime: '',
})

const rulesForm = reactive<FormRules>({
    title: [
        { required: true, message: '请输入公告作业标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入作业内容', trigger: 'blur' },
    ],
    deadTime: [
        { required: true, message: '请选择截止时间', trigger: 'blur' },
    ]
})

/*
*   编辑作业请求封装
*/
const editTaskRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
            homeworkId: teacherStore.activeTask.id,
            title: newFromData.title,
            content: newFromData.content,
            deadTime: new Date(newFromData.deadTime).getTime(),
        }
        await fetchEditTask(params);
        ElMessage.success('编辑成功');

        //更新Store中数据
        const newData = {
            id: teacherStore.activeTask.id,
            title: newFromData.title,
            content: newFromData.content,
            createTime: teacherStore.activeTask.createTime,
            deadTime: getStringTime(newFromData.deadTime),
            commitNum: teacherStore.activeTask.commitNum,
        }
        teacherStore.setActiveTask(newData)
        editDrawerVisible.value = false;

        newFromData.title = '';
        newFromData.content = '';
        newFromData.deadTime = '';
    } catch (error) {
        console.log(error)
    }
}


const submitFormEdit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid:any, fields:any) => {
        if (valid) {
            editTaskRequest();
        } else {
            console.log('error submit!', fields)
        }
    })
}

//关闭编辑删除弹窗
const handleCloseDrawer = () => {
    clearFormValidate(newFormRef.value)
}

//清除表单验证信息
const clearFormValidate = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.clearValidate('title')
    formEl.clearValidate('content')
}

//表格数据
const tableData: Ref<Task_Tech_Commit[]> = ref([]);

//暂存所有表格数据
const tableDataAll: Ref<Task_Tech_Commit[]> = ref([]); 

/*
*   获取提交记录列表请求
*   @param status: 状态
*/
const getTaskSubmitList = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
            homeworkId: teacherStore.activeTask.id
        }
        const result = await fetchTaskSubmitList(params);
        tableDataAll.value = result.data;
        tableData.value = result.data;
    } catch (error) {
        console.log(error);
    }
}

const radio = [
    {
        label: '全部',
        status: 99,
    },
    {
        label: '已提交',
        status: 1,
    },
    {
        label: '未提交',
        status: 0,
    },
    {
        label: '已批改',
        status: 2,
    },
]

//切换提交状态
const activeRadio = ref('全部') 
const radioChange = (label: any) => {
    if (activeRadio.value === label )  return 
    tableData.value = tableDataAll.value;

    if(label === '全部') {
        tableData.value = tableDataAll.value;
    } else if(label === '已提交') {
        tableData.value = tableData.value.filter((item:any) => item.commitStatus == 1);
    } else if(label === '未提交'){
        tableData.value = tableData.value.filter((item:any) => item.commitStatus == 0);
    } else {
        tableData.value = tableData.value.filter((item:any) => item.commitStatus == 2);
    }


    activeRadio.value = label;
}

//搜索
const searchInput = ref('');
const handleSearchDiscuss = () => {
    activeRadio.value = '全部'
    if(searchInput.value === '') return tableData.value = tableDataAll.value;

    tableData.value = tableDataAll.value;
    tableData.value = tableData.value.filter((item:any) => {
        return item.stuName.includes(searchInput.value)  
    });
}

//点击提交状态
const clickTableStatus = (item: any) => {
    if(item.commitStatus !== 0) {
        router.push('/teacher/class_detail/stu_detail')
        teacherStore.setBreadNum(3);
        teacherStore.setActiveStudentTask(item)
    }
}
</script>

<style scoped lang="scss">
.flex-row {
    display: flex;
    flex-flow: row nowrap;
}
.flex-column {
    display: flex;
    flex-flow: column nowrap;
}

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

.divide {
    width: 100%;
    height: 1px;
    margin-top: 10px;
    background-color: #ddd;
}
//作业详情
.detail {
    margin-top: 20px;
    &-info {
        .header {
            justify-content: space-between;
            align-items: flex-end;
            &-title {
                gap: 20px;
                align-items: center;
                .iconfont {
                    font-size: 24px;
                    color: #4186ff;
                }
                div {
                    font-size: 16px;
                }
            }
            &-status {
                font-size: 12px;
                .ing {
                    padding: 4px 10px;
                    color: #7cc23a;
                    background-color: #ecf8e5;
                    border-radius: 20px;
                }
                .end {
                    padding: 4px 10px;
                    color: #999;
                    background-color: #f4f8ff;
                    border-radius: 20px;
                }
            }
            &-num {
                margin-right: 40px;
                font-size: 24px;
            }
        }
        .content {
            margin: 14px 0 8px 0;
            padding: 10px;
            font-size: 14px;
            background-color: #f8fbff;
            border-radius: 8px;
            div {
                min-height: 50px;
                background-color: #fff;
                padding: 10px;
                border-radius: 6px;
            }
        }
        .footer {
            justify-content: space-between;
            align-items: center;
            &-time {
                font-size: 12px;
                color: #999;
                span {
                    margin-right: 40px;
                }
            }
            &-btn {
                margin-right: 20px;
            }
        }
    }
    .detail-list {
        .detail-list-header {
            justify-content: space-between;
            margin-top: 30px;
        }
        .detail-list-table {
            justify-content: center;
            margin-top: 20px;
            background-color: #f8fbff;
            padding: 20px 0px;
            border-radius: 8px;
            .table-status {
                width: 60px;
                padding: 2px 8px;
                border-radius: 4px;
                cursor: pointer;
            }
            .no-submit {
                color: #f56c6c;
                background-color: #fef0f0;
            }
            .submit {
                color: #eebe77;
                background-color: #fdf6ec;
            }
            .score {
                color: #67c23a;
                background-color: #f0f9eb;
            }
        }
    }
}

//去掉抽屉标题下间距
::v-deep .el-drawer__header {
    margin-bottom: 0px!important;
}
//抽屉样式
.edit-new-drawer {
    height: 100%;
    padding-bottom: 20px;
    justify-content: space-between;
    .btn {
        justify-content: flex-end;
    }
}
</style>