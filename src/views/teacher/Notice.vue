<template>
    <div class="notice">
        <!-- 操作提示 -->
        <div class="notice-header flex-row">
            <div class="refresh flex-row" @click="handleRefresh">
                <el-icon :class="{ 'is-loading' : isRefreshLoading }" style="display: block;margin-top: 4px;margin-right: 4px;">
                    <Loading />
                </el-icon>
                <div>刷新</div>
            </div>
            <el-button type="success" :icon="Plus" @click="handleClickNew">发布公告</el-button>
        </div>

        <!-- 公告列表 -->
        <div class="notice-list">
            <div class="notice-list-item" v-for="item in courseNoticeData" :key="item.noticeId">
                <div class="item-title flex-row">
                    <span class="title">
                        <div class="top" v-show="item.isTop">置顶</div>
                        <span>{{ item.title }}</span>
                    </span>
                    <el-dropdown @command="(command: any) => handleCommand(item, command)">
                        <span class="flex-row" style="align-items:center;color: #4186ff;cursor: pointer;font-size: 18px;"><el-icon><MoreFilled /></el-icon></span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="top" >{{ item.isTop ? '取消置顶' : '设为置顶' }}</el-dropdown-item>
                                <el-dropdown-item command="edit">&nbsp;&nbsp;&nbsp;&nbsp;编辑</el-dropdown-item>
                                <el-dropdown-item command="delete">&nbsp;&nbsp;&nbsp;&nbsp;删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="item-content">{{ item.content }}</div>
                <div class="item-info flex-row">
                    <span>发布：{{ item.createTime }}</span>
                    <span>最近一次更新：{{ item.updateTime }}</span>
                    <span>{{ item.readCount }}人已读</span>
                </div>
            </div>
        </div>

        <!-- 删除弹窗 -->
        <el-dialog
            v-model="deleteDialogVisible"
            title="提示"
            width="500"
        >
            <span>确定删除公告&nbsp;&nbsp;&nbsp;<span style="font-size: 20px;color: #4186ff;">{{ activeNotice?.title }}</span></span>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleDeleteNotice" color="#4186ff">删除</el-button>
            </div>
            </template>
        </el-dialog>

        <!-- 编辑、新增抽屉 -->
        <el-drawer 
            v-model="editNewDrawerVisible" 
            size="50%" 
            :title="isEditNoticeStatus ? '编辑公告' : '新增公告'"
            @close="handleCloseDrawer">
            <div class="edit-new-drawer flex-column">
                <div>
                    <el-form
                        ref="newNoticeFormRef"
                        style="max-width: 600px"
                        :model="newNoticeFromData"
                        :rules="rulesForm"
                        label-width="auto"
                        class="demo-ruleForm"
                        status-icon
                    >
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="newNoticeFromData.title"  type="textarea" :rows="2"/>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <el-input v-model="newNoticeFromData.content"  type="textarea" :rows="10"/>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn flex-row">
                    <el-button v-if="!isEditNoticeStatus" type="success" :icon="Plus" @click="submitFormNew(newNoticeFormRef)">新增</el-button>
                    <el-button v-else type="primary"  @click="submitFormEdit(newNoticeFormRef)">完成</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, reactive } from 'vue'
import { Plus, Loading, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus';
import { fetchGetCourseNoticeTeacher, fetchDeleteNotice, fetchEditNotice, fetchNewCourseNotice, fetchTopNotice, fetchCancelTopNotice } from '../../apis/modules/notice'
import { useCommonStore } from '@/store';
import { Notice } from '../../content/notice';

onMounted(() => {
    getAllNotice();
})

const commonStore = useCommonStore();

//刷新
const isRefreshLoading = ref(false);
const handleRefresh = () => {
    if(isRefreshLoading.value) return;
    isRefreshLoading.value = true;
    getAllNotice();
}

const courseNoticeData: Ref<Notice[]> = ref([]);

/*
*   获取公告列表请求
*   @param courseId: 当前课程id 
*/
const getAllNotice = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetCourseNoticeTeacher(params);
        courseNoticeData.value = result.data;

        isRefreshLoading.value = false;
    } catch (error) {
        console.log(error)
    }
}

/*
*   删除公告请求
*   @param noticeId: 当前公告id 
*/
const deleteNoticeRequest = async (noticeId: any) => {
    try {
        const params = {
            noticeId
        }
        await fetchDeleteNotice(params);
        ElMessage.success('删除成功');
    } catch (error) {
        console.log(error)
    }
}

/*
*   编辑公告内容请求封装
*/
const editNoticeRequest = async () => {
    try {
        const params = {
            noticeId: activeNotice.value?.noticeId,
            title: newNoticeFromData.title,
            content: newNoticeFromData.content
        }
        await fetchEditNotice(params);
        ElMessage.success('编辑成功');
        getAllNotice();
        editNewDrawerVisible.value = false;
        newNoticeFromData.title = '';
        newNoticeFromData.content = '';
    } catch (error) {
        console.log(error)
    }
}

/*
*   新增公告请求封装
*/
const newNoticeRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
            title: newNoticeFromData.title,
            content: newNoticeFromData.content
        }
        await fetchNewCourseNotice(params);
        ElMessage.success('新增成功');
        getAllNotice();
        editNewDrawerVisible.value = false;
    } catch (error) {
        console.log(error)
    }
}

const deleteDialogVisible = ref(false);

const isEditNoticeStatus = ref(false);   //是否是编辑状态，or 新增

const activeNotice = ref<Notice>();    //当前选中的公告

//点击发布公告按钮
const handleClickNew = () => {
    editNewDrawerVisible.value = true;
    isEditNoticeStatus.value = false;
    newNoticeFromData.content = '';
    newNoticeFromData.title = '';
    clearFormValidate(newNoticeFormRef.value)
}

//新建公告
const editNewDrawerVisible = ref(false);
const newNoticeFormRef = ref<FormInstance>()

const newNoticeFromData = reactive({
    title: '',
    content: '',
})

const rulesForm = reactive<FormRules>({
    title: [
        { required: true, message: '请输入公告标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入公告内容', trigger: 'blur' },
    ]
})

const submitFormEdit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid:any, fields:any) => {
        if (valid) {
            editNoticeRequest()
        } else {
            console.log('error submit!', fields)
        }
    })
}

const submitFormNew = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid:any, fields:any) => {
        if (valid) {
            newNoticeRequest();
        } else {
            console.log('error submit!', fields)
        }
    })
}

//清除表单验证信息
const clearFormValidate = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.clearValidate('title')
    formEl.clearValidate('content')
}

//关闭编辑删除弹窗
const handleCloseDrawer = () => {
    clearFormValidate(newNoticeFormRef.value)
}

//点击“更多操作”
const handleCommand = (item: any,command: string | number | object) => {
    activeNotice.value = item;

    if(command === 'delete') {
        deleteDialogVisible.value = true;
    }else if (command === 'edit'){
        isEditNoticeStatus.value = true;
        editNewDrawerVisible.value = true;
        //初始化标题内容
        newNoticeFromData.title = item.title,
        newNoticeFromData.content = item.content
    } else {
        handleTop(item);
    }
}

//删除公告
const handleDeleteNotice = () => {
    deleteNoticeRequest(activeNotice.value?.noticeId);
    deleteDialogVisible.value = false;

    getAllNotice();
}

/*
*   公告置顶请求
*/
const handleTop = async (item: any) => {
    try {
        const params = {
            noticeId: item.noticeId
        }
        if(item.isTop == false) {
            await fetchTopNotice(params);
            ElMessage.success('置顶成功')
        } else {
            await fetchCancelTopNotice(params);
            ElMessage.success('取消置顶成功')
        }

        getAllNotice();
    } catch (error) {
        console.log(error)
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
    gap: 10px;
}

.edit-new-drawer {
    height: 100%;
    padding-bottom: 20px;
    justify-content: space-between;
    .btn {
        justify-content: flex-end;
    }
}
.notice {
    // 头部
    &-header {
        margin-right: 60px;
        justify-content: flex-end;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        .refresh {
            font-size: 14px;
            cursor: pointer;
        }
    }

    //公告列表
    &-list {
        width: 93%;
        &-item {
            width: 100%;
            padding: 8px 20px 10px 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0px 0px 10px #ebeaeac9;
            .item-title {
                justify-content: space-between;
                align-items: flex-start;
                .title {
                    margin-left: 10px;
                    padding: 8px 0px;
                    font-weight: 600;
                    font-size: 20px;
                    .top {
                        width: 40px;
                        margin-top: -20px;
                        margin-left: -26px;
                        padding: 2px;
                        text-align: center;
                        font-size: 13px;
                        font-weight: 500;
                        color: #fff;
                        background-color: #f56c6c;
                        box-shadow: 4px 2px 6px rgba($color: #000000, $alpha: 0.3);
                    }
                }
            }
            .item-content {
                margin: 0px 30px 8px 30px;
                font-size: 14px;
            }
            .item-info {
                justify-content: space-between;
                margin-top: 8px;
                margin-left: 10px;
                font-size: 13px;
                color: #908d8d;
            }
        }
    }

}
::v-deep .el-drawer__header {
    margin-bottom: 0px;
}
</style>