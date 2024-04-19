<template>
    <!-- 新建编辑区 -->
    <div class="create-one" v-if="adminStore.isShowCourseEdit == false">
        <!-- 返回 -->
        <div class="back" @click="clickBack()">< 返回课程列表</div>

        <!-- 标题 -->
        <div class="title">
            <span>{{ adminStore.isEditClass == true ? '编辑课程信息' : '新建课程' }}</span>
            <el-button type="success" v-if="adminStore.isEditClass == true" @click="goToUploadStudent()">添加学生至课程</el-button>
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
            <!-- 编辑时不能更改课号 -->
            <el-form-item label="课号" prop="courseNumber">
                <el-input v-model="formData.courseNumber" placeholder="请输入课号" maxlength="6"/>
            </el-form-item>
            <el-form-item label="课程名称" prop="courseName" >
                <el-input v-model="formData.courseName" placeholder="请输入课程名称"/>
            </el-form-item>
            <el-form-item label="任课教师" prop="teacherName" >
                <el-select v-model="formData.teacherName" placeholder="请选择">
                    <el-option v-for="item in teacherAllData" :key="item.userId" :label="item.name" :value="item.name"/>
                </el-select>
            </el-form-item>
        </el-form>

        <!-- 表单按钮 -->
        <div class="form-btn">
            <el-button type="primary" @click="submitForm(formRef)">{{ adminStore.isEditClass ? '更新' : '新建' }}</el-button>
            <el-button @click="resetForm(formRef)">重置</el-button>
        </div>
        </div>
    </div>

    <!-- 批量导入学生 -->
    <div class="multiple-create" v-else>
        <EditUpload></EditUpload>
    </div>
</template>

<script setup lang="ts">
import EditUpload from './ClassEditUpload.vue'
import { reactive, ref, onMounted } from 'vue';
import { useAdminStore } from '@/store'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { fetchAllTeacher } from '../../apis/modules/user' 
import { fetchEditCourse, fetchNewCourse } from '../../apis/modules/course'

const adminStore = useAdminStore();

//点击返回
const clickBack = () => {
    adminStore.setIsShowCourseList(true);
}

let teacherAllData = ref([])

/**
 *  获取所有教师
 */
const getAllTeacher = async () => {
    try {
        const result = await fetchAllTeacher()
        teacherAllData.value = result.data
    } catch (error: any) {
        ElMessage.error('获取教师列表失败')
    }
}

//表单数据
const formData = reactive({
    courseName: '',           
    courseNumber: '',       //课号
    teacherName: '',
});

const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    courseName: [
        { required: true, message: '请输入课程名称', trigger: 'blur' },
    ],
    courseNumber: [
        { required: true, message: '请输入课号', trigger: 'blur' },
    ],
    teacherName: [
        { required: true, message: '请选择教师', trigger: 'change'},
    ]
})

/**
 *  表单校验
 *  新建课程
 */
 const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate( async (valid:any, fields: any) => {
        if (valid) {
            try {
                 //编辑表单
                const params = {
                    courseId: adminStore.isEditClass == true? adminStore.activeCourseItem.courseId : 0,
                    courseName: formData.courseName,
                    courseNumber:formData.courseNumber,
                    teacherId:teacherAllData.value.filter((item: any) => item.name == formData.teacherName)[0].userId
                }
                if(adminStore.isEditClass == true) await fetchEditCourse(params);
                var newId;
                if(adminStore.isEditClass == false) {
                   const result =  await fetchNewCourse(params);
                   newId = result.data;
                }
                ElMessage.success('成功')
                adminStore.setIsEditClass(true);

                //更新sore中数据
                const newData = {
                    courseId: newId == null ? adminStore.activeCourseItem.courseId: newId,
                    ...formData
                }
                adminStore.updateActiveCourseItem(newData)
            } catch (error: any) {
                ElMessage.error(error.message)
            }
        }else {
            console.log('表单校验失败',formData,fields)
        }
    })
}

/**
 *  重置表单
 */
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//导入学生
const goToUploadStudent = () => {
    //展示导入界面
    adminStore.setIsShowCourseEdit(true);
}

onMounted(async () => {
    await getAllTeacher()
    if(adminStore.isEditClass == true) {
        formData.courseName = adminStore.activeCourseItem.courseName;
        formData.courseNumber = adminStore.activeCourseItem.courseNumber;
        formData.teacherName = adminStore.activeCourseItem.teacherName
    }
})

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
        margin-top: 30px;
        gap: 10px;
        padding-left: 20px;
    }
}
</style>