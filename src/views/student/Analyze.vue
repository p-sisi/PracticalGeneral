<template>
    <div class="analyze">

        <!-- 头部个人信息 -->
        <div class="analyze-header">
            <div style="display:flex;gap: 20px ">
                <el-avatar :size="60" :src="`${BASE_ERL}/file/images/${commonStore.userInfo.headImg}`"></el-avatar>
                <div class="info">
                    <div>
                        <span style="font-weight: 600;font-size: 18px;">{{ studentStore.userName }}</span>
                    </div>
                    <div style="display: flex;gap: 40px;">
                        <div class="flex-column">
                            <span>{{ scoreData?.attendanceScore.total }}</span>
                            <span class="font12-999">总数</span>
                        </div>
                        <div class="flex-column">
                            <span style="color: #67c23a;">{{ scoreData?.attendanceScore.attendCount }}</span>
                            <span class="font12-999">出勤</span>
                        </div>
                        <div class="flex-column">
                            <span style="color:#f56c6c;">{{ scoreData?.attendanceScore.absentCount }}</span>
                            <span class="font12-999">缺勤</span>
                        </div>
                        <div class="flex-column">
                            <span>{{ scoreData?.attendanceScore.lateCount }}</span>
                            <span class="font12-999">迟到</span>
                        </div>
                        <div class="flex-column">
                            <span>{{ scoreData?.attendanceScore.leaveCount }}</span>
                            <span class="font12-999">请假</span>
                        </div>
                        <div class="flex-row" style="align-items: flex-end;">
                            <span style="font-size: 14px;">得分：</span>
                            <span style="color:#f56c6c;font-size: 16px">{{ scoreData?.attendanceScore.score }}</span>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="考勤占比20%，出勤得分，缺勤不得分，请假和迟到得一半分数"
                                placement="top"
                            >
                                <div style="font-size: 14px;margin-left:2px;cursor: pointer;"><el-icon><Warning /></el-icon></div>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 学生总成绩 -->
            <div class="total-score">
                <span>课程总成绩：</span>
                <div>{{ scoreData?.totalScore }}</div>
            </div>
        </div>
        
        <!-- 成绩组成 -->
        <div class="analyze-comprise">
            <div>
                <p>成绩计算规则</p>
            </div>
            <!-- TODO：ECharts组件展示成绩占比 -->
            <div></div>
        </div>

        <!-- 作业、答辩 -->
        <div class="analyze-task">
            <div class="task">
                <div class="flex-row">
                    <span>作业</span>
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="计分占比30%，取所有作业的平均得分"
                        placement="right-start"
                    >
                        <div style="font-size: 14px;margin-left: 8px;cursor: pointer;"><el-icon><Warning /></el-icon></div>
                    </el-tooltip>
                </div>
                <div style="display: flex;gap: 20px;justify-content: space-between;margin: 10px 20px;">
                    <div class="part">
                        <div>{{ scoreData?.homeworkScore.commit }}/{{ scoreData?.homeworkScore.total }}</div>
                        <span>参与</span>
                    </div>
                    <div class="score">
                        <div style="color: #f56c6c;">{{ scoreData?.homeworkScore.score  }}</div>
                        <span>平均分</span>
                    </div>
                </div>
            </div>
            <div class="reply">
                <div class="flex-row">
                    <span>答辩</span>
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="计分占比20%，最终答辩得分"
                        placement="right-start"
                    >
                        <div style="font-size: 14px;margin-left: 8px;cursor: pointer;"><el-icon><Warning /></el-icon></div>
                    </el-tooltip>
                </div>
                <div class="reply-status flex-row">
                    <div class="status">
                        <span v-if="scoreData?.defenceScore.defenceStatus == 0">申请中</span>
                        <span v-else-if="scoreData?.defenceScore.defenceStatus == 1">申请被拒绝</span>
                        <span v-else-if="scoreData?.defenceScore.defenceStatus == 2">待答辩</span>
                        <span v-else-if="scoreData?.defenceScore.defenceStatus == 3">已完成</span>
                        <span v-else>未申请</span>
                    </div>
                    <div class="score">
                        <div style="color: #f56c6c;">{{ scoreData?.defenceScore.score }}</div>
                        <span>得分</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 讨论 -->
        <div class="analyze-discuss">
            <div style="font-size: 20px;display: flex;">
                <span>讨论</span>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="计分占比10%，每个同学至少回复四个评论"
                    placement="right-start"
                >
                    <div style="font-size: 14px;margin-left: 8px;cursor: pointer;"><el-icon><Warning /></el-icon></div>
                </el-tooltip>
            </div>
            <div class="list">
                <div>
                    <span>{{ discussListData?.length }}</span>
                    <div class="font12-999">课堂讨论数</div>
                </div>
                <div class="divide"></div>
                <div>
                    <span>{{ scoreData?.discussionScore.commentCount }}</span>
                    <div class="font12-999">我回复数</div>
                </div>
                <div class="divide"></div>
                <div>
                    <span style="color: #f56c6c">{{ scoreData?.discussionScore.score }}</span>
                    <div class="font12-999">得分</div>
                </div>
            </div>
        </div>

        <!-- 资源 -->
        <div class="analyze-resource">
            <div style="font-size: 20px;display: flex;">
                <span>资源</span>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="计分占比20%，在计分时间内观看视频，可以记录观看进度，根据视频观看进度计分，每个视频所占的分值相同，根据观看进度得分"
                    placement="right-start"
                >
                    <div style="font-size: 14px;margin-left: 8px;cursor: pointer;"><el-icon><Warning /></el-icon></div>
                </el-tooltip>
            </div>
            <div class="list">
                <div>
                    <span>{{ scoreData?.videoScore.totalScoreVideo }}</span>
                    <div class="font12-999">视频资源数</div>
                </div>
                <div class="divide"></div>
                <div>
                    <span>{{ scoreData?.videoScore.finishVideo }}</span>
                    <div class="font12-999">100%完成</div>
                </div>
                <div class="divide"></div>
                <div>
                    <span style="color: #f56c6c">{{ scoreData?.videoScore.score }}</span>
                    <div class="font12-999">得分</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStudentStore, useCommonStore } from '@/store'
import { BASE_ERL } from '../../content/common'
import { fetchGetScoreAnalyze } from '../../apis/modules/score'
import { fetchDiscussByCourseId } from '../../apis/modules/discuss'
import { ElMessage } from 'element-plus';
import { Warning } from '@element-plus/icons-vue'
 
onMounted(() => {
    getScoreAnalyze();
    getDiscussListRequest()
})

const studentStore = useStudentStore();
const commonStore = useCommonStore();

const scoreData = ref();

/**
 *  获取学生成绩分析请求
 */
const getScoreAnalyze = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId,
            stuId: commonStore.userInfo.userId
        }
        const result = await fetchGetScoreAnalyze(params);
        scoreData.value = result.data;
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

const discussListData = ref();

//获取讨论列表
const getDiscussListRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchDiscussByCourseId(params);
        discussListData.value = result.data;
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped lang="scss">
.flex-column {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}
.flex-row {
    display: flex;
    flex-flow: row nowrap;
}
.font12-999 {
    font-size: 12px;
    color: #999;
}
.analyze {
    width: 100%;
    .analyze-header {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 20px;
        background-color: #f4f8ff;
        border-radius: 8px;
        .total-score {
            display: flex;
            margin-right: 30px;
            align-items: center;
            div {
                margin-left: 10px;
                font-size: 46px;
                color: #f56c6c;
            }
        }
    }

    .analyze-comprise {
        
    }
    &-task {
        display: flex;
        justify-content: space-between;
        gap: 50px;
        margin: 20px 0px;
        .task,.reply {
            width: 50%;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
            span {
                font-size: 20px;
            }
            .part,.score {
                width: 140px;
                height: 100px;
                padding: 10px;
                text-align: center;
                background-color: #f4f8ff;
                border-radius: 8px;
                box-sizing: border-box;
                div {
                    font-size: 30px;
                }
                span {
                    font-size: 13px;
                    color: #999;
                }
            }
        }
        .reply {
            .reply-status {
                margin-right: 20px;
                margin-left: 20px;
                justify-content: space-between;
                align-items: center;
                .status {
                    flex:1;
                    display: flex;
                    justify-content: center;
                    font-size: 18px;
                }
            }
        }
    }
    &-discuss,.analyze-resource {
        width: 100%;
        height: 160px;
        padding: 20px;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
        border-radius: 8px;
        box-sizing: border-box;
        .list {
            padding: 0px 80px;
            display: flex;
            text-align: center;
            justify-content: space-between;
            align-items: center;
            .divide {
                height: 50px;
                width: 1px;
                background-color: #999;
            }
            span {
                font-size: 30px;
            }
        }
    }

    &-resource {
        width: 100%;
        height: 200px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
        border-radius: 8px;
        box-sizing: border-box;
    }
}
</style>