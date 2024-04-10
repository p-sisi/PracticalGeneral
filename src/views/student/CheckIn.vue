<template>
    <div class="check">
        <!-- 统计 -->
        <div class="check-header">
            <div class="item">
                <div>{{ checkTotal.all }}</div>
                <span>签到数</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color: #67c23a;">{{ checkTotal.CHU }}</div>
                <span>出勤</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color:#f56c6c;">{{ checkTotal.QUE }}</div>
                <span>缺勤</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color:#ffc921;">{{ checkTotal.CHI }}</div>
                <span>迟到</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color:#ffc921;">{{ checkTotal.QIN }}</div>
                <span>请假</span>
            </div>
        </div>

        <!-- 记录 -->
        <div class="check-list">
            <div style="display:flex;justify-content:space-between;">
                <span>考勤记录</span>
                <div style="display:flex;font-size:12px;cursor: pointer;" @click="handleRefresh">
                    <el-icon :class="{ 'is-loading' : isRefreshLoading }" style="display: block;margin-top: 4px;margin-right: 4px;">
                        <Loading />
                    </el-icon>
                    <span>刷新</span>
                </div>
            </div>
            <div 
                class="item" 
                v-for="item in checkListData" 
                :key="item.id"
                :class="{'isChu': item.mySignStatus == 1,'isQue' : item.mySignStatus == 0,'isChi':item.mySignStatus == 3,'isQin': item.mySignStatus == 2}">
                <div class="item-info">
                    <div>{{ item.title }}</div>
                    <span>签到类型：{{ item.signType == 1 ? '数字签到' : '按钮签到' }}</span>
                    <span>发起：{{ item.createTime }}</span>
                    <span>截止：{{ item.deadTime }}</span>
                    <span v-if="item.mySignStatus !== 1">未签到</span>
                    <!-- 只有出勤才显示签到时间 -->
                    <span v-else>签到：{{ item.signTime }}</span>
                </div>
                <div class="item-status">
                    <span v-if="item.mySignStatus == 1" style="color:#67c23a;">出勤</span>
                    <span v-else-if="item.mySignStatus == 2" style="color:#ffc921;">请假</span>
                    <span v-else-if="item.mySignStatus == 3" style="color:#ffc921;">迟到</span>
                    <span v-else-if="item.mySignStatus == 0 && new Date(item.deadTime) < new Date()" style="color:#f56c6c;">缺勤</span>
                    <el-button type="success" round v-else-if="item.mySignStatus == 0 && new Date(item.deadTime) > new Date()" @click="handleCheckByBtn(item)">签到</el-button>
                </div>
            </div>
        </div>

        <!-- 签到弹窗 -->
        <el-dialog v-model="dialogTableVisible" :title="checkTitle" width="400" center @opened="inputCount1Ref.focus()" @closed="handleDialogClose">
            <div class="dialogNumber">
                <el-input ref="inputCount1Ref" v-model="inputCount1" size="large" maxlength="1" @input="handleInput1"/>
                <el-input ref="inputCount2Ref" v-model="inputCount2" size="large" maxlength="1" @input="handleInput2"/>
                <el-input ref="inputCount3Ref" v-model="inputCount3" size="large" maxlength="1" @input="handleInput3"/>
                <el-input ref="inputCount4Ref" v-model="inputCount4" size="large" maxlength="1" @input="handleInput4"/>
            </div>
            <div style="margin: 20px 0px 20px 42%;">
                <el-button type="success" round  @click="handleCheckByCode()">签 到</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed } from 'vue';
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { fetchGetAllCheck, fetchCheck } from '../../apis/modules/check';
import { Check } from '../../content/check';
import { useCommonStore } from '@/store';

onMounted(() => {
    getCheckListRequest();
})

const commonStore = useCommonStore();

const checkListData: Ref<Check[]> = ref([]);

/*
*   获取签到列表
*/
const getCheckListRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetAllCheck(params);
        checkListData.value = result.data;

        //结束刷新
        isRefreshLoading.value = false;
    } catch (error) {
        console.log(error)
    }
}

//签到情况统计
const checkTotal = computed(()=> {
    return {
        all: checkListData.value.length,  //签到总数
        CHU: checkListData.value.filter((item:any) => item.mySignStatus == 1).length,  //出勤
        QUE: checkListData.value.filter((item:any) => item.mySignStatus == 0).length,  //缺勤
        QIN: checkListData.value.filter((item:any) => item.mySignStatus == 2).length,  //请假
        CHI: checkListData.value.filter((item:any) => item.mySignStatus == 3).length,  //迟到
    }
})

//刷新
const isRefreshLoading = ref(false);
const handleRefresh = () => {
    if(isRefreshLoading.value == true) return
    isRefreshLoading.value = true;
    getCheckListRequest();
    ElMessage.success('刷新成功');
}


/*
*   签到请求封装
*   @param attendanceId 签到id  singCode 签到码
*/
const CheckRequest = async (attendanceId: number, singCode: number) => {
    try {
        const params = {
            attendanceId,
            singCode
        }
        await fetchCheck(params);
        ElMessage.success('签到成功')
        getCheckListRequest();
    } catch (error: any) {
        ElMessage.error(error)
    }
}

const checkTitle = ref('');   //弹窗标题
const checkId = ref();    //点击的签到id
const dialogTableVisible = ref(false);

//点击“签到”按钮
const handleCheckByBtn = (item: any) => {
    console.log(item)
    if(item.signType == 0) {
        //按钮签到
        CheckRequest(item.id,0);
        return 
    }
    //数字签到
    dialogTableVisible.value = true;
    checkTitle.value = item.title;
    checkId.value = item.id;
}

const inputCount1 = ref();
const inputCount2 = ref();
const inputCount3 = ref();
const inputCount4 = ref();
const inputCount1Ref = ref(null);
const inputCount2Ref = ref(null);
const inputCount3Ref = ref(null);
const inputCount4Ref = ref(null);

const handleInput1 = (value:string) => {
    if(value.length == 1) {
        inputCount2Ref.value.focus();
    }
}
const handleInput2 = (value: any) => {
    if(value.length == 1) {
        inputCount3Ref.value.focus();
    }
}
const handleInput3 = (value:any) => {
    if(value.length == 1) {
        inputCount4Ref.value.focus();
    }
}
const handleInput4 = (value:any) => {
    if(value.length == 1) {
        inputCount4Ref.value.blur();
    }
}

const handleCheckByCode = () => {
    const code = parseInt(inputCount1.value + inputCount2.value + inputCount3.value + inputCount4.value);
    console.log(code,typeof code)
    CheckRequest(checkId.value,code);
}

const handleDialogClose = () => {
    inputCount1.value = null;
    inputCount2.value = null;
    inputCount3.value = null;
    inputCount4.value = null;
}
</script>

<style scoped lang="scss">
.check {
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100px;
        padding: 20px 60px;
        background-color: #f4f8ff;
        border-radius: 8px;
        box-sizing: border-box;
        .item {
            div {
                font-size: 30px;
            }
            span {
                font-size: 12px;
                color: #999;
            }
        }
        .divide {
            height: 40px;
            width: 1px;
            background-color: #999;
        }
    }

    &-list {
        margin-top: 10px;
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 80px;
            margin: 10px 0px;
            padding: 8px 20px;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            box-sizing: border-box;
            &-info {
                span {
                    margin-right: 30px;
                    font-size: 12px;
                    color: #999;
                }
            }
            &-status {
                font-size: 18px;
            }
        }
        .isChu {
            background: linear-gradient(to bottom right, #f2fbeb, #fff);
        }
        .isQue {
            background: linear-gradient(to bottom right, #f7c4c447, #fff);
        }
    }

    .dialogNumber {
        display: flex;
        flex-flow: row nowrap  ;
        gap: 10px;
        padding: 10px 40px;
        ::v-deep .el-input__inner {
            font-size: 30px;
        }
        ::v-deep .el-input__wrapper {
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.0);
            border-bottom: 1px solid #ccc;
            border-radius: 0px;
            padding: 1px 22px;
        }
    }
}
::v-deep .el-dialog__header {
    margin-left: 32px;
}
</style>