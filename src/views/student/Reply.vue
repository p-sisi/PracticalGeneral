<template>
    <div class="title">我的结课答辩</div>

    <!-- 答辩状态 -->
    <div class="status">
        <div class="status-step">
            <el-steps style="max-width: 600px" :space="200" :active="replyStatus" finish-status="success">
                <el-step title="未申请" />
                <el-step title="待通过" />
                <el-step title="已拒绝" v-if="replyData?.status === 1"/>
                <el-step title="等待答辩" />
                <el-step title="完成结课答辩" />
            </el-steps>
        </div>
        <!-- 申请答辩 -->
        <div class="select-time" >
            <span>
                <span>选择答辩时间：</span>
                <!-- 初始化答辩时间 -->
                <span><el-date-picker size="large" v-model="selectReplyTime" type="datetime" placeholder="请选择结课答辩时间" :disabled="replyData?.status !== 4"/></span>
            </span>
            <el-button style="width: auto;" type="primary" @click="applyReplyTimeRequest()">申请</el-button>
            <span class="apply-time" v-if="replyData?.applyTime !== null">申请时间：{{ replyData?.applyTime }}</span>
            <div class="reply-time" v-if="replyData?.defenceTime !== null">
                <span>最终答辩时间：</span>
                <div class="time">{{ replyData?.defenceTime }}</div>
            </div>
        </div>
    </div>

    <!-- 答辩结果 -->
    <div class="result">
        <div class="result-title">答辩结果</div>
        <div style="display: flex;gap: 40px;margin: 0 40px;">
            <div class="content">教师评语：{{ replyData?.comment == null ? '暂无' : replyData?.comment}}</div>
            <div v-if="replyData?.score !==0">
               <span style="margin-right: 10px;" > 结课答辩得分：</span>
               <span class="score">{{ replyData?.score == 0 ? '': replyData?.score}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useCommonStore } from '@/store';
import { fetchGetReplyHistory, fetchReplyTime } from '../../apis/modules/score'

onMounted(() => {
    getReplyHistory()
})

const commonStore = useCommonStore();

const replyData = ref();

const replyStatus = computed(() => {
    if(replyData.value?.status === 0) return 1      //申请中
    if(replyData.value?.status === 1) return 3      //已拒绝
    if(replyData.value?.status === 2) return 4    //已通过，等待答辩
    if(replyData.value?.status === 3) return 5   //完成答辩
    if(replyData.value?.status === 4) return 0   //未申请
})

/**
 *  获取答辩记录
 */
const getReplyHistory = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetReplyHistory(params)
        replyData.value = result.data
        selectReplyTime.value = replyData.value?.defenceTime
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const selectReplyTime = ref();     //答辩时间


/**
 *  申请答辩时间
 */
const applyReplyTimeRequest = async () => {
    if(selectReplyTime.value === '') return ElMessage.error('请选择答辩时间')
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
            defenceTime: selectReplyTime.value,
            stuId: commonStore.userInfo.stuId
        }
        await fetchReplyTime(params);
        ElMessage.success('申请成功')
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}
</script>

<style scoped lang="scss">
.title {
    font-weight: 600;
}
.status{
    width: 90%;
    display: flex;
    flex-flow: column nowrap;
    padding: 20px;
    margin-top: 20px;
    background-color: #f4f8ff;
    border-start-start-radius: 8px;
    border-start-end-radius: 8px;
    .status-step {
        width: 100%;
        margin-left: 10%;
        margin-bottom: 20px;
    }
    .select-time {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        gap: 20px;
        width: 100%;
        .apply-time {
            margin-top: -10px;
            font-size: 12px;
            color: #999;
        }
        .reply-time {
            display: flex;
            align-items: center;
            .time {
                padding: 8px 10px;
                background-color: #f0f9eb;
                border: 1px solid #67c23a;
                color: #67c23a;
            }
        }
    }
}

.result {
    width: 90%;
    padding: 20px;
    background-color: #f4f8ff;
    border-end-start-radius: 8px;
    border-end-end-radius: 8px;
    .result-title {
        margin-bottom: 10px;
        font-weight: 600;
    }
    .content {
        width: 60%;
        padding: 10px 20px;
        background-color: #fff;
    }
    .score {
        font-size: 50px;
        color: #f56c6c;
    }
}
</style>