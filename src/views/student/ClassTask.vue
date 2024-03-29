<template>
    <div class="task">
        <!-- 头部面包屑及统计 -->
        <div class="task-header">
            <div class="bread">
                <div @click="isShowTaskList = true" class="bread-list">作业列表</div>
                <div v-if="isShowTaskList == false">> 作业详情</div>
            </div>
            <div class="total">
                <div>已发布&nbsp;{{ TASK_DATA.length }}</div>
                <div style="margin-left: 8px;">未提交<span style="color: #f56c6c;">&nbsp;{{ submitCount }}</span></div>
            </div>
        </div>

        <!-- 作业item -->
        <div class="task-item" v-if="isShowTaskList == true">
            <div 
                class="item"
                v-for="item in TASK_DATA"
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
                    <div class="time">提交截止时间：{{ activeTaskData.deadline }}</div>
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
                        class="upload-demo"
                        drag
                        :action="UPLOAD_URL"
                        :on-success="handleSuccessFile"
                        :on-error="handleErrorFile"
                        multiple
                    >
                        <span class="iconfont icon-shangchuan"></span>
                        <div class="el-upload__text">拖拽文件到此处或者 <em>点击添加作业</em></div>
                    </el-upload>
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
                    <el-button type="primary" round :disabled="new Date(activeTaskData.deadTime) < new Date() || activeTaskData.commitStatus == 2"> &nbsp;&nbsp;{{ activeTaskData.commitStatus !== 0 ? '更新提交' : '提交作业'}}&nbsp;&nbsp; </el-button>
                </div>

                <!-- 提交记录 -->
                <div class="content-history">
                    <div class="header">
                        <el-icon><Clock /></el-icon>
                        <div>提交记录</div>
                    </div>
                    <div class="list">
                        <div class="times">提交次数：<span>{{ TASK_SUBMIT_RECORD.length }}</span></div>
                        <el-timeline style="max-width: 700px">
                            <el-timeline-item 
                                v-for="item in TASK_SUBMIT_RECORD"
                                :key="item.taskId"
                                :timestamp=" item.submitTime " 
                                placement="top">
                                <div class="list-item">
                                    <div class="list-item-info">
                                        <span class="iconfont icon-wendangwenjian"></span>
                                        <div>
                                            <div>{{ item.fileName }}</div>
                                            <div style="font-size: 12px;margin-top: 2px;">{{ item.fileSize }}</div>
                                        </div>
                                    </div>
                                    <el-button plain>下载</el-button>
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
import { computed, ref } from 'vue';
import { TASK_DATA, TASK_SUBMIT_RECORD } from '../../content/student';
import { ElMessage } from 'element-plus'
import { Clock, Folder } from '@element-plus/icons-vue';

//文件上传的后端接口地址
const UPLOAD_URL = 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15';

const submitCount = computed(() => {
    return TASK_DATA.filter(item => item.isSubmit === false).length;
})


//是否展示作业列表
const isShowTaskList = ref(true);
const activeTaskData = ref();   //当前作业信息

const goToTaskDetail = (item: any) => {
    isShowTaskList.value = false;
    activeTaskData.value = item;
}

//作业
const inputTips = ref('');

const handleSuccessFile = (response:any, file:any, fileList:any) => {
    // 处理文件上传成功后的回调
    console.log('上传成功', response, file, fileList);
    ElMessage.success('上传作业成功！')
};

const handleErrorFile = (response:any, file:any, fileList:any) => {
    console.log('上传失败', response, file, fileList);
    ElMessage.error('上传作业失败！')
}
</script>

<style scoped lang="scss">
.task {
    margin-top: 14px;
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
                .icon-shangchuan {
                    font-size: 54px;
                    color: #4186ff;
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