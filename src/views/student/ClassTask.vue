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
                <div style="margin-left: 8px;">未提交&nbsp;{{ subMitCount }}</div>
            </div>
        </div>

        <!-- 作业item -->
        <div class="task-item" v-if="isShowTaskList == true">
            <div 
                class="item"
                v-for="item in TASK_DATA"
                :key="item.taskId"
                :class="{'hasEnd': item.isEnd == true,'hasSubmit': item.isSubmit == true}"
                @click="goToTaskDetail(item)"
            >
                <div class="title">{{ item.title}}</div>
                <div class="content">{{ item.content }}</div>
                <div class="footer">
                    <div class="time">提交截止时间：{{ item.deadline }}</div>
                    <div class="score" v-if="item.score !== 0">得分：<span style="font-size: 20px; color: #f56c6c;">{{ item.score }}</span></div>
                    <el-button type="primary" round v-if="item.isSubmit == false && item.isEnd == false">提交作业</el-button>
                    <el-button type="primary" round v-else-if="item.isSubmit == true" disabled>已提交</el-button>
                    <el-button type="info" round v-else="item.isEnd == true" disabled>已截止</el-button>
                </div>
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
                    <div class="status-noSubmit" v-if="activeTaskData.isSubmit == false && activeTaskData.isEnd ==false">未提交</div>
                    <div class="status-submit" v-else-if="activeTaskData.isSubmit == true && activeTaskData.score == 0">已提交</div>
                    <div class="status-score" v-else-if="activeTaskData.isSubmit == true && activeTaskData.score !== 0">{{ activeTaskData.score }}</div>
                    <div class="status-end" v-if="activeTaskData.isEnd == true">已截止</div>
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
                    <el-button type="primary" round> &nbsp;&nbsp;提交作业&nbsp;&nbsp; </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TASK_DATA } from '../../content/student';
import { ElMessage } from 'element-plus'

//文件上传的后端接口地址
const UPLOAD_URL = 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15';

const subMitCount = computed(() => {
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
                font-size: 14px;
                color: #9c9a9a;
            }
        }
        .hasEnd {
            color: #c8c9cc;
        }
        .hasSubmit {
            background: linear-gradient(to bottom right, #edf4ff, #fff);
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
        }
    }
}
</style>