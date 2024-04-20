<template>
    <div class="task">
        <!-- 头部面包屑及统计 -->
        <div class="task-header">
            <div class="bread">
                <div @click="isShowTaskList = true" class="bread-list">作业列表</div>
                <div v-if="isShowTaskList == false">> 作业详情</div>
            </div>
            <div class="total">
                <div>已发布&nbsp;{{ taskData.length }}</div>
                <div style="margin-left: 8px;">未提交<span style="color: #f56c6c;">&nbsp;{{ submitCount }}</span></div>
            </div>
        </div>

        <!-- 作业item -->
        <div class="task-item" v-if="isShowTaskList == true">
            <div 
                class="item"
                v-for="item in taskData"
                :key="item.id"
                @click="goToTaskDetail(item)"
            >
                <div class="title">{{ item.title}}</div>
                <div class="content">{{ item.content }}</div>
                <div class="footer">
                    <div class="time">提交截止时间：{{ item.deadTime }}</div>
                    <div>已有&nbsp;{{item.commitNum}}&nbsp;人提交</div>
                    <div class="score" v-if="item.commitStatus == 2">得分：<span style="font-size: 22px; color: #f56c6c;">{{ item.score }}</span></div>
                    <el-button type="primary" round v-if="new Date(item.deadTime) > new Date() && item.commitStatus !== 2">{{item.commitStatus == 0 ? '提交作业' : '更新提交'}}</el-button>
                    <el-button type="danger" round v-else-if="item.commitStatus == 0 && new Date(item.deadTime) < new Date()" disabled> 未提交 </el-button>
                    <el-button type="info" round v-else-if="item.commitStatus == 1 && new Date(item.deadTime) < new Date() && item.commitStatus !== 2" disabled> 未批改 </el-button>
                    <el-button type="info" round v-else disabled > 已批改 </el-button>
                </div>
                <div class="status hasEnd" v-if="new Date(item.deadTime) < new Date()">已截止</div>
            </div>
        </div>

        <!-- 作业详情 -->
        <div class="task-detail" v-else>
            <div class="title">
                <div style="display: flex;gap: 20px;align-items: center;">
                    <span class="iconfont icon-zuoye-xuanzhong"></span>
                    <div class="text">
                        <div>{{ activeTaskData.title }}</div>
                        <div style="font-size: 12px;">{{ activeTaskData.content }}</div>
                    </div>
                </div>
                <div class="title-right">
                    <div class="time">提交截止时间：{{ activeTaskData.deadTime }}</div>
                    <div class="status-noSubmit" v-if="activeTaskData.commitStatus == 0 && new Date(activeTaskData.deadTime) > new Date()">未提交</div>
                    <div class="status-submit" v-else-if="activeTaskData.commitStatus == 1 && new Date(activeTaskData.deadTime) > new Date()">已提交</div>
                    <div class="status-score" v-else-if="activeTaskData.commitStatus == 2">{{ activeTaskData.score }}</div>
                    <div class="status-end" v-else>已截止</div>
                </div>
            </div>

            <!-- 文件上传 -->
            <div class="content">
                <div class="content-title">
                    <el-upload
                        ref="uploadRef"
                        class="upload-demo"
                        drag
                        :auto-upload="false"
                        :show-file-list="false"
                        @change="handleChangeFile"
                        :limit="1"
                        :on-exceed="handleExceed"
                    >
                        <span class="iconfont icon-shangchuan"></span>
                        <div class="el-upload__text">拖拽文件到此处或者 <em>点击添加作业</em></div>
                    </el-upload>
                </div>

                <!-- 当前选择文件 -->
                <div class="content-file" v-if="isShowUploadFile">
                    <div class="content-file-detail">
                        <span class="iconfont icon-wendangwenjian"></span>
                        <div>
                            <div>{{ uploadTaskFile.name }}</div>
                            <div style="font-size: 10px;margin-top: 2px;">{{ (uploadTaskFile.size/1024).toFixed(2) }}k</div>
                        </div>
                    </div>
                    <span style="cursor: pointer;color: #4186ff;font-size: 14px;" @click="handleDeleteUploadFile">删除</span>
                </div>

                <div class="content-tip">
                    <div style="margin: 10px;">作业备注<span style="margin-left: 10px;font-size: 10px;">（选填）</span></div>
                    <div><el-input
                        v-model="inputTips"
                        style="width: 100%"
                        rows="3"
                        type="textarea"
                        placeholder="作业以附件的形式提交，备注内容仅供老师参考哦~"
                    /></div>
                </div>
                <div class="content-submit">
                    <el-button 
                        type="primary" 
                        round 
                        :disabled="new Date(activeTaskData.deadTime) < new Date() 
                        || activeTaskData.commitStatus == 2"
                        @click="handleSubmitTask"
                        > &nbsp;&nbsp;{{ activeTaskData.commitStatus !== 0 ? '更新提交' : '提交作业'}}&nbsp;&nbsp; 
                    </el-button>
                </div>

                <!-- 提交记录 -->
                <div class="content-history">
                    <div class="header">
                        <el-icon><Clock /></el-icon>
                        <div>提交记录</div>
                    </div>
                    <div class="list">
                        <div class="times">提交次数：<span>{{ taskHistory.length }}</span></div>
                        <div v-show="taskHistory.length == 0" class="empty">
                            <span class="iconfont icon-zanwuxiangguanshuju"></span>
                            <div>暂未提交</div>
                        </div>
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
                                            <div style="display: flex;font-size: 12px;align-items: center;">
                                                <div style="margin: 2px 20px 0px 0px;">{{ (item.fileSize/1024).toFixed(2) }}k</div>
                                                <el-tooltip :content="item.answerRemark" placement="bottom" effect="light">
                                                    <span v-if="item.answerRemark != ''" style="cursor: pointer;color: #4186ff;">备注</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                    <el-button plain @click="handleDownLoad(item)">下载</el-button>
                                </div>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue';
import { ElMessage, genFileId } from 'element-plus'
import { Clock, Folder } from '@element-plus/icons-vue';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { fetchGetAllCourseTask, fetchGetTaskHistory } from '../../apis/modules/task';
import { useCommonStore } from '@/store';
import { Task, TaskDetail } from '../../content/task';
import axios from 'axios';
import { BASE_ERL } from '../../content/common'

onMounted(() => {
    getTaskDataRequest();
})

const commonStore = useCommonStore();

//获取作业列表
const taskData: Ref<Task[]> = ref([]);
const getTaskDataRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetAllCourseTask(params);
        taskData.value = result.data;
    } catch (error) {
        ElMessage.error('获取作业列表失败！')
    }
}

const submitCount = computed(() => {
    return taskData.value.filter( (item: any) => item.commitStatus == 0).length;
})


//是否展示作业列表
const isShowTaskList = ref(true);
const activeTaskData = ref();   //当前作业详情信息

const goToTaskDetail = (item: any) => {
    isShowTaskList.value = false;
    activeTaskData.value = item;

    getTaskHistoryRequest();
}

//作业提交记录
const taskHistory: Ref<TaskDetail[]> = ref([]);

const getTaskHistoryRequest = async () => {
    try {
        const params = {
            homeworkId: activeTaskData.value.id
        }
        const result = await fetchGetTaskHistory(params);
        taskHistory.value = result.data;
    } catch (error) {
        ElMessage.error('获取作业提交记录失败！')
    }
}

//作业
const inputTips = ref('');
const isShowUploadFile = ref(false);  //当前选择文件

const uploadTaskFile = ref();    //File类型的数据

const handleChangeFile = (file: any) => {
    isShowUploadFile.value = true;
    // file 是当前选择的文件，可以通过 file.raw 获取原始的 File 对象,fileList是上传的文件列表
    uploadTaskFile.value = file.raw;
    console.log(file)
};

//删除已选择的文件
const handleDeleteUploadFile = () => {
    isShowUploadFile.value = false;
    uploadTaskFile.value = null;
}

const uploadRef = ref<UploadInstance>()

//选择文件超出限制时，覆盖第一个文件
const handleExceed: UploadProps['onExceed'] = (files: any) => {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}

// 设置请求头
const token = localStorage.getItem('Token');
const config = {
  headers: {
    'Content-Type': 'multipart/form-data', // 设置Content-Type为formData类型
    'Authorization': `${token}`, 
  }
}

const handleSubmitTask = async () => {
    let formData = new FormData();
    formData.append('file', uploadTaskFile.value);
    formData.append('answerRemark', inputTips.value);
    formData.append('homeworkId', activeTaskData.value.id);

    axios.post('http://localhost:1023/homework/commitHomework', formData, config)
        .then((response: any) => {
            ElMessage.success('提交成功')
        })
        .catch((error: any) => {
            console.error('Error:', error);
        });
}

//下载历史提交作业
const handleDownLoad = async (item: any) => {
    try {
        const params = {
            fileName: item.depositFilename
        };
        axios.get(`http://localhost:1023/file/homeworkFiles/download/${item.depositFilename}`, config)
            .then((response: any) => {
                const blob = new Blob([response.data]);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', item.depositFilename); // 在这里设置文件名
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                ElMessage.success('下载成功');
            })
            .catch((error: any) => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error:', error);
    }
};
</script>

<style scoped lang="scss">
.task {
    margin-top: 14px;
    margin-right: 20px;
    &-header {
        display: flex;
        justify-content:space-between;
        margin-bottom: 8px;
        font-size: 14px;
        .bread-list {
            cursor: pointer;
        }
        .bread-list:hover {
            color: #409eff;
        }
        .total,.bread{
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
        }
    }
    &-item {
        .item {
            position: relative;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #e9e9e9;
            border-radius: 8px;
            transition: all .3s;
            .title {
                font-size: 18px;
                padding-bottom: 4px;
            }
            .content {
                margin: 8px;
                font-size: 15px;
            }
            .footer {
                display: flex;
                justify-content: space-between;
                align-items: center ;
                margin-right: 18px;
                font-size: 13px;
                color: #9c9a9a;
            }
            .status {
                position: absolute;
                font-size: 14px;
                text-align: center;
                margin-top: -112px;
                padding: 4px 10px;
                margin-left: 89%;
                box-shadow: 0px 0px 6px rgba(0,0,0 ,0.2);
                width: 60px;
            }
            .submit-ing {
                color: #67c23a;
                background-color: #ecf8e5;
            }
            .hasScore {
                color: #fff;
                background-color: #e6a23c91;
            }
            .hasEnd {
                color: #fff;
                background-color: #f56c6cc3;
            }
        }
        .item:hover {
            box-shadow: 0px 0px 4px rgba(0,0,0 ,0.2);
        }
    }
    &-detail {
        .title {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
            span {
                font-size: 30px;
                color: #4186ff;
            }
            .title-right {
                display: flex;
                flex-flow: row nowrap;
                align-items: flex-end;
                margin-right: 30px;
                gap: 30px;
                .time {
                    height: 20px;
                    padding: 0px 8px;
                    font-size: 12px;
                    color: #4186ff;
                    background-color: #ecf3fe;
                    border-radius: 8px;
                }
                .status-noSubmit {
                    font-size: 20px;
                    color: #f56c6c;
                }
                .status-submit {
                    font-size: 20px;
                    color: #67c23a;
                }
                .status-score {
                    font-size: 40px;
                    color: #f56c6c;
                }
                .status-end {
                    font-size: 20px;
                    color: #ccc;
                }
            }
        }
        .content {
            margin-top: 18px;
            padding: 16px;
            background-color: #f8fbff;
            border-radius: 10px;
            &-title {
                margin-bottom: 10px;
                .icon-shangchuan {
                    font-size: 54px;
                    color: #4186ff;
                }
            }
            &-file {
                display: flex;
                align-items: flex-end;
                gap: 10px;
                &-detail {
                    display: flex;
                    gap: 6px;
                    width: 90%;
                    padding: 6px 10px;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    background-color: #fff;
                    box-sizing: border-box;
                    font-size: 14px;
                    .iconfont {
                        margin-right: 8px;
                        font-size: 28px;
                        color: #409eff;
                    }
                }
            }
            &-tip {
                margin-bottom: 10px;
            }
            &-submit {
                display: flex;
                justify-content: flex-end;
                margin-right: 10px;
            }
            &-history {
                .header {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .list {
                    margin-top: 10px;
                    padding: 6px 10px;
                    width: 100%;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    background-color: #fff;
                    box-sizing: border-box;
                    .times {
                        font-size: 14px;
                        margin-bottom: 4px;
                        span {
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                    .empty {
                        display: flex;
                        width: 100%;
                        height: 100px;
                        flex-flow: column nowrap;
                        justify-content: center;
                        align-items: center;
                        color: #9c9a9a;
                        font-size: 12px;
                        span {
                            font-size: 34px;
                        }
                    }
                    .list-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 8px;
                        &-info {
                            display: flex;
                            align-items: center;
                            padding: 2px 8px;
                            border: 1px solid #e1e3e5;
                            border-radius: 4px; 
                            width: 84%;
                            .iconfont {
                                margin-right: 8px;
                                font-size: 36px;
                                color: #409eff;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>