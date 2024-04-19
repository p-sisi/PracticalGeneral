<template>
    <!-- 返回 -->
    <div class="back" @click="clickBack()">
        <span v-if="adminStore.isEditClass == false">< 返回课程列表</span>
        <span v-else>< 返回编辑</span>
    </div>

    <!-- 课程信息 -->
    <div class="info">
        <span>课号：{{ adminStore.activeCourseItem.courseNumber }}</span>
        <span class="info-title">{{ adminStore.activeCourseItem.courseName }}</span>
        <span>任课教师：{{ adminStore.activeCourseItem.teacherName }}</span>
    </div>

    <!-- 课程已有学生信息 -->
    <div class="student-exit">
        <span>课程中学生信息：</span>
        <el-table :data="existStudentData" style="width: 80%" stripe height="250">
            <el-table-column prop="account" label="账号" width="180" align="center"/>
            <el-table-column prop="name" label="名字" width="180" align="center"/>
            <el-table-column prop="email" label="email邮箱" align="center">
                <template #default="scope">
                    <span v-if="scope.row.email == null">未绑定</span>
                    <span v-else>{{ scope.row.email }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" align="center">
                <template #default="scope">
                    <span v-if="scope.row.phone == null">未绑定</span>
                    <span v-else>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 上传按钮 -->
    <el-upload
        class="upload-demo"
        drag
        ref="uploadRef"
        :auto-upload="false"
        :show-file-list="false"
        @change="handleChangeFile"
        :limit="1"
        :on-exceed="handleExceed"
    >
        <span class="iconfont icon-shangchuan"></span>
        <div class="el-upload__text">将文件拖拽到此处，或点击上传</div>
        <div class="el-upload__text">仅支持Excel文件，且文件中包含两列数据：<span style="color: #4186ff">账号（第一列）、名称</span></div>
    </el-upload>

     <!-- 用户选择的文件、导入按钮 -->
    <div class="file-btn"  v-if="isShowUploadFile">
        <div class="file" >
            <span class="iconfont icon-Excel"></span>
            <div style="display: flex;flex-direction: column;">
                <span class="name">{{ uploadFile.name }}</span>
                <span class="size">{{ (uploadFile.size/1024).toFixed(2) }}k</span>
            </div>
        </div>
        <div class="btn"><el-button type="success" @click="handleAnalyzeFile()" :disabled="isAnalyzing">{{isAnalyzing ? '解析中' : '解析文件'}}</el-button></div>
    </div>

    <!-- 分割线 -->
    <div class="divide"></div>

    <!-- 解析成功的数据 -->
    <div>
        <span >已解析数据</span>
        <span style="font-size: 12px;">（共{{ analyzeListData.length }}条）</span>
    </div>
    <div class="table-analyze" v-if="analyzeListData.length != 0">
        <div class="table">
            <el-table ref="multipleTableRef" :data="analyzeListData" stripe height="350" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80" align="center"/>
                <el-table-column type="index" width="90" align="center"/>
                <el-table-column prop="account" label="学号" width="200" align="center">
                    <template #default="scope">
                        <span v-if="!scope.row.editable">{{ scope.row.account }}</span>
                        <el-input v-else v-model="inputAccount"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名字" width="180" align="center">
                    <template #default="scope">
                        <span v-if="!scope.row.editable">{{ scope.row.name }}</span>
                        <el-input v-else v-model="inputName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">{{ scope.row.editable == true ? '更新' : '编辑' }}</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <!-- 批量删除、重置按钮 -->
    <div class="multiple-btn" v-if="analyzeListData.length != 0">
        <el-button :disabled="multipleSelectionData.length == 0" @click="clearSelection()">清除选中</el-button>
        <el-button type="success" @click="exportUserRequest(multipleSelectionData)">导入选中</el-button>
        <el-button type="danger" @click="deleteDialogVisible = true">删除选中</el-button>
        <el-button type="success" @click="exportUserRequest(analyzeListData)">全部导入</el-button>
    </div>

    <!-- 分割线 -->
    <div class="divide"></div>

    <!-- 导入成功的数据 -->
    <span>创建成功</span>
    <span style="font-size: 12px;">（共{{ successListData.length }}条）</span>
    <div class="table-success" v-if="successListData.length !== 0">
        <div class="table">
            <el-table :data="successListData" stripe height="200">
                <el-table-column type="index" width="130" align="center"/>
                <el-table-column prop="account" label="学号" width="240px" align="center"/>
                <el-table-column prop="name" label="名字"align="center"/>
            </el-table>
        </div>
    </div>

    <!-- 确认删除选中数据对话框 -->
    <el-dialog
        v-model="deleteDialogVisible"
        title="提示"
        width="600"
    >
        <span>确定删除数据：</span>
        <div style="margin-left: 80px;">
            <el-table :data="multipleSelectionData" stripe height="260">
                <el-table-column type="index" width="80" />
                <el-table-column prop="account" label="账号" width="200px" />
                <el-table-column prop="name" label="名称" width="140" />
            </el-table>
        </div>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deleteSelection()">删除</el-button>
        </div>
        </template>
    </el-dialog>

    <!-- 分割线 -->
    <div class="divide"></div>

    <!-- 导入失败的数据 -->
    <span>创建失败</span>
    <span style="font-size: 12px;">（共{{ isExistInCourseUsersData.length }}条）</span>

    <div class="error">
        <!-- 导入失败：账号已存在在课程中 -->
        <div class="table-error1" v-if="isExistInCourseUsersData.length !== 0">
            <div style="font-size: 12px;">错误原因：账号已存在课程中</div>
            <div class="table">
                <el-table ref="errorTableRef" :data="isExistInCourseUsersData" stripe height="300">
                    <el-table-column type="index" width="80" />
                    <el-table-column prop="account" label="账号" width="160px">
                        <template #default="scope">
                            <span v-if="!scope.row.editable">{{ scope.row.account }}</span>
                            <el-input v-else v-model="errorInputAccount"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="140">
                        <template #default="scope">
                            <span v-if="!scope.row.editable">{{ scope.row.name }}</span>
                            <el-input v-else v-model="errorInputName"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 导入失败：账号未创建 -->
        <div class="table-error2" v-if="notExistAccountUsersData.length !== 0">
            <div style="font-size: 12px;">错误原因：账号未创建</div>
            <div class="table" >
                <el-table ref="errorTableRef" :data="notExistAccountUsersData" stripe height="300" @selection-change="handleSelectionChangeError">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" width="80" />
                    <el-table-column prop="account" label="账号" width="160px">
                        <template #default="scope">
                            <span v-if="!scope.row.editable">{{ scope.row.account }}</span>
                            <el-input v-else v-model="errorInputAccount"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" width="140">
                        <template #default="scope">
                            <span v-if="!scope.row.editable">{{ scope.row.name }}</span>
                            <el-input v-else v-model="errorInputName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button size="small" @click="handleEditError(scope.row)">{{ scope.row.editable == true ? '更新' : '编辑' }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="btn">
                <el-button :disabled="errorMultipleSelectionData.length == 0" @click="clearSelectionError()">清除选中</el-button>
                <el-button type="success" @click="exportAndUploadUserRequest(errorMultipleSelectionData)">创建账号并导入选中</el-button>
            </div>
        </div>
    </div>

    <!-- 账号创建失败的数据 -->
    <div class="table-error" v-if="errorListData.length !== 0">
        <span>账号创建失败</span>
        <span style="font-size: 12px;">（共{{ errorListData.length }}条）</span>

        <div class="table">
            <el-table ref="errorTableRef" :data="errorListData" stripe height="300" @selection-change="handleSelectionChangeError2">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="80" />
                <el-table-column prop="account" label="账号" width="160px">
                    <template #default="scope">
                        <span v-if="!scope.row.editable">{{ scope.row.account }}</span>
                        <el-input v-else v-model="errorInputAccount"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名字" width="140">
                    <template #default="scope">
                        <span v-if="!scope.row.editable">{{ scope.row.name }}</span>
                        <el-input v-else v-model="errorInputName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="password" label="密码" width="200px">
                    <template #default>
                        <span>Abc123456</span>
                    </template>
                </el-table-column>
                <el-table-column prop="failMsg" label="导入失败原因" width="140" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEditError(scope.row)">{{ scope.row.editable == true ? '更新' : '编辑' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="btn">
            <el-button :disabled="errorMultipleSelectionData2.length == 0" @click="clearSelectionError()">清除选中</el-button>
            <el-button type="success" @click="exportAndUploadUserRequest(errorMultipleSelectionData2)">重新创建账号并导入选中</el-button>
        </div>
    </div>
   
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/store'
import { fetchAllCourseStudent, fetchUploadStudentToCourse, fetchCreateAndUploadStudentToCourse } from '../../apis/modules/course'
import { ElMessage, genFileId, ElTable } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import axios from 'axios';

const adminStore = useAdminStore();

//点击返回：新建返回列表，编辑返回编辑区
const clickBack = () => {
    if(adminStore.isEditClass == false) {
        //先返回编辑区
        adminStore.setIsShowCourseEdit(false)
        //再返回列表
        adminStore.setIsShowCourseList(true)
    }else {
        adminStore.setIsShowCourseEdit(false)
    }
}
const existStudentData = ref([])

/**
 *    获取课堂的所有学生
 */
const getAllStudentRequest = async () => {
    try {
        const result = await fetchAllCourseStudent({
            courseId: adminStore.activeCourseItem.courseId
        })
        existStudentData.value = result.data;
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isShowUploadFile = ref(false);  //是否显示当前选择文件
const uploadFile = ref();    //用户已选择的文件信息

//用户已选择文件
const handleChangeFile = (file: any, fileList: any) => {
    isShowUploadFile.value = true;
    uploadFile.value = file.raw;
};

const uploadRef = ref<UploadInstance>()

//选择文件超出限制时，覆盖第一个文件
const handleExceed: UploadProps['onExceed'] = (files: any) => {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}

//解析状态
const isAnalyzing = ref(false);
const analyzeListData = ref([])    //已解析的文件数据
const multipleSelectionData = ref([]);    //解析数据中----已选中的表格数据
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

// 设置请求头
const token = localStorage.getItem('Token');
const config = {
  headers: {
    'Content-Type': 'multipart/form-data', // 设置Content-Type为formData类型
    'Authorization': `${token}`, 
  }
}

/**
 *  解析文件
 *  自定义请求
 *  使用自定义请求头，进行身份验证
 */
const handleAnalyzeFile = async () => {
    isAnalyzing.value = true
    //判断文件类型，不是excel则解析失败
    const isExcel = uploadFile.value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // xlsx 格式文件类型
    if (!isExcel) {
        ElMessage.error('只能上传 Excel 文件');
        isAnalyzing.value = false;
        return
    }
    let formData = new FormData();
    formData.append('file', uploadFile.value);

    axios.post('http://localhost:1023/file/parseExcel', formData, config)
        .then((response: any) => {
            ElMessage.success('解析成功');
            isAnalyzing.value = false;

            analyzeListData.value = response.data.data;
            analyzeListData.value.forEach((item: any) => {
                item.editable = false;
            })
        })
        .catch((error: any) => {
            console.error('Error:', error);
        });
}

//编辑已解析数据
const inputAccount = ref('');
const inputName = ref('');
const handleEdit = (row: any) => {
    if(row.editable == false) {
        //点击编辑
        inputAccount.value = row.account;
        inputName.value = row.name;
    }else {
        //点击更新编辑
        row.account = inputAccount.value;
        row.name = inputName.value;
        ElMessage.success('更新成功')
    }
    //更改状态按钮
    row.editable = !row.editable;
}

//删除已解析数据
const handleDelete = (row) => {
    const index = analyzeListData.value.indexOf(row);
    if (index !== -1) {
        analyzeListData.value.splice(index, 1);
    }
}

//清除选中数据
const clearSelection = () => {
    multipleTableRef.value!.clearSelection()
}

const deleteDialogVisible = ref(false);

// 删除选中的数据
const deleteSelection = () => {
    analyzeListData.value = analyzeListData.value.filter((item) => !multipleSelectionData.value.includes(item));
    ElMessage.success('删除成功');

    multipleSelectionData.value = [];
    deleteDialogVisible.value = false;
};

/**
 *  导入选中的数据，接口请求
 *  @param type: 1: 教师  2：学生
 */
 const exportUserRequest = async (data: any) => {
    console.log(data)
    const newData = data.map((item: any) => {
        const modifiedUser = { ...item }; 
        if(item.hasOwnProperty('editable')){
            //删除多余的editable属性，该属性用于处理编辑单项逻辑
            delete modifiedUser.editable;
        }
        return modifiedUser;
    })
    try {
        const result = await fetchUploadStudentToCourse(newData,adminStore.activeCourseItem.courseId);
        successListData.value.push(...result.data.successUsers);

        isExistInCourseUsersData.value = result.data.isExistInCourseUsers;
        notExistAccountUsersData.value = result.data.notExistAccountUsers;

        //增加editable字段，供单行编辑使用
        notExistAccountUsersData.value.forEach((item: any) => {
            item.editable = false;
        });

        if(successListData.value.length > 0 && (isExistInCourseUsersData.value.length > 0 || notExistAccountUsersData.value.length > 0)){
            return ElMessage.error('部分导入失败！')
        } else if((isExistInCourseUsersData.value.length == 0 || notExistAccountUsersData.value.length == 0) && successListData.value.length > 0 ) {
            return ElMessage.success('全部导入成功！');
        }else if(successListData.value.length == 0) {
            return ElMessage.error('全部导入失败！')
        }
    } catch (error) {
        ElMessage.error('导入失败');
    }
}

/**
 *  创建学生账号并导入课程
 * @param val 
 */
 const exportAndUploadUserRequest = async (data: any) => {
    const newData = data.map((item: any) => {
        const modifiedUser = { ...item }; 
        if(item.hasOwnProperty('editable')){
            //删除多余的editable属性，该属性用于处理编辑单项逻辑
            delete modifiedUser.editable;
        }
        if(item.hasOwnProperty('failMsg')){
            //删除导入失败列表中，多余的failMsg属性，该属性用于展示错误信息
            delete modifiedUser.failMsg;
        }
        return modifiedUser;
    })
    try {
        const result = await fetchCreateAndUploadStudentToCourse(newData,adminStore.activeCourseItem.courseId);
        //创建账号并导入成功的数据，加入到首次导入成功列表中
        successListData.value.push(...result.data.successUsers);
        //创建账号失败的数据，展示在新错误列表中
        errorListData.value = result.data.failUsers;

        //增加editable字段，供编辑使用
        errorListData.value.forEach((item: any) => {
            item.editable = false;
        })

        if(successListData.value.length > 0 && errorListData.value.length > 0){
            return ElMessage.error('部分导入失败！')
        } else if(errorListData.value.length == 0 && successListData.value.length > 0) {
            return ElMessage.success('全部导入成功！');
        }else if(successListData.value.length == 0) {
            return ElMessage.error('全部导入失败！')
        }
    } catch (error) {
        ElMessage.error('导入失败');
    }
}

//多选
const handleSelectionChange = (val: any) => {
  multipleSelectionData.value = val;
}

const successListData = ref([]);   //导入成功的数据
const isExistInCourseUsersData = ref([]);    //导入失败的数据：账号已经存在于课程中
const notExistAccountUsersData = ref([]);    //导入失败的数据：用户账号不存在
const errorListData = ref([]);    //导入失败的数据

const errorMultipleSelectionData = ref([]);  //导入失败选中的数据
const errorMultipleSelectionData2 = ref([]);  //账号创建失败失败选中的数据
const errorTableRef = ref<InstanceType<typeof ElTable>>()

const handleSelectionChangeError = (items: any) => {
    errorMultipleSelectionData.value = items;
}
const handleSelectionChangeError2 = (items: any) => {
    errorMultipleSelectionData2.value = items;
}

//编辑单行操作--对于首次导入失败的数据
const errorInputAccount = ref();
const errorInputName = ref();
const handleEditError = (row: any) => {
    if(row.editable == false) {
        //点击编辑
        errorInputAccount.value = row.account;
        errorInputName.value = row.name;
    }else {
        //点击更新编辑
        row.account = errorInputAccount.value;
        row.name = errorInputName.value;
        ElMessage.success('更新成功')
    }
    //更改状态按钮
    row.editable = !row.editable;
}


//清除选中数据
const clearSelectionError = () => {
    errorTableRef.value!.clearSelection()
}

onMounted(() => {
    getAllStudentRequest();
})
</script>

<style scoped lang="scss">
.back {
    font-size: 14px;
    cursor: pointer;
}
.back:hover {
    color: #4186ff;
}
.info {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    margin-top: 10px;
    .info-title {
        font-size: 18px;
        font-weight: 600;
    }
}
.student-exit {
    display: flex;
    justify-content: center;
    min-height: 200px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 8px;
}
//上传按钮
.upload-demo {
    margin-top: 20px;
    ::v-deep .el-upload-dragger {
        padding: 20px;
    }
    .el-upload__text {
        font-size: 12px;
    }
    .iconfont {
        font-size: 38px;
        color: #4186ff;
    }
}
.file-btn {
    display: flex;
    margin-top: 20px;
    padding-left: 20px;
    margin-right: 40px;
    justify-content: space-between;
    align-items: center;
    .file {
        display: flex;
        align-items: center;
        .iconfont {
            font-size: 30px;
            color: #4186ff;
            margin-right: 10px;
        }
        .name {
            font-size: 14px;
        }
        .size {
            font-size: 10px;
        }
    }
}
.divide {
    margin-top: 10px;
    height: 1px;
    background-color: #ccc;
}

//已解析的数据
.table-analyze, .table-success {
    margin-top: 20px;
    .table {
        margin-top: 20px;
        display: flex;
        padding: 0px 80px;
        justify-content: center;
    }
}

.multiple-btn {
    display: flex;
    margin: 20px;
    margin-right: 80px;
    justify-content: flex-end;
}
.error {
    display: flex;
    margin-top: 10px;
    gap: 20px;
    .btn {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
        margin-top: 10px;
    }
}
</style>