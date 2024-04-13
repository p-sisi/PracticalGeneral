<template>
    <!-- 头部按钮 -->
    <div class="header flex-row">
        <div class="flex-row header-bread">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item to="task">作业列表</el-breadcrumb-item>
                <el-breadcrumb-item to="task_detail" v-if="teacherStore.breadNum >= 2">作业详情</el-breadcrumb-item>
                <el-breadcrumb-item to="stu_detail" v-if="teacherStore.breadNum >= 3">学生作业详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="success" :icon="Plus" @click="clickNewTask">发布作业</el-button>
    </div>

    <!-- 作业列表 -->
    <div class="list">
        <span class="list-num">已发布&nbsp;{{ taskListData.length }}</span>
        <div class="list-item flex-column" v-for="item in taskListData" :key="item.id" @click="clickListItem(item)">
            <div class="list-item-header flex-row">
                <div class="title">{{ item.title }}</div>
                <div class="status">
                    <span class="status-ing" v-if="new Date(item.deadTime).getTime() > new Date().getTime()">进行中</span>
                    <span class="status-end" v-else>已截止</span>
                </div>
                <div >
                    <el-dropdown @command="(command: any) => handleCommand(item, command)">
                        <el-icon class="more"><MoreFilled /></el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="detail">查看详情</el-dropdown-item>
                                <el-dropdown-item command="edit">&nbsp;&nbsp;&nbsp;&nbsp;编辑</el-dropdown-item>
                                <el-dropdown-item command="delete">&nbsp;&nbsp;&nbsp;&nbsp;删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="list-item-content-num flex-row">
                <div class="content">{{ item.content }}</div>
                <div class="num">{{ item.commitNum }} / {{ commonStore.activeClass.stuNum }}</div>
            </div>
            <div class="list-item-time flex-row">
                <span>发布：{{ item.createTime }}</span>
                <span>截止：<span style="color: #fb5531;">{{ item.deadTime }}</span></span>
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
                <el-button type="primary" @click="handleDeleteTask(teacherStore.activeTask)" color="#4186ff">删除</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 编辑、新增抽屉 -->
    <el-drawer 
        v-model="editNewDrawerVisible" 
        size="50%" 
        :title="isEdit ? '编辑作业' : '发布作业'"
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
                    <el-button v-if="!isEdit" type="success" :icon="Plus" @click="submitFormNew(newFormRef)">发布</el-button>
                    <el-button v-else type="primary"  @click="submitFormEdit(newFormRef)">更新</el-button>
                </div>
            </div>
        </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, reactive } from 'vue'
import { Plus, MoreFilled } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import { useCommonStore, useTeacherStore } from '@/store';
import { fetchGetAllCourseTaskTech, fetchDeleteTask, fetchEditTask, fetchNewTask } from '../../apis/modules/task';
import { Task_Tech } from '../../content/task';
import { ElMessage } from 'element-plus';

onMounted(() => {
    getTaskListRequest();
})

const commonStore = useCommonStore();
const teacherStore = useTeacherStore();

const router = useRouter();

const taskListData: Ref<Task_Tech[]> = ref([])

/*
*   获取作业列表请求
*/
const getTaskListRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetAllCourseTaskTech(params)
        taskListData.value = result.data;

    } catch (error: any) {
        console.log(error)
    }
}

/*
*   点击更多
*/
const handleCommand = (item: any, command: string | number | object) => {
    if(command == 'detail') {
        clickListItem(item);
    }else if (command == 'delete') {
        deleteDialogVisible.value = true;
    }else {
        //切换到编辑状态
        isEdit.value = true;

        newFromData.title = item.title;
        newFromData.content = item.content;

        editNewDrawerVisible.value = true;
    }
}

//点击列表item
const clickListItem = (item: any) => {
    //获取当前点击的作业
    teacherStore.setActiveTask(item);
    if(teacherStore.breadNum = 2) {
        teacherStore.setBreadNum(3);
    }if(teacherStore.breadNum = 1){
        teacherStore.setBreadNum(2);
    }
    // 跳转到作业详情页面
    router.push({ path: 'task_detail', query: { taskId: item.id } })
}

//点击发布按钮
const clickNewTask = () => {
    editNewDrawerVisible.value = true;
    isEdit.value = false;
}

const deleteDialogVisible = ref(false);

/*
*   删除作业接口封装
*/
const handleDeleteTask = async(task: any) => {
    try {
        const params = {
            homeworkId: task.id
        }
        await fetchDeleteTask(params);
        ElMessage.success('删除成功')
        getTaskListRequest();
        deleteDialogVisible.value = false;
    } catch (error: any) {
        console.log(error)
    }
}

const editNewDrawerVisible = ref(false);
const newFormRef = ref<FormInstance>()

const isEdit = ref(false);   // 判断是编辑还是新增

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
        getTaskListRequest();

        editNewDrawerVisible.value = false;

        newFromData.title = '';
        newFromData.content = '';
        newFromData.deadTime = '';
    } catch (error) {
        console.log(error)
    }
}

/*
*   发布作业请求封装
*/
const newTaskRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
            homeworkId: 0,
            title: newFromData.title,
            content: newFromData.content,
            deadTime: new Date(newFromData.deadTime).getTime(),
        }
        await fetchNewTask(params);
        ElMessage.success('发布成功');
        getTaskListRequest();

        editNewDrawerVisible.value = false;

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

const submitFormNew = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid:any, fields:any) => {
        if (valid) {
            newTaskRequest();
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
// 头部面包屑及按钮
.header {
    margin-right: 60px;
    justify-content: space-between;
    &-bread {
        font-size: 14px;
        cursor: pointer;
    }
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
// 作业列表
.list {
    &-num {
        font-size: 12px;
    }
    &-item {
        padding: 10px 20px 10px 14px;
        margin-bottom: 20px;
        margin-top: 8px;
        justify-content: space-between;
        border: 1px solid #e9e9e9;
        border-radius: 8px;
        transition: all .3s;
        &-header {
            width: 100%;
            justify-content: space-between;
            .title {
                font-size: 18px;
            }
            .status {
                height: 28px;
                margin-left: 300px;
                margin-top: -11px;
                text-align: center;
                line-height: 28px;
                box-shadow: 2px 2px 2px rgba(0,0,0 ,0.1);
                .status-ing {
                    padding: 4px 16px;
                    color: #7cc23a;
                    background-color: #ecf8e5;
                }
                .status-end {
                    padding: 4px 16px;
                    color: #999;
                    background-color: #f4f8ff;
                }
            }
            .more {
                font-size: 20px;
                color: #4186ff;
                cursor: pointer;
            }
        }
        &-content-num {
            margin-left: 20px;
            margin-right: 20px;
            align-items: center;
            justify-content: space-between;
            .content {
                margin: 12px 8px;
                font-size: 15px;
            }
            .num {
                font-size: 24px;
            }
        }
        &-time {
            gap: 140px;
            font-size: 12px;
            color: #9c9a9a;
        }
    }
    &-item:hover {
        box-shadow: 0px 0px 4px rgba(0,0,0 ,0.2);
    }
}

//去掉抽屉标题下间距
::v-deep .el-drawer__header {
    margin-bottom: 0px!important;
}
</style>