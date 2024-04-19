<template>
    <!-- 返回 -->
    <div>
        <span class="back-to" @click="clickOneCreate()">< 返回单次创建教师账号</span>
        <span class="title">批量导入教师账号</span>
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
        <div class="el-upload__text">
            将文件拖拽到此处，或点击上传
        </div>
        <div class="el-upload__text">仅支持Excel文件，且文件中包含两列数据：<span style="color: #4186ff">账号、名称</span></div>
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
    <div class="table-analyze" v-if="analyzeListData.length != 0">
        <span >已解析数据</span>
        <span style="font-size: 12px;">（共{{ analyzeListData.length }}条）</span>

        <div class="table">
            <el-table ref="multipleTableRef" :data="analyzeListData" stripe height="350" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" width="80" />
                <el-table-column prop="account" label="账号" width="200px">
                    <template #default="scope">
                        <span v-if="!scope.row.editable">{{ scope.row.account }}</span>
                        <el-input v-else v-model="inputAccount"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="140">
                    <template #default="scope">
                        <span v-if="!scope.row.editable">{{ scope.row.name }}</span>
                        <el-input v-else v-model="inputName"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="password" label="密码" width="200px">
                    <template #default>
                        <span>Abc123456</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
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

    <!-- 导入成功的数据 -->
    <div class="table-success" v-if="successListData.length !== 0">
        <span>创建成功</span>
        <span style="font-size: 12px;">（共{{ successListData.length }}条）</span>

        <div class="table">
            <el-table :data="successListData" stripe height="200">
                <el-table-column type="index" width="80" />
                <el-table-column prop="account" label="账号" width="200px" />
                <el-table-column prop="name" label="名称" width="140" />
                <el-table-column prop="password" label="密码" width="200px">
                    <template #default>
                        <span>Abc123456</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <!-- 导入失败的数据 -->
    <div class="table-error" v-if="errorListData.length !== 0">
        <span>创建失败</span>
        <span style="font-size: 12px;">（共{{ errorListData.length }}条）</span>

        <div class="table">
            <el-table ref="errorTableRef" :data="errorListData" stripe height="300" @selection-change="handleSelectionChangeError">
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
            <el-button :disabled="errorMultipleSelectionData.length == 0" @click="clearSelectionError()">清除选中</el-button>
            <el-button type="success" @click="exportUserRequest(errorMultipleSelectionData)">重新导入选中</el-button>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAdminStore } from '@/store'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { ElMessage, genFileId, ElTable  } from 'element-plus'
import { fetchSignUpMultiple } from '../../apis/modules/user'
import axios from 'axios';

const adminStore = useAdminStore();

//点击单词创建教师账号
const clickOneCreate = () => {
    //展示编辑新建页面
    adminStore.setIsShowTeacherList(false)
    //展示单次创建
    adminStore.setIsShowMultipleCreate(false);
    //设为新建状态
    adminStore.setIsEditTeacher(false)
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

const multipleSelectionData = ref([]);    //解析数据中----已选中的表格数据
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

//多选
const handleSelectionChange = (val: any) => {
  multipleSelectionData.value = val;
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
            //删除多余的failMsg属性，该属性用于处理编辑单项逻辑
            delete modifiedUser.editable;
            if(item.hasOwnProperty('failMsg')){
                //删除导入失败列表中，多余的failMsg属性，该属性用于展示错误信息
                delete modifiedUser.failMsg;
            }
        }
        return modifiedUser;
    })
    console.log('即将导入的数据',data)
    newData.forEach((item: any) => {
        item.userType = 1;
        item.password = 'Abc123456'
    });
    try {
        const result = await fetchSignUpMultiple(newData);
        successListData.value.push(...result.data.successUsers);
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

const successListData = ref([]);   //导入成功的数据
const errorListData = ref([]);    //导入失败的数据

const errorMultipleSelectionData = ref([]);  //导入失败选中的数据
const errorTableRef = ref<InstanceType<typeof ElTable>>()

const handleSelectionChangeError = (items: any) => {
    errorMultipleSelectionData.value = items;
}

//编辑单行操作
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
</script>

<style scoped lang="scss">
.back-to {
    font-size: 14px;
    cursor: pointer;
}
.back-to:hover {
    color: #4186ff;
}

.title {
    font-weight: 600;
    margin-left: 320px;
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
    justify-content: flex-end;
}

.table-error {
    margin-top: 20px;
    .table {
        margin-top: 20px;
        display: flex;
        padding: 0px 80px;
        justify-content: center;
    }
    .btn {
        display: flex;
        margin: 20px;
        justify-content: flex-end;
    }
}


</style>