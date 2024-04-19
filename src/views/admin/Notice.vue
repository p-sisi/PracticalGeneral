<template>
    <!-- 标题及按钮 -->
    <div class="header-title">
        <span>系统公告<span style="font-size:14px">（共&nbsp;{{noticeData.length}}&nbsp;条）</span></span>
        <el-button type="success" @click="editNewDrawerVisible = true">发布系统公告</el-button>
    </div>

    <!-- 公告列表 -->
    <div class="notice-list">
            <div class="notice-list-item" v-for="item in noticeData" :key="item.noticeId">
                <div class="item-title">
                    <span class="title">
                        <div class="top" v-show="item.isTop">置顶</div>
                        <span>{{ item.title }}</span>
                    </span>
                    <el-dropdown @command="(command: any) => handleCommand(item, command)">
                        <span style="display:flex;align-items:center;color: #4186ff;cursor: pointer;font-size: 18px;"><el-icon><MoreFilled /></el-icon></span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="top" >{{ item.isTop ? '取消置顶' : '设为置顶' }}</el-dropdown-item>
                                <el-dropdown-item command="delete">&nbsp;&nbsp;&nbsp;&nbsp;删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="item-content">{{ item.content }}</div>
                <div class="item-info">
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
            title="发布公告"
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
                <div class="btn">
                    <el-button type="success" :icon="Plus" @click="submitFormNew(newNoticeFormRef)">新增</el-button>
                </div>
            </div>
        </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, reactive } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus';
import { fetchGetAllSysNoticeAdmin, fetchTopNotice ,fetchCancelTopNotice, fetchDeleteNotice ,fetchNewSysNotice} from '../../apis/modules/notice'
import { ElMessage } from 'element-plus'
import { Notice } from '../../content/notice';

onMounted(() => {
    getAllNotice()
})

const deleteDialogVisible = ref(false);
const activeNotice = ref<Notice>();    //当前选中的公告

//点击发布公告按钮
const handleClickNew = () => {
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
    }else {
        handleTop(item);
    }
}
const noticeData: Ref<Notice[]> = ref([]);

//删除公告
const handleDeleteNotice = () => {
    deleteNoticeRequest(activeNotice.value?.noticeId);
    deleteDialogVisible.value = false;

    getAllNotice();
}

/*
*   获取全部系统公告
*/
const getAllNotice = async () => {
    try {
        const result = await fetchGetAllSysNoticeAdmin();
        noticeData.value = result.data;
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

/*
*   新增公告请求封装
*/
const newNoticeRequest = async () => {
    try {
        const params = {
            title: newNoticeFromData.title,
            content: newNoticeFromData.content
        }
        await fetchNewSysNotice(params);
        ElMessage.success('新增成功');
        getAllNotice();
        editNewDrawerVisible.value = false;
    } catch (error) {
        console.log(error)
    }
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

</script>

<style scoped lang="scss">
.header-title {
    display: flex;
    margin: 0 20px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.notice-list {
    width: 93%;
        &-item {
            width: 100%;
            padding: 8px 20px 10px 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            background-color: #fff;
            box-shadow: 0px 0px 10px #ebeaeac9;
            .item-title {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: flex-start;
                .title {
                    margin-left: 10px;
                    padding: 8px 0px;
                    font-weight: 600;
                    font-size: 20px;
                    .top {
                        width: 40px;
                        height: 20px;
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
                margin: 0px 10px 8px 30px;
                font-size: 14px;
            }
            .item-info {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                margin-top: 8px;
                margin-left: 10px;
                font-size: 13px;
                color: #908d8d;
            }
        }
    }
.edit-new-drawer {
    .btn {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
    }
}
::v-deep .el-drawer__header {
    margin-bottom: 0px;
}
</style>