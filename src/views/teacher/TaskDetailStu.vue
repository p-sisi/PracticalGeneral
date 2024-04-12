<template>
    <!-- 头部面包屑 -->
    <div class="flex-row">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item to="task">作业列表</el-breadcrumb-item>
            <el-breadcrumb-item to="task_detail" v-if="teacherStore.breadNum >= 2">作业详情</el-breadcrumb-item>
            <el-breadcrumb-item to="stu_detail" v-if="teacherStore.breadNum >= 3">学生作业详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <!-- 作业标题 -->
    <div class="title flex-row">{{ teacherStore.activeTask.title }}</div>

    <!-- 提交学生信息 -->
    <div class="status  flex-row">
        <div class="status-info">
            <span class="iconfont icon-xuesheng"></span>
            <span>学生：{{ teacherStore.activeStudentTask.stuName }}</span>
        </div>
        <div class="status-time flex-row">
            <span class="time">提交时间：{{ teacherStore.activeStudentTask.commitTime }}</span>
            <div class="status">
                <span v-if="teacherStore.activeStudentTask.commitStatus == 1" class="status-submit">未批改</span>
                <span v-else class="status-score">{{ teacherStore.activeStudentTask.score }}</span>
            </div>
        </div>
    </div>
    
    <!-- 分割线 -->
    <div class="divide"></div>

    <!-- 最新作业详情 -->
    <div class="task">
        <div class="task-info flex-row">
            <div class="flex-row">
                <span class="iconfont icon-wendangwenjian"></span>
                <div class="flex-column">
                    <span class="file-name">{{ newTaskSubmitData?.originalFilename }}</span>
                    <span class="file-size">{{ (newTaskSubmitData?.fileSize/1024).toFixed(2) }}kb</span>
                </div>
            </div>
            <el-button>下载</el-button>
        </div>
        <div class="task-detail">
            文件内容
        </div>
    </div>
    
    <!-- 作业备注 -->
    <div class="remark">
        <span class="remark-title"><span>*</span>学生作业备注：</span>
        <div class="remark-content">
            <div>{{ newTaskSubmitData?.answerRemark }}</div>
        </div>
    </div>

    <!-- 评分 -->
    <div class="score flex-row">
        <span>评分：</span>
        <span><el-input v-model="inputScore" style="width: 80px" placeholder="分数"  size="large"/></span>
        <el-button type="primary" @click="getTaskScoreRequest()">{{ teacherStore.activeStudentTask.commitStatus == 2 ? '更改分数' : '提交' }}</el-button>
    </div>

    <!-- 提交记录 -->
    <div class="history">
        <span>历史提交记录</span>
        <div class="history-list">
            <el-timeline style="max-width: 700px" >
                <el-timeline-item 
                    v-for="item in taskHistory"
                    :key="item.id"
                    :timestamp=" item.commitTime " 
                    placement="top">
                    <div class="list-item">
                        <div class="list-item-info">
                                <span class="iconfont icon-wendangwenjian"></span>
                                <div>
                                    <div>{{ item.originalFilename }}</div>
                                    <div style="font-size: 12px;align-items: center;" class="flex-row">
                                        <div style="margin: 2px 20px 0px 0px;">{{ (item.fileSize/1024).toFixed(2) }}k</div>
                                        <el-tooltip :content="item.answerRemark" placement="bottom" effect="light">
                                            <span v-if="item.answerRemark != ''" style="cursor: pointer;color: #4186ff;">备注</span>
                                        </el-tooltip>
                                    </div>
                                </div>
                        </div>
                        <div class="flex-row list-item-down">
                            <span>预览</span>
                            <el-button plain >下载</el-button>
                        </div>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted ,ref, Ref} from 'vue'
import { useTeacherStore } from '@/store';
import { fetchStudentTaskNew, fetchStudentTaskHistory, fetchMarkTask } from '../../apis/modules/task';
import { TaskDetail } from '../../content/task'
import { ElMessage } from 'element-plus';

onMounted(() => {
    getNewTaskSubmit();
    getTaskHistoryRequest()
})

const teacherStore = useTeacherStore();

const newTaskSubmitData = ref<TaskDetail>()

/**
 *  获取学生的最新提交记录请求
 */
const getNewTaskSubmit = async () => {
    try {
        const params = {
            homeworkId: teacherStore.activeTask.id,
            stuId: teacherStore.activeStudentTask.stuId
        }
        const result  = await fetchStudentTaskNew(params)
        newTaskSubmitData.value = result.data;
    } catch (error: any) {
        console.log(error)
    }
}

// 评分
const inputScore = ref(teacherStore.activeStudentTask.score || '');

/**
 *  评分请求
 */
const getTaskScoreRequest = async () => {
    try {
        const params = {
            commitId: teacherStore.activeStudentTask.commitId,
            score: parseInt(inputScore.value)
        }
        await fetchMarkTask(params)
        ElMessage.success('评分成功');

        //修改store中学生提交作业信息，只修改提交状态：2-已批改，分数：inputScore
        const newTask = {
            commitId: teacherStore.activeStudentTask.commitId,
            commitStatus: 2,
            commitTime: teacherStore.activeStudentTask.commitTime,
            correctTime: teacherStore.activeStudentTask.correctTime,
            score: parseInt(inputScore.value),
            stuId: teacherStore.activeStudentTask.stuId,
            stuName: teacherStore.activeStudentTask.stuName,
        } 
        teacherStore.setActiveStudentTask(newTask);
    } catch (error: any) {
        console.log(error)
    }
}

//作业提交记录
const taskHistory: Ref<TaskDetail[]> = ref([]);

/**
 *  获取学生的提交记录请求
 */
const getTaskHistoryRequest = async () => {
    try {
        const params = {
            homeworkId: teacherStore.activeTask.id,
            stuId: teacherStore.activeStudentTask.stuId
        }
        const result = await fetchStudentTaskHistory(params);
        taskHistory.value = result.data;
    } catch (error: any) {
        console.log(error)
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

.title {
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
}
.status {
    justify-content: space-between;
    align-items: flex-end;
    .status-info {
        justify-content: center;
        align-items: center;
        font-size: 18px;
        .iconfont {
            font-size: 26px;
            color: #4186ff;
            margin-right: 10px;
        }
    }
    .status-time {
        align-items: flex-end;
        gap: 30px;
        .time {
            height: 18px;
            padding: 2px 8px;
            font-size: 11px;
            color: #4186ff;
            background-color: #ecf3fe;
            border-radius: 20px;
        }
        .status {
            margin-right: 30px;
            font-size: 20px;
            .status-submit {
                color: #f56c6c;
            }
            .status-score {
                font-size: 30px;
                color: #67c23a;
            }
        }
    }
}

.divide {
    width: 100%;
    height: 1px;
    margin: 10px 0;
    background-color: #ccc;
}

.task {
    padding: 10px 40px;
    background-color: #f8fbff;
    border-radius: 8px;
    .task-info {
        justify-content: space-between;
        .iconfont {
            margin-right: 10px;
            font-size: 30px;
            color: #4186ff;
        }
        .file-name {
            font-size: 15px;
        }
        .file-size {
            font-size: 12px;
            color: #999;
        }
    }
    .task-detail {
        margin-top: 20px;
        height: 300px;
    }
}

.remark {
    margin-top: 20px;
    .remark-title {
        margin-left: 16px;
        span {
            color: #f56c6c;
            margin-right: 10px;
        }
    }
    .remark-content {
        padding: 10px;
        font-size: 14px;
        background-color: #f8fbff;
        border-radius: 8px;
        div {
            min-height: 50px;
            padding: 10px;
            margin: 0 8px;
            background-color: #fff;
        }
    }
}

.score {
    margin-top: 30px;
    margin-right: 30px;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
}

.history {
    margin-top: 20px;
    padding: 10px;
    background-color: #f8fbff;
    border-radius: 8px;
    .history-list {
        margin-top: 10px;
        .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            padding: 0px 10px;
            background-color: #fff;
            &-info {
                display: flex;
                align-items: center;
                padding: 2px 8px;
                border-radius: 4px; 
                width: 80%;
                .iconfont {
                    margin-right: 8px;
                    font-size: 36px;
                    color: #409eff;
                }
            }
            .list-item-down {
                align-items: flex-end;
                span {
                    margin-right: 6px;
                    font-size: 12px;
                    color:#409eff;
                    cursor: pointer;
                }
            }
        }
    }
}

//修改input框字体大小
::v-deep .el-input--large {
    font-size: 20px;
}
</style>