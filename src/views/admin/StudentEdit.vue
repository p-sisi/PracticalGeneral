<template>
    <!-- 单个编辑、新建学生信息 -->
    <div class="create-one" v-if="adminStore.isShowMultipleCreate == false">
        <!-- 返回 -->
        <div class="back" @click="clickBack()">< 返回学生列表</div>

        <!-- 标题 -->
        <div class="title">
            <span>{{ adminStore.isEditStudent == true ? '编辑学生账号信息' : '创建学生账号' }}</span>
            <el-button type="primary" @click="handleMultipleUpload()">批量创建</el-button>
        </div>

        <!-- 编辑表格 -->
        <div class="form">
            <el-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-width="auto"
                status-icon
            >
            <!-- 编辑时不能更改账号 -->
            <el-form-item label="账号" prop="account" >
                <el-input v-if="adminStore.isEditStudent == false" v-model="formData.account" placeholder="请输入学生账号"/>
                <span v-else>{{ adminStore.activeStudentItem.account }}</span>
            </el-form-item>
            <el-form-item label="学生名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入学生名称"/>
            </el-form-item>
            <!-- 新建时不展示账号状态 -->
            <el-form-item label="账号状态" prop="isEnable" v-if="adminStore.isEditStudent == true">
                <el-select v-model="formData.isEnable" placeholder="请选择">
                    <el-option label="启用" value="启用" />
                    <el-option label="禁用" value="禁用" />
                </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
                <template #default>
                    <div class="password">
                        <el-input ref="inputPasswordRef" v-model="formData.password" placeholder="请输入密码"/>
                        <span class="default" @click="handleClickUseDefault()">使用初始密码：Abc123456</span>
                    </div>
                </template>
            </el-form-item>
            <!-- 密码未修改，不展示确认密码 -->
            <el-form-item label="确认密码" prop="password2" v-if="formData.password !== adminStore.activeStudentItem.password">
                <el-input v-model="formData.password2" placeholder="再次输入密码"/>
            </el-form-item>
        </el-form>

        <!-- 表单按钮 -->
        <div class="form-btn">
            <el-button type="primary" @click="submitForm(formRef)">{{ adminStore.isEditStudent ? '更新' : '创建' }}</el-button>
            <el-button @click="resetForm(formRef)">重置</el-button>
        </div>
        </div>
    </div>

    <!-- 批量导入学生信息 -->
    <div class="multiple-create" v-else>
        <UserUpload></UserUpload>
    </div>
</template>

<script setup lang="ts">
import UserUpload from './UserUpload.vue'
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '@/store'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { fetchSignUp,fetchUpdateUserName ,fetchUpdateUserPasswordByOld, fetchUpdateUserStatus } from '../../apis/modules/user'

onMounted(() => {
    if(adminStore.isEditStudent == true) {
        formData.name = adminStore.activeStudentItem.name;
        formData.account = adminStore.activeStudentItem.account;
        formData.password = adminStore.activeStudentItem.password;
    }
})

const adminStore = useAdminStore();

//点击返回
const clickBack = () => {
    adminStore.setIsShowStudentList(true);
}

//点击批量创建
const handleMultipleUpload = () => {
    //设置状态为编辑学生
    adminStore.setIsUploadTeacher(false);
    adminStore.setIsShowMultipleCreate(true)
}


//表单数据
const formData = reactive({
    name: '',
    account: '',
    isEnable: adminStore.activeStudentItem.isEnable ? '启用' : '禁用',
    password:'',
    password2:'',
});
const formRef = ref<FormInstance>()

const inputPasswordRef = ref(null);

const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入学生名称', trigger: 'blur' },
    ],
    account: [
        { required: true, message: '请输入学生账号', trigger: 'blur' },
        { min: 2, max: 12, message: '账号长度为2-12位', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入学生密码', trigger: 'blur' },
        { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' },
        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/, message: '密码必须为大小写字母和数字组成', trigger: 'blur' },
    ],
    password2: [
        { required: true, message: '请再次输入学生密码', trigger: 'blur' },
    ],
})

/**
 *  1、表单验证
 *  2、提交表单
 *  3、发送新建请求
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate( async (valid:any, fields: any) => {
        if (valid) {
            try {
                //新建学生账号
                if(adminStore.isEditStudent == false) {
                    const params = {
                        account: formData.account,
                        name: formData.name,
                        password: formData.password,
                        userType: 1,
                    }
                    await fetchSignUp(params);
                    ElMessage.success('注册成功');
                    formEl.resetFields()
                }else{
                    //编辑学生账号，发送三个请求
                    if(formData.name != '' && formData.name !== adminStore.activeStudentItem.name) {
                        try {
                            const params = {
                                userId: adminStore.activeStudentItem.userId,
                                name: formData.name
                            }
                            await fetchUpdateUserName(params);
                        } catch (error) {
                            ElMessage.error('修改名称失败！');
                        }
                    }
                    if(formData.password != '' && formData.password !== adminStore.activeStudentItem.password) {
                        try {
                            if(formData.password!==formData.password2) {
                                ElMessage.error('两次输入的密码不一致');
                                inputPasswordRef.value.focus();
                            }else {
                                const params = {
                                    account: formData.account,
                                    oldPassword: adminStore.activeStudentItem.password,
                                    newPassword: formData.password
                                }
                                await fetchUpdateUserPasswordByOld(params)
                            }
                        } catch (error) {
                            ElMessage.error('修改密码失败！');
                        }
                    }
                    const currentStatus = formData.isEnable === '启用' ? true : false;
                    if(currentStatus !== adminStore.activeStudentItem.isEnable) {
                        try {
                            const params = {
                                userId: adminStore.activeStudentItem.userId,
                                status: currentStatus
                            }
                            await fetchUpdateUserStatus(params);
                        } catch (error) {
                            ElMessage.error('修改状态失败');
                        }
                    }
                    ElMessage.success('修改成功');
                    //信息修改成功，返回列表页面
                    adminStore.setIsShowStudentList(true);
                }
            } catch (error) {
                ElMessage.error('注册失败');
            }
        } else {
            console.log('表单校验失败', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//点击使用初始密码
const handleClickUseDefault = () => {
    formData.password = 'Abc123456';
    formData.password2 = 'Abc123456';

    //清除两个密码框的表单验证
    const form = formRef.value;
    if (form) {
        form.clearValidate(['password', 'password2']);
    }
}
</script>

<style scoped lang="scss">
// 返回按钮
.back {
    font-size: 14px;
    cursor: pointer;
}
.back:hover {
    color: #4186ff;
}

//标题
.title {
    display: flex;
    padding-right: 40px;
    justify-content: space-between;
    margin: 20px 0;
}

//表单
.form {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    height: auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    .password {
        .default {
            color: #999;
            font-size: 12px;
            cursor: pointer;
        }
        .default:hover {
            color: #4186ff;
        }
    }
    .form-btn {
        display: flex;
    }
}
</style>