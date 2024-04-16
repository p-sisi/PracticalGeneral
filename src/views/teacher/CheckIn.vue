<template>
    <!-- 签到列表 -->
    <div class="list" v-if="teacherStore.isShowCheck">
        <!-- 头部面包屑及按钮 -->
        <div class="bread-btn flex-row">
            <span>签到列表</span>
            <el-button type="success" :icon="Plus" @click="newDrawerVisible = true">发布签到</el-button>
        </div>

        <!-- 列表 -->
        <div class="list-item flex-column" v-for="item in checkListData" :key="item.id" @click="clickCheckItem(item)">
            <div class="list-item-header flex-row">
                <div class="title">{{ item.title }}</div>
                <div class="status">
                    <span class="status-ing" v-if="new Date(item.deadTime).getTime() > new Date().getTime()">进行中</span>
                    <span class="status-end" v-else>已截止</span>
                </div>
            </div>
            <div class="list-item-num flex-row">
                <div>{{ item.attendCount }} / {{ commonStore.activeClass.stuNum }}</div>
            </div>
            <div class="list-item-time flex-row">
                <span>发布：{{ item.createTime }}</span>
                <span>截止：{{ item.deadTime }}</span>
            </div>
        </div>
    </div>

    <!-- 签到详情 -->
    <div class="detail" v-else>
        <!-- 头部面包屑 -->
        <div class="bread">
            <span class="bread-back" @click="clickBreadList()">签到列表 > </span>
            <span>详情</span>
        </div>

        <div class="detail-item">
            <!-- 签到标题及按钮 -->
            <div class="title-btn flex-row">
                <div class="title">
                    <span>{{ teacherStore.activeCheck.title }}</span>
                    
                </div>
                <span style="font-size: 14px" v-if="new Date(teacherStore.activeCheck.deadTime).getTime() > new Date().getTime()">签到码：<span style="color:#4186ff;font-size: 20px">{{ teacherStore.activeCheck.signCode }}</span></span>
                <div>
                    <el-button v-if="new Date(teacherStore.activeCheck.deadTime).getTime() > new Date().getTime()" type="success" @click="delayTimeDialogVisible = true">延时</el-button>
                    <div v-else class="title-stop">已截止</div>
                    <el-button v-if="new Date(teacherStore.activeCheck.deadTime).getTime() > new Date().getTime()" type="danger" @click="stopDialogVisible = true">停止签到</el-button>

                </div>
            </div>
            <!-- 时间 -->
            <div class="time">
                <span>发布：{{ teacherStore.activeCheck.createTime }}</span>
                <span>截止：{{ teacherStore.activeCheck.deadTime}}</span>
                <span>签到类型：{{ teacherStore.activeCheck.signType ? '数字签到' : '按钮签到' }}</span>
            </div>
        </div>

        <!-- 分割线 -->
        <div class="divide"></div>

        <!-- 签到统计 -->
        <div class="total flex-row">
            <div class="total-All flex-column">
                <span>{{ totalData.All }}</span>
                <span style="font-size: 12px">总人数</span>
            </div>
            <div class="total-Chu flex-column">
                <span style="color: #67c23a;">{{ totalData.Chu }}</span>
                <span style="font-size: 12px">出勤</span>
            </div>
            <div class="total-Que flex-column">
                <span style="color: #f56c6c;">{{ totalData.Que }}</span>
                <span style="font-size: 12px">缺勤</span>
            </div>
            <div class="total-Chi flex-column">
                <span style="color: #fbc21d;">{{ totalData.Chi }}</span>
                <span style="font-size: 12px">迟到</span>
            </div>
            <div class="total-Qin flex-column">
                <span style="color: #fbc21d;">{{ totalData.Qin }}</span>
                <span style="font-size: 12px">请假</span>
            </div>
        </div>

        <!-- 学生签到表格 -->
        <div class="table">
            <!-- 头部选项及搜索 -->
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
            <!-- 表格 -->
            <div class="detail-list-table flex-row" >
                <el-table 
                    :data="tableList" 
                    style="width: 92%" 
                    height="450" 
                    >
                    <el-table-column prop="stuName" label="姓名" width="200" align="center"/>
                    <el-table-column prop="signTime" label="签到时间" width="340" sortable align="center">
                        <template #default="scope">
                            <span v-if="scope.row.signTime != null">{{ scope.row.signTime }}</span>
                            <span v-else>未签到</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="signStatus" label="状态" >
                        <template #default="scope" >
                            <div @click="clickTableStatus(scope.row)">
                                <div v-if="scope.row.signStatus == 0" class="Que table-status">缺勤</div>
                                <div v-else-if="scope.row.signStatus == 1" class="Chu table-status">出勤</div>
                                <div v-else-if="scope.row.signStatus == 2" class="Qin table-status">请假</div>
                                <div v-else class="Chi table-status">迟到</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

    <!-- 发布签到弹窗 -->
    <el-drawer 
        v-model="newDrawerVisible" 
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
                            <el-input v-model="newFromData.title" />
                        </el-form-item>
                        <el-form-item label="签到类型" prop="signType">
                            <el-radio-group v-model="newFromData.signType">
                                <el-radio value="1">数字签到</el-radio>
                                <el-radio value="0">按钮签到</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="签到码" prop="signCode" v-if="newFromData.signType == '1'">
                            <el-input v-model="newFromData.signCode" maxlength="6"/>
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
                    <el-button  type="primary"  @click="submitFormNew(newFormRef)">发布签到</el-button>
                </div>
            </div>
    </el-drawer>

    <!-- 延时对话框 -->
    <el-dialog
        v-model="delayTimeDialogVisible"
        title="提示"
        width="400"
        >
        <span style="margin-left: 50px;">延时：</span>
        <span style="margin-right:10px;"><el-input v-model="delayInput" style="width: 50px" placeholder="" /></span>
        <span>
            <el-select v-model="delaySelect" placeholder="" style="width: 100px;">
                <el-option label="分钟" value="60000" />
                <el-option label="小时" value="3600000" />
            </el-select>
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="delayTimeDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="delayCheckRequest()" color="#4186ff">延迟</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 停止签到对话框 -->
    <el-dialog
        v-model="stopDialogVisible"
        title="提示"
        width="400"
        >
        <span style="margin-left: 50px;">确定停止签到?</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="stopDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="stopCheckRequest()" color="#4186ff">停止</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 修改签到状态确认框 -->
    <el-dialog
        v-model="editDialogVisible"
        title="修改签到状态"
        width="400"
        >
        <span style="margin-left: 50px;">当前状态：<span style="font-size: 18px;color:#4186ff;">{{ studentCheckStatus }}</span></span>
        <div style="margin-left: 50px;margin-top: 20px;" class="flex-row">
            <span>修改为：</span>
            <el-select v-model="studentCheckNewStatus" placeholder="请选择状态" style="width: 100px;">
                <el-option label="缺勤" value="缺勤" />
                <el-option label="出勤" value="出勤" />
                <el-option label="请假" value="请假" />
                <el-option label="迟到" value="迟到" />
            </el-select>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleFirstCommand()" color="#4186ff">确定</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 修改签到状态确认框 二次弹窗-->
    <el-dialog
        v-model="editDialogVisible2"
        title="修改签到状态"
        width="300"
        >
        <span style="margin-left:50px">确定将&nbsp;&nbsp;<span style="font-size:18px;">{{ studentCheckData.stuName }}&nbsp;&nbsp;</span>签到状态</span>
        <div style="display:flex;align-items:center;margin-left:80px;margin-top:10px">
            <span style="font-size:18px;color:#82cc5c;">{{ studentCheckStatus }}</span>
            <span><el-icon><Right /></el-icon></span>
            <span style="font-size:18px;color:#f56c6c;">{{ studentCheckNewStatus }}</span>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editDialogVisible2 = false">取消</el-button>
                <el-button type="primary" @click="editCheckRequest()" color="#4186ff">修改</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, Ref, computed } from 'vue';
import { Plus, Search,Right } from '@element-plus/icons-vue';
import { type FormRules, type FormInstance, ElMessage } from 'element-plus';
import { fetchGetAllCheckTech, fetchNewCheck, fetchStopCheck, fetchCheckStatusList, fetchEditCheckStatus, fetchDelayCheck } from '../../apis/modules/check'
import { useCommonStore, useTeacherStore } from '@/store';
import { Check_Tech, Check_Tech_Status } from '../../content/check'
import { getStringTime } from '../../util/index'

onMounted(() => {
    getCheckList()
    if(Object.keys(teacherStore.activeCheck).length !== 0) {
        getStudentCheck(teacherStore.activeCheck.id)
    }
})

const commonStore = useCommonStore();
const teacherStore = useTeacherStore();

//点击详情页面包屑"签到列表"
const clickBreadList = () => {
    teacherStore.setIsShowCheck(true);
    getCheckList()
}

const newDrawerVisible = ref(false);
const newFormRef = ref<FormInstance>()

const newFromData = reactive({
    title: '',
    deadTime: '',
    signType: '',
    signCode: '',
})

const rulesForm = reactive<FormRules>({
    title: [
        { required: true, message: '请输入签到标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入作业内容', trigger: 'blur' },
    ],
    deadTime: [
        { required: true, message: '请选择截止时间', trigger: 'blur' },
    ]
})

/**
 *  发布签到请求
 */
 const newCheckRequest = async () => {
    try {
       const params = {
            courseId: commonStore.activeClass.courseId,
            deadTime: new Date(newFromData.deadTime).getTime(),
            signCode: parseInt(newFromData.signCode),
            signType: parseInt(newFromData.signType),
            title: newFromData.title,
       }
       await fetchNewCheck(params);
       ElMessage.success('发布成功');
       newDrawerVisible.value = false;
       getCheckList()
    } catch (error: any) {
        console.log(error)
    }
}

const submitFormNew = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid:any, fields:any) => {
        if (valid) {
            newCheckRequest();
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

//签到情况统计
const totalData = computed(() => {
    return {
        All: commonStore.activeClass.stuNum,
        Chu: tableList.value.filter((item:any) => item.signStatus == 1).length,
        Que: tableList.value.filter((item:any) => item.signStatus == 0).length,
        Qin: tableList.value.filter((item:any) => item.signStatus == 2).length,
        Chi: tableList.value.filter((item:any) => item.signStatus == 3).length
    }
})

const checkListData: Ref<Check_Tech[]> = ref([]);

/**
 *  获取签到列表请求
 */
const getCheckList = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetAllCheckTech(params);
        checkListData.value = result.data;
    } catch (error: any) {
        console.log(error)
    }
}

const tableList: Ref<Check_Tech_Status[]> = ref([]);    //学生签到情况表格数据
const tableListAll: Ref<Check_Tech_Status[]> = ref([]);  //暂存数据

/**
 *  获取学生签到情况
 */
const getStudentCheck = async (checkId: number) => {
    try {
        const params = {
            attendanceId: checkId,
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchCheckStatusList(params);
        tableList.value = result.data;
        tableListAll.value = result.data;

    } catch (error: any) {
       ElMessage.error(error.message)
    }
}

//点击签到item
const clickCheckItem = (item: any) => {
    //展示详情页
    teacherStore.setIsShowCheck(false);
    teacherStore.setActiveCheck(item);
    teacherStore.setActiveCheckId(item.id)

    getStudentCheck(item.id);
}

//停止签到
const stopDialogVisible = ref(false);
const stopCheckRequest = async () => {
    try {
        const params = {
            attendanceId: teacherStore.activeCheck.id
        }
        await fetchStopCheck(params);
        ElMessage.success('停止签到成功');
        stopDialogVisible.value = false;
    } catch (error: any) {
        console.log(error)
        stopDialogVisible.value = false;
    }
}

//延时签到
const delayTimeDialogVisible = ref(false);

const delayInput = ref('');
const delaySelect = ref();

const newDelayTime = computed(() => {
    return new Date(teacherStore.activeCheck.deadTime).getTime() + (parseInt(delayInput.value) * parseInt(delaySelect.value));
})

const delayCheckRequest = async () => {
    if(delayInput.value === '' || delaySelect.value === '') return ElMessage.warning('请输入延时时间')
    try {
        const params = {
            attendanceId: teacherStore.activeCheck.id,
            date: newDelayTime.value
        }
        await fetchDelayCheck(params)
        ElMessage.success('延时签到成功');
        //设置store中数据
        teacherStore.setActiveCheckDeadTime(getStringTime(newDelayTime.value));

        delayTimeDialogVisible.value = false;
        delayInput.value = '';
        delaySelect.value = '';
    } catch (error) {
        ElMessage.error('延时签到失败');
        delayTimeDialogVisible.value = false;
    }
}

//签到情况分类
const radio = [
    {
        label: '全部',
        status: 99,
    },
    {
        label: '出勤',
        status: 1,
    },
    {
        label: '缺勤',
        status: 0,
    },
    {
        label: '请假',
        status: 2,
    },
    {
        label: '迟到',
        status: 3
    }
]

//切换签到状态
const activeRadio = ref('全部') 
const radioChange = (label: any) => {
    if (activeRadio.value === label )  return 
    tableList.value = tableListAll.value;

    if(label === '全部') {
        tableList.value = tableListAll.value;
    } else if(label === '出勤') {
        tableList.value = tableList.value.filter((item:any) => item.signStatus == 1);
    } else if(label === '缺勤'){
        tableList.value = tableList.value.filter((item:any) => item.signStatus == 0);
    } else if(label === '请假'){
        tableList.value = tableList.value.filter((item:any) => item.signStatus == 2);
    } else {
        tableList.value = tableList.value.filter((item:any) => item.signStatus == 3);
    }

    activeRadio.value = label;
}

//搜索
const searchInput = ref('');
const handleSearchDiscuss = () => {
    activeRadio.value = '全部'
    if(searchInput.value === '') return tableList.value = tableListAll.value;

    tableList.value = tableListAll.value;
    tableList.value = tableList.value.filter((item:any) => {
        return item.stuName.includes(searchInput.value)  
    });
}

//修改签到状态
const editDialogVisible = ref(false);
const editDialogVisible2 = ref(false);   //二次确认框

const studentCheckData = ref<Check_Tech_Status>()

const studentCheckStatus = computed(() => {
    if(studentCheckData.value?.signStatus === 1) return '出勤'
    if(studentCheckData.value?.signStatus === 0) return '缺勤'
    if(studentCheckData.value?.signStatus === 2) return '请假'
    if(studentCheckData.value?.signStatus === 3) return '迟到'
})

const studentCheckNewStatus = ref('');

const stringGetIntStatus = (status: string) => {
    if(status == '出勤') return 1
    if(status == '缺勤') return 0
    if(status == '请假') return 2
    if(status == '迟到') return 3
}

//点击提交状态
const clickTableStatus = (item: any) => {
    editDialogVisible.value = true;

    studentCheckData.value = item;
}

//第一次点击修改弹窗
const handleFirstCommand = () => {
    if(studentCheckStatus.value == studentCheckNewStatus.value) return ElMessage.warning('状态未修改')
    editDialogVisible2.value = true
}

/**
 *  修改学生签到状态请求
 */
const editCheckRequest = async () => {
    try {
        const params = {
            attendanceId: teacherStore.activeCheck.id,
            stuId: studentCheckData.value.stuId,
            status: stringGetIntStatus(studentCheckNewStatus.value)
        }
        console.log(params)
        await fetchEditCheckStatus(params);

        editDialogVisible.value = false;
        editDialogVisible2.value = false;

        getStudentCheck(teacherStore.activeCheck.id)
    } catch (error:any) {
        ElMessage.error(error.message)
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
.font12 {
    font-size: 12px;
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
//签到列表
.list {
   .bread-btn {
        margin-right: 30px;
        justify-content: space-between;
        span {
            font-size: 14px;
        }
   }
   .list-item {
        padding: 10px 20px 10px 14px;
        margin-bottom: 20px;
        margin-top: 20px;
        justify-content: space-between;
        border: 1px solid #e9e9e9;
        border-radius: 8px;
        cursor: pointer;
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
        }
        &-num {
            margin-left: 20px;
            margin-right: 20px;
            align-items: center;
            justify-content: flex-end;
            font-size: 24px;
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

//签到详情
.detail {
    .bread {
        font-size: 14px;
        .bread-back {
            font-weight: 600;
            cursor: pointer;
        }
    }
    .detail-item {
        margin-top: 10px;
        padding: 10px 20px;
        border-radius: 8px;
        .title-btn {
            margin-left: 10px;
            margin-right: 10px;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
        }
        .title-stop {
            color: #f56c6c;
        }
        .time {
            margin-left: 10px;
            margin-top: 10px;
            font-size: 13px;
            color: #999;
            span{
                margin-right: 80px;
            }
        }
    }
    .divide {
        width: 90%;
        height: 1px;
        margin: 0 auto;
        background-color: #ccc;
    }
    .total {
        justify-content: space-between;
        align-items: center;
        padding: 10px 60px;
        margin-top: 10px;
        background-color: #f8fbff;
        border-radius: 8px;
        font-size: 22px;
        .total-All {
            align-items: center;
        }
        .total-Chu {
            align-items: center;
        }
        .total-Que {
            align-items: center;
        }
        .total-Chi {
            align-items: center;
        }
        .total-Qin {
            align-items: center;
        }
    }
    .table {
        .detail-list-header {
            justify-content: space-between;
            margin-top: 40px;
        }
        .detail-list-table {
            justify-content: center;
            padding: 20px 0px;
            .table-status {
                width: 60px;
                padding: 2px 14px;
                border-radius: 4px;
                cursor: pointer;
            }
            .Que {
                color: #f56c6c;
                background-color: #fef0f0;
            }
            .Qin,.Chi {
                color: #eebe77;
                background-color: #fdf6ec;
            }
            .Chu{
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