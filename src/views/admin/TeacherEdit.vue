<template>
    <!-- 单个编辑、新建教师信息 -->
    <div class="create-one" v-if="adminStore.isShowMultipleCreate == false">
        <!-- 返回 -->
        <div class="back" @click="clickBack()">< 返回教师列表</div>

        <!-- 标题 -->
        <div class="title">
            <span>{{ adminStore.isEditTeacher == true ? '编辑教师账号信息' : '创建教师账号' }}</span>
            <el-button type="primary" @click="adminStore.setIsShowMultipleCreate(true)">批量创建</el-button>
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
            <el-form-item label="教师名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入教师名称"/>
            </el-form-item>
            <el-form-item label="账号" prop="account">
                <el-input v-model="formData.account" placeholder="请输入教师账号"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <template #default>
                    <div class="password">
                        <el-input ref="inputPasswordRef" v-model="formData.password" placeholder="请输入密码"/>
                        <span class="default" @click="handleClickUseDefault()">使用初始密码：abc123456</span>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                <el-input v-model="formData.password2" placeholder="再次输入密码"/>
            </el-form-item>
        </el-form>

        <!-- 表单按钮 -->
        <div class="form-btn">
            <el-button type="primary" @click="submitForm(formRef)">创建</el-button>
            <el-button @click="resetForm(formRef)">重置</el-button>
        </div>
        </div>
    </div>

    <!-- 批量导入教师信息 -->
    <div class="multiple-create" v-else>
        <UserUpload></UserUpload>
    </div>
</template>

<script setup lang="ts">
import UserUpload from './UserUpload.vue'
import { ref, reactive } from 'vue';
import { useAdminStore } from '@/store'
import { TACH_LIST } from '../../content/common'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { fetchSignUp } from '../../apis/modules/user'

const adminStore = useAdminStore();

//点击返回
const clickBack = () => {
    adminStore.setIsShowTeacherList(true);
}

//表单数据
const formData = reactive({
    name: '',
    account: '',
    password:'',
    password2:'',
});
const formRef = ref<FormInstance>()

const inputPasswordRef = ref(null);

const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入教师名称', trigger: 'blur' },
    ],
    account: [
        { required: true, message: '请输入教师账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入教师密码', trigger: 'blur' },
    ],
    password2: [
        { required: true, message: '请再次输入教师密码', trigger: 'blur' },
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
            if(formData.password!==formData.password2) {
                ElMessage.error('两次输入的密码不一致');
                inputPasswordRef.value.focus();
                return;
            }
            try {
                const params = {
                    account: formData.account,
                    name: formData.name,
                    password: formData.password,
                    userType: 1,
                }
                await fetchSignUp(params);
                formEl.resetFields()
            } catch (error) {
                ElMessage.error('注册失败');
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//点击使用初始密码
const handleClickUseDefault = () => {
    formData.password = 'abc123456';
    formData.password2 = 'abc123456';

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