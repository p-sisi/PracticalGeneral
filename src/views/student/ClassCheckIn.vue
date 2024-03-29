<template>
    <div class="check">
        <!-- 统计 -->
        <div class="check-header">
            <div class="item">
                <div>10</div>
                <span>签到数</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color: #67c23a;">7</div>
                <span>出勤</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color:#f56c6c;">1</div>
                <span>缺勤</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color:#ffc921;">1</div>
                <span>迟到</span>
            </div>
            <div class="divide"></div>
            <div class="item">
                <div style="color:#ffc921;">1</div>
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
                v-for="item in STUDENT_SIGN_IN_DATA" 
                :key="item.id"
                :class="{'isChu': item.status == 1,'isQue' : item.status == 0,'isChi':item.status == 2,'isQin': item.status == 3}">
                <div class="item-info">
                    <div>{{ item.title }}</div>
                    <span>签到类型：{{ item.type == 1 ? '数字签到' : '按钮签到' }}</span>
                    <span>发起：{{ item.createTime }}</span>
                    <span>截止：{{ item.endTime }}</span>
                    <span v-if="item.status !== 1">未签到</span>
                    <!-- 只有出勤才显示签到时间 -->
                    <span v-else>签到：{{ item.signTime }}</span>
                </div>
                <div class="item-status">
                    <span v-if="item.status == 1" style="color:#67c23a;">出勤</span>
                    <span v-else-if="item.status == 0" style="color:#f56c6c;">缺勤</span>
                    <span v-else-if="item.status == 2" style="color:#ffc921;">迟到</span>
                    <el-button type="success" round v-else-if="item.status == 4" @click="handleCheck(item)">签到</el-button>
                    <span v-else style="color:#ffc921;">请假</span>
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
                <el-button type="success" round  @click="handleCheckIn(item)">签 到</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, } from 'vue';
import { STUDENT_SIGN_IN_DATA } from '../../content/student'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';


const isRefreshLoading = ref(false);

const handleRefresh = () => {
    if(isRefreshLoading.value == true) return
    //TODO:刷新，重新请求签到


    //刷新结束
    isRefreshLoading.value = true;
}

const dialogTableVisible = ref(false);
const checkTitle = ref('');

//签到
const handleCheck = (item: any) => {
    if(item.type == '按钮签到') {
        ElMessage.success('用签到成功');
        //重新请求签到列表
        return 
    }

    dialogTableVisible.value = true;
    checkTitle.value = item.title;

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
        handleCheckIn();
    }
}

const handleCheckIn = () => {
    
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