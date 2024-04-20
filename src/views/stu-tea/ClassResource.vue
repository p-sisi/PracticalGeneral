<template>
    <!-- 资源列表 -->
    <div class="resource" v-if="isPlay == false">
        <!-- 视频资源 -->
        <div class="resource-video">
            <div class="resource-video-title">
                <div>
                    <span class="iconfont icon-video"></span>
                    <span>视频</span>
                </div>
                <el-button v-if="isShowUpload !== true && commonStore.userType == '教师'" type="success" :icon="Plus" @click="handleClickUploadBtn()">上传视频</el-button>
            </div>

            <div class="divide"></div>

            <!-- 视频的编辑区-->
            <div class="resource-video-upload" v-if="isShowUpload == true">
                <div class="upload-title">{{ isEditVideo ? '更新视频': '上传视频' }}</div>
                <div class="upload-form">
                    <div class="upload-form-video">
                        <div style="margin-top: 6px;">视频资源：</div>
                        <!-- 编辑状态下不展示视频资源上传按钮，展示视频 -->
                        <div style="display: flex;flex-flow: column nowrap;" v-if="!isEditVideo">
                            <el-upload
                                ref="uploadRef"
                                :auto-upload="false"
                                :show-file-list="false"
                                @change="handleChangeFile"
                                :limit="1"
                                :on-exceed="handleExceed"
                                >
                                <el-button type="primary">选择文件</el-button>
                            </el-upload>
                            <span v-if="isSelectedVideo == true" class="video-info">
                                <span class="iconfont icon-video-file"></span>
                                <div class="video-info-content">
                                    <span class="title">{{ selectedVideoFile.name }}</span>
                                    <span class="size">{{ ((selectedVideoFile.size/1024)/1024).toFixed(2) }}MB</span>
                                </div>
                            </span>
                        </div>
                        <video class="video" v-else :src="`${BASE_ERL}/file/videos/${selectedVideoData?.depositFilename}`"></video>
                    </div>
                    <div style="margin-left: 30px;">
                        <span>视频标题：</span>
                        <el-input v-model="inputVideoTitle" style="width: 240px" placeholder="请输入视频标题" />
                    </div>
                    <div class="upload-form-score">
                        <span>是否计分</span>
                        <el-tooltip class="box-item" effect="dark" content="计分：学生观看视频情况，计入总成绩" placement="top">
                            <span class="icon"><el-icon><Warning /></el-icon>：</span>
                        </el-tooltip>
                        <div style="display: flex;">
                            <div v-for="item in ['计分','不计分']"  @click="radioChange(item)" class="tabs-temp" :class="{ 'selected': item === activeSelectRadio }">
                                {{ item }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span>计分截止时间：</span>
                        <el-date-picker v-model="inputDeadTime" type="datetime" placeholder="选择日期时间" style="width: 240px;"/>
                    </div>
                </div>
                <div class="upload-btn">
                    <el-button @click="handelCancelUpload()">取消</el-button>
                    <el-button v-if="!isEditVideo" type="success" :icon="Plus" @click="handleUploadVideo()" :disabled="isUploading == true">{{ isUploading == true ? '正在上传中':'上传' }}</el-button>
                    <el-button v-else type="primary" @click="editVideoRequest()">更新</el-button>
                </div>
            </div>

            <!-- 视频资源列表 -->
            <div class="resource-video-list" v-if="videoResourceList.length !== 0">
                <!-- 计分的视频资源列表 -->
                <div class="list-score">
                    <span>参与计分：</span>
                    <div style="display: flex;gap:20px;margin-top: 8px;padding: 10px;" v-if="videoResourceListScore.length !== 0">
                        <!-- 视频item -->
                        <div class="list-item" 
                            v-for="item in videoResourceListScore"
                            :key="item.id"
                            @click="handleClickVideoItem(item)">
                            <div class="list-item-title">{{ item.title }}</div>
                            <div class="list-item-video">
                                <video 
                                :src="`${BASE_ERL}/file/videos/${item.depositFilename}`" 
                                :controls="item.id == isPlayingId" 
                                @mouseover="isPlayingId = item.id" 
                                @mouseleave="isPlayingId= null"></video>
                            </div>
                            <!-- 教师端不展示累计观看时长 -->
                            <span class="list-item-total" v-if="commonStore.userType == '学生'">累计观看时长：{{ formatTimeString(item.watchDurationSeconds) }}</span>
                            <span class="list-item-time">
                                <span>计分截止时间：{{ getStringTime(item.deadTime) }}</span>
                                <div style="display: flex;align-items: center;color: #4186ff;">
                                    <span class="iconfont icon-icon-"></span>
                                    <span>&nbsp;{{ item.viewCount }}</span>
                                </div>
                            </span>
                            <!-- 教师端进行操作，学生端没有权限 -->
                            <div class="list-item-btn" v-if="commonStore.userType == '教师'">
                                <el-icon class="edit" @click="handleClickEdit(item)"><Edit /></el-icon>
                                <el-popconfirm
                                    width="220"
                                    confirm-button-text="确定"
                                    cancel-button-text="取消"
                                    icon-color="#f56c6c"
                                    title="确定删除该视频资源?"
                                    @confirm="deleteVideoRequest(item.id)"
                                >
                                    <template #reference>
                                        <el-icon class="edit"><Delete /></el-icon>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-video-list">暂无参与计分的视频资源</div>
                </div>

                <el-divider border-style="dashed" />

                <!-- 未计分的视频资源列表 -->
                <div class="list-no-score">
                    <span>未参与计分：</span>
                    <div style="display: flex;gap:20px;margin-top: 8px;padding: 10px;" v-if="videoResourceListNoScore.length !== 0">
                        <!-- 视频item -->
                        <div class="list-item" 
                            v-for="item in videoResourceListNoScore"
                            :key="item.id">
                            <div class="list-item-title">{{ item.title }}</div>
                            <div class="list-item-video">
                                <video 
                                :src="`${BASE_ERL}/file/videos/${item.depositFilename}`" 
                                :controls="item.id == isPlayingId" 
                                @mouseover="isPlayingId = item.id" 
                                @mouseleave="isPlayingId= null"></video>
                            </div>
                            <!-- 教师端不展示累计观看时长 -->
                            <span class="list-item-total" v-if="commonStore.userType == '学生'">累计观看时长：{{ formatTimeString(item.watchDurationSeconds) }}</span>
                            <span class="list-item-time">
                                <span>计分截止时间：{{ getStringTime(item.deadTime) }}</span>
                                <div style="display: flex;align-items: center;color: #4186ff;">
                                    <span class="iconfont icon-icon-"></span>
                                    <span>&nbsp;{{ item.viewCount }}</span>
                                </div>
                            </span>
                            <div class="list-item-btn" v-if="commonStore.userType == '教师'">
                                <el-icon class="edit" @click="handleClickEdit(item)"><Edit /></el-icon>
                                <el-popconfirm
                                    width="220"
                                    confirm-button-text="确定"
                                    cancel-button-text="取消"
                                    icon-color="#f56c6c"
                                    title="确定删除该视频资源?"
                                    @confirm="deleteVideoRequest(item.id)"
                                >
                                    <template #reference>
                                        <el-icon class="edit"><Delete /></el-icon>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-video-list">暂无未参与计分的视频资源</div>
                </div>
            </div>

            <!-- 没有视频资源列表的空状态 -->
            <div class="resource-video-empty" v-if="videoResourceList.length == 0">
                <img src="../../assets/images/no-message.png" alt="">
                <span>暂无视频资源</span>
            </div>
        </div>

        <!-- 文档资源 -->
        <div class="resource-file">
            <div class="resource-file-title">
                <div>
                    <span class="iconfont icon-file"></span>
                    <span>文档</span>
                </div>
                <el-button v-if="commonStore.userType == '教师' && isShowUploadFile == false" type="success" :icon="Plus" @click="isShowUploadFile = true">上传文档</el-button>
            </div>

            <div class="divide"></div>

            <!-- 上传文件的编辑区-->
            <div class="resource-file-upload" v-if="isShowUploadFile == true">
                <div class="upload-title">上传文档</div>
                <div class="upload-form">
                    <div class="upload-form-file">
                        <div style="margin-top: 6px;">文档资源：</div>
                        <div style="display: flex;flex-flow:column nowrap;gap: 10px">
                            <el-upload
                                ref="uploadRef"
                                :auto-upload="false"
                                :show-file-list="false"
                                @change="handleChangeFileResource"
                                :limit="1"
                                :on-exceed="handleExceed"
                                >
                                <el-button type="primary">选择文件</el-button>
                            </el-upload>
                            <span v-if="isSelectedFile == true" class="file-info">
                                <span class="iconfont icon-wendangwenjian"></span>
                                <div class="file-info-content">
                                    <span class="title">{{ selectedFileFile.name }}</span>
                                    <span class="size">{{ ((selectedFileFile.size/1024)/1024).toFixed(2) }}MB</span>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div style="margin-left: 30px;">
                        <span>文档标题：</span>
                        <el-input v-model="inputFileTitle" style="width: 240px" placeholder="请输入文档标题" />
                    </div>
                </div>
                <div class="upload-btn">
                    <el-button @click="isShowUploadFile = false">取消</el-button>
                    <el-button type="success" :icon="Plus" @click="handleUploadFile()" :disabled="isUploadingFile == true">{{ isUploadingFile == true ? '正在上传中':'上传' }}</el-button>
                </div>
            </div>

            <!-- 文件资源列表 -->
            <div class="resource-file-list" v-if="fileResourceList.length !== 0">
                <div v-for="item in fileResourceList" :key="item.id" class="resource-file-list-item">
                    <div class="item-left">
                        <span class="iconfont icon-wendang-xuanzhong"></span>
                        <div class="item-left-info">
                            <span class="title">{{ item.title }}</span>
                            <span class="size">大小：{{ item.fileSize/1024/1024 > 1 ? (item.fileSize/1024/1024).toFixed(2) + 'M' : (item.fileSize/1024).toFixed(2) + 'K'}}</span>
                        </div>
                    </div>
                    <div class="item-right">
                        <span class="downLoad" @click="handleDownLoad(item)">下载</span>
                        <el-popconfirm
                            width="220"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon-color="#f56c6c"
                            title="确定删除该视频文档资源?"
                            @confirm="handleDeleteRequest(item.id)"
                        >
                            <template #reference>
                                <span class="delete">删除</span>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </div>
            <!-- 没有文件资源列表的空状态 -->
            <div class="resource-file-empty" v-else>
                <img src="../../assets/images/no-message.png" alt="">
                <span>暂无文档资源</span>
            </div>
        </div>
    </div>

    <!-- 大屏播放视频 -->
    <div class="play" v-else>
        <!-- 左侧菜单 -->
        <div class="play-menu">
            <el-menu :default-active="activeMenuIndex" class="el-menu-vertical-demo" :collapse="isCollapse">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><span class="iconfont icon-icon-video"></span></el-icon>
                        <span>视频</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item v-for="(item, index) in videoResourceList" :key=index :index="`1-${index}`" @click="handleClickMenuItem(item)">{{ item.title }}</el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
        </div>

        <!-- 右侧视频播放 -->
        <div class="paly-video">
            <!-- 收起、展开菜单图标 -->
            <div class="play-video-ico" >
                <div class="icon" @click="isCollapse = !isCollapse">
                    <el-tooltip class="box-item" effect="light" :content="isCollapse?'展开':'收起'" placement="right" hide-after="50">
                        <el-icon v-if="!isCollapse"><DArrowLeft /></el-icon>
                        <el-icon v-else><DArrowRight /></el-icon>
                    </el-tooltip>
                </div>
                <!-- 返回资源列表 -->
                <span class="back" @click="handleClickBack()"> <&nbsp;返回资源列表 </span>
                <!-- 当前播放的视频标题 -->
                <div class="title">{{ selectedVideoData?.title }}</div>
            </div>
            <!-- 视频播放框 -->
            <div class="play-video-video">
                <video 
                    class="video" 
                    ref="videoElementRef"
                    :src="`${BASE_ERL}/file/videos/${selectedVideoData?.depositFilename}`" 
                    controls
                    @play="handlePlay"
                    @pause="handlePause"
                    @timeupdate="handleTimeUpdate"></video> 
            </div>
            <!-- 观看次数 -->
            <span class="view-count">
                <div>
                    <span class="iconfont icon-icon-"></span>
                    &nbsp;播放次数&nbsp;
                    <span style="font-weight: 600">{{ selectedVideoData?.viewCount }}</span>
                </div>
                <div>
                    <span>计分截止时间：</span>
                    <span style="color: #67c23a" v-if="selectedVideoData?.toScore == true && new Date(selectedVideoData?.deadTime).getTime() > new Date()">{{ getStringTime(selectedVideoData?.deadTime) }}</span>
                    <span style="color: #f56c6c" v-if="selectedVideoData?.toScore == true && new Date(selectedVideoData?.deadTime).getTime() < new Date()">{{ getStringTime(selectedVideoData?.deadTime) }}</span>
                    <span v-if="selectedVideoData?.toScore == false">不参与计分</span>
                </div>
            </span>
            <!-- 累计播放时长 -->
            <div class="view-total">累计播放时长：{{ formatTimeString(selectedVideoData?.watchDurationSeconds) }}</div>
            <div class="view-total">观看进度：{{ ((selectedVideoData?.maxProgress/selectedVideoData.duration)*100).toFixed(2) > 80 ? 100 : ((selectedVideoData.maxProgress/selectedVideoData.duration)*100).toFixed(2) }}%</div>
            <div class="view-total">最大观看时长：{{ formatTime(selectedVideoData?.maxProgress) }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref} from 'vue';
import { ElMessage, genFileId } from 'element-plus';
import { Plus, Warning, Edit, Delete, DArrowLeft, DArrowRight,Location } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { 
    fetchVideoResourceTech, 
    fetchDeleteVideoResource, 
    fetchUpdateVideoResource , 
    fetchVideoResource, 
    fetchFileResource,
    fetchPlayVideoResource, 
    fetchPauseVideoResource, 
    fetchVideoResourcePlayWatch,
    fetchDeleteFileResource} from '../../apis/modules/resource'
import { TEACHER_VIDEO_LIST, BASE_ERL } from '../../content/common'
import { getStringTime, formatTime, formatTimeString } from '../../util/index'
import { useCommonStore } from '@/store'
import axios from 'axios';

onMounted(() => {
    getVideoResourceRequest();
    getFileAllResource();
})

const commonStore = useCommonStore();   

const videoResourceList: Ref<TEACHER_VIDEO_LIST[]> = ref([]);   //视频资源列表
const videoResourceListScore: Ref<TEACHER_VIDEO_LIST[]> = ref([]);   //视频资源列表--参与计分
const videoResourceListNoScore: Ref<TEACHER_VIDEO_LIST[]> = ref([]);   //视频资源列表--不参与计分

/**
 *  获取全部视频资源请求
 */
const getVideoResourceRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        let result;
        if(commonStore.userType == '学生') {
            result =  await fetchVideoResource(params)
            videoResourceList.value = result.data;
            videoResourceListScore.value = result.data.filter((item: any) => item.toScore == true);
            videoResourceListNoScore.value = result.data.filter((item: any) => item.toScore === false);
        }else {
            result =  await fetchVideoResourceTech(params)
            videoResourceList.value = result.data;
            videoResourceListScore.value = result.data.filter((item: any) => item.isScore == true);
            videoResourceListNoScore.value = result.data.filter((item: any) => item.isScore === false);
        }
    } catch (error) {
        ElMessage.error('获取视频资源失败')
    }
}
const isEditVideo = ref(false);     //是否在编辑视频 or 上传视频

const isShowUpload = ref(false);    //是否展示上传视频的编辑区
const isUploading = ref(false);      //是否正在上传

const uploadRef = ref<UploadInstance>()

const inputVideoTitle = ref('');    //上传资源时，视频标题
const inputDeadTime = ref();        //上传资源时，截止日期
const selectedVideoFile = ref();    //上传资源时，选择的资源文件
const activeSelectRadio = ref('计分') //上传资源时，是否计分

const isSelectedVideo = ref(false);       //是否选择了视频资源

const radioChange = (label: any) => {
    if (activeSelectRadio.value === label )  return 
    activeSelectRadio.value = label;
}

//点击上传视频按钮
const handleClickUploadBtn = () => {
    isShowUpload.value = true;
    isEditVideo.value = false;
}

//用户选择视频资源行为
const handleChangeFile = (video: any) => {
    isSelectedVideo.value = true;
    selectedVideoFile.value = video.raw;
    console.log(selectedVideoFile.value);
};

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
    'Authorization': `${token}`, 
  }
}

//取消上传
const handelCancelUpload = () => {
    if(isUploading.value) {
        console.log('正在上传中取消')
    }else {
        isShowUpload.value = false;
        //不是正在上传，清空输入框内容
        inputVideoTitle.value = '';
        inputDeadTime.value = '';
        selectedVideoFile.value = null;
        isSelectedVideo.value = false;
    }
}

/**
 *  上传视频资源请求
 */
const handleUploadVideo = () => {
    isUploading.value = true;
    //判断文件类型，不是mp4则解析失败
    const isExcel = selectedVideoFile.value.type === 'video/mp4'; 
    if (!isExcel) {
        ElMessage.error('只能上传 mp4 格式的文件');
        isUploading.value = false;
        return
    }
    let formData = new FormData();
    formData.append('file', selectedVideoFile.value);
    
    formData.append('courseId', commonStore.activeClass.courseId);
    formData.append('title', inputVideoTitle.value);
    formData.append('deadTime', new Date(inputDeadTime.value).getTime().toString());
    formData.append('toScore', activeSelectRadio.value == '计分'? 'true' : 'false');

    axios.post('http://localhost:1023/video/uploadVideo', formData, config)
        .then((response: any) => {
            isUploading.value = false;
            ElMessage.success('上传成功')
            //重新获取视频资源
            isUploading.value = false;
            getVideoResourceRequest()
        })
        .catch((error: any) => {
            console.error('Error:', error);
        });
}

const isPlayingId = ref();     // 当前正在播放的视频资源的id

const selectedVideoData = ref<TEACHER_VIDEO_LIST>();     //点击的视频资源item

//点击视频item的编辑按钮
const handleClickEdit = (item: any) => {
    selectedVideoData.value = item;
    //展示编辑区且设置状态为“编辑”
    isEditVideo.value = true;
    isShowUpload.value = true;

    inputVideoTitle.value = item.title;
    inputDeadTime.value = item.deadTime;
    activeSelectRadio.value = item.toScore == true ? '计分' : '不计分';
}

const isPlay = ref(false);      //播放视频大屏 or 视频资源列表
const isPlayingVideo = ref(false);     //是否正在播放视频

const isCollapse = ref(false);     // 是否折叠菜单
const activeMenuIndex = ref('');     // 当前激活的菜单项索引
const currentTime = ref(0);          //当前视频的播放进度（xxx s）

const videoElementRef = ref(null);      //视频播放器DOM

//点击视频资源item
const handleClickVideoItem = (item: any) => {
    if(commonStore.userType == '教师') return
    isPlay.value = true;
    selectedVideoData.value = item;
    const index = videoResourceList.value.findIndex((video: TEACHER_VIDEO_LIST) => video.id == item.id);
    activeMenuIndex.value = `1-${index}`;
}

//点击返回视频列表
const handleClickBack = () => {
    isPlay.value = false;
    getVideoResourceRequest()
}

//点击视频菜单
const handleClickMenuItem = (item: any) => {
    selectedVideoData.value = item;
}

//开始播放视频
const handlePlay = async (event: any) => {
    console.log('当前开始事件',Math.round(event))
    try {
        const params = {
            videoId: selectedVideoData.value.id,
            timing: currentTime.value
        }
        await fetchPlayVideoResource(params);
        // 启动定时器，每30秒发送一次检查状态接口请求
        timerId = setInterval(watchPlayStatus, 30000);

        // 如果页面不可见，则暂停播放
        if (!isPageVisible) {
            event.target.pause();
        }

    } catch (error: any) {
        if(error.message == '开始时间超过最大进度') {
            //更新最大进度,暂停视频播放
            selectedVideoData.value.maxProgress = error.data;
            event.target.currentTime = selectedVideoData.value.maxProgress;
            event.target.pause()
        }
        ElMessage.error(error.message);
    }
}

//暂停播放视频
const handlePause = async () => {
    isPlayingVideo.value = false;
    console.log("视频暂停播放",currentTime.value);
    try {
        const params = {
            videoId: selectedVideoData.value.id,
            timing: currentTime.value
        }
        await fetchPauseVideoResource(params);
        // 停止定时器
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

//更新视频进度
const handleTimeUpdate = (event:any) => {
    currentTime.value = Math.round(event.target.currentTime);
    if(currentTime.value > selectedVideoData.value.maxProgress) {
        selectedVideoData.value.maxProgress = currentTime.value
    }
    console.log("进度", currentTime.value);
}

let timerId: number | null = null; // 定时器 ID

/**
 *  检查状态接口请求
 */
const watchPlayStatus = async() => {
    try {
        const params = {
            videoId: selectedVideoData.value.id,
            timing: currentTime.value
        }
        await fetchVideoResourcePlayWatch(params);
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isPageVisible = ref(false);     //当前标签页是否可见

/**
 *  用户切换浏览器标签页，视频播放暂停
 */
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        isPageVisible.value = true;
    } else {
        isPageVisible.value = false;
        if(isPlay.value == true) {
            videoElementRef.value.pause();
        }
    }
});

/**
 *  鼠标移开当前项目的窗口，视频暂停
 */
document.addEventListener('mouseleave', function() {
    if(isPlay.value == true) {
        videoElementRef.value.pause();
    }
});

/**
 *  删除视频资源请求
 */

 const deleteVideoRequest = async(videoId: number) => {
    try {
        const params = {
            videoId
        }
        await fetchDeleteVideoResource(params);
        ElMessage.success('删除成功')
        getVideoResourceRequest();
    } catch (error) {
        ElMessage.error('删除失败')
    }
 }


/**
 *  更改视频资源请求
 */
const editVideoRequest = async () => {
    try {
        const params = {
            courseId:commonStore.activeClass.courseId,
            deadTime: new Date(inputDeadTime.value).getTime(),
            id: selectedVideoData.value?.id,
            title: inputVideoTitle.value,
            toScore: activeSelectRadio.value === '计分' ? true : false
        }
        await fetchUpdateVideoResource(params);
        ElMessage.success('更新成功');
        getVideoResourceRequest();

    } catch (error) {
        ElMessage.error('更新失败')
    }
}

const fileResourceList = ref([]);   //文档资源列表

/**
 *  获取全部文件资源
 */
const getFileAllResource = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const res = await fetchFileResource(params);
        fileResourceList.value = res.data;
        console.log('文件资源列表', fileResourceList.value)
    } catch (error) {
        ElMessage.error('获取文件资源失败')
    }
}

/**
 *    下载文件资源
 */
const handleDownLoad = async (item: any) => {
    try {
        axios.get(`http://localhost:1023/file/courseFiles/download/${item.depositFilename}`, config)
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

/**
 *  删除文件资源请求
 */
const handleDeleteRequest = async (id: number) => {
    try {
        await fetchDeleteFileResource({
            fileId: id
        })
        ElMessage.success('删除成功')
        getFileAllResource();
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isShowUploadFile = ref(false);        //是否展示上传文档资源编辑区

const isSelectedFile = ref(false);      //是否选中文件资源
const selectedFileFile = ref(null);         //选中的文件资源文件
const inputFileTitle = ref('');         //输入的文档标题

const isUploadingFile = ref(false);     //是否正在上传文件

//用户选择视频资源行为
const handleChangeFileResource = (video: any) => {
    isSelectedFile.value = true;
    selectedFileFile.value = video.raw;
    console.log(selectedFileFile.value);
};

/**
 *  发送文件上传请求
 */
const handleUploadFile = async () => {
    if(inputFileTitle.value == '') {
        return ElMessage.error('请输入文档标题')
    }
    if(!selectedFileFile.value) {
        return ElMessage.error('请选择文档资源')
    }
    if(isUploadingFile.value) {
        return ElMessage.error('正在上传中，请稍等')
    }
    isUploadingFile.value = true;
    let formData = new FormData();
    formData.append('file', selectedFileFile.value);
    formData.append('courseId', commonStore.activeClass.courseId);
    formData.append('title', inputFileTitle.value);

    axios.post('http://localhost:1023/courseFile/commitFile', formData, config)
        .then((response: any) => {
            ElMessage.success('上传成功')
            //重新获取视频资源
            isUploadingFile.value = false;
            getFileAllResource()
        })
        .catch((error: any) => {
            console.error('Error:', error);
        });
}

</script>

<style scoped lang="scss">
.divide {
    width: 100%;
    height: 1px;
    margin-top: 10px;
    margin-bottom: 8px;
    background-color: #ccc;
}

//空状态
.resource-video-empty,.resource-file-empty {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    flex-flow: column nowrap;
    align-items: center;
    gap: 10px;
    img {
        width: 100px;
    }
    span {
        font-size: 12px;
        color: #999;
    }
}
//资源中的空状态
.empty-video-list {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #999;
}
.resource {
    .resource-video {
        min-height: 200px;
        margin-bottom: 20px;
        .resource-video-title {
            display: flex;
            margin-right: 10px;
            justify-content: space-between;
            font-size: 15px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
                color: #4186ff;
            }
        }
        .resource-video-list {
            padding: 0px 20px;
            .list-score,.list-no-score {
                margin-bottom: 10px;
                .list-item {
                    width: 270px;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0px 0px 2px rgba(0,0,0,0.3);
                    .list-item-title {
                        padding: 6px 10px;
                        font-weight: 600;
                    }
                    .list-item-video {
                        width: 100%;
                        height: 160px;
                        video {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .list-item-time {
                        display: flex;
                        padding: 0px 8px;
                        font-size: 12px;
                        color: #999;
                        margin-bottom: 8px;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .list-item-total {
                        font-size: 12px;
                        font-weight: 600;
                        padding: 0px 8px;
                        color: #999;
                    }
                    .list-item-btn {
                        display: flex;
                        padding: 0px 8px 8px 0;
                        justify-content: flex-end;
                        gap: 10px;
                        color: #999;
                        cursor: pointer;
                        .edit:hover {
                            color: #409eff;
                        }
                        .delete:hover {
                            color: #f56c6c;
                        }
                    }
                }
            }
        }
        .resource-video-upload {
            padding: 10px 10px;
            background-color: #f8fbff;
            font-size: 14px;
            border-radius: 8px;
            .upload-title {
                margin-left: 10px;
                font-weight: 600;
            }
            .upload-form {
                display: flex;
                flex-flow: column nowrap;
                gap: 10px;
                padding: 8px 20%;
                margin-bottom: 10px;
                background-color: #fff;
                border-radius: 4px;
                .upload-form-video {
                    display: flex;
                    justify-content:flex-start;
                    margin-left: 30px;
                    .video {
                        width: 100px;
                    }
                    .video-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        .iconfont {
                            font-size: 30px;
                            color: #409eff;
                        }
                        .video-info-content {
                            display: flex;
                            flex-flow: column nowrap;
                            justify-content: center;
                            .title {
                                font-size: 14px;
                            }
                            .size {
                                font-size: 12px;
                                color: #999;
                            }
                        }
                    }
                }
                .upload-form-score {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                    margin-left: 16px;
                    .icon {
                        margin-left: 4px;
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
            }
            .upload-btn {
                display: flex;
                margin-bottom: 10px;
                justify-content: flex-end;
            }
        }
    }

    .resource-file {
        .resource-file-title {
            display: flex;
            margin-right: 10px;
            justify-content: space-between;
            font-size: 15px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
                color: #4186ff;
            }
        }
        .resource-file-upload {
            padding: 10px;
            background-color: #f8fbff;
            border-radius: 4px;
            .upload-title {
                font-weight: 600;
                font-size: 14px;
            }
            .upload-form {
                display: flex;
                flex-flow: column nowrap;
                gap: 10px;
                padding: 8px 20%;
                margin-bottom: 10px;
                background-color: #fff;
                border-radius: 4px;
                .upload-form-file {
                    margin-left: 30px;
                    display: flex;
                    .file-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border: 1px solid #cccccc8d;
                        border-radius: 4px;
                        padding: 4px 10px;
                        .iconfont {
                            color: #409eff;
                            font-size: 26px;
                        }
                        .file-info-content {
                            display: flex;
                            flex-flow: column nowrap;
                            justify-content: center;
                            .title {
                                font-size: 14px;
                            }
                            .size {
                                font-size: 12px;
                                color: #999;
                            }
                        }
                    }
                }
            }
            .upload-btn {
                display: flex;
                margin-bottom: 10px;
                justify-content: flex-end;
            }
        }
        .resource-file-list {
            margin-top: 10px;
            margin-left: 20px;
            margin-right: 30px;
            margin-bottom: 40px;
            display: flex;
            flex-flow: column nowrap;
            gap: 20px;
            .resource-file-list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                border: 1px solid #cccccc8d;
                border-radius: 4px;
                transition: all 0.3s;
                .item-left {
                    display: flex;
                    gap: 20px;
                    .iconfont {
                        font-size: 30px;
                        color: #4186ff;
                    }
                    .item-left-info {
                        display: flex;
                        flex-flow: column nowrap;
                        gap: 4px;
                        .title {
                            font-size: 14px;
                        }
                        .size {
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
                .item-right {
                    font-size: 14px;
                    cursor: pointer;
                    .downLoad,.delete {
                        color: #409eff;
                        margin-right: 20px;
                    }
                }
            }
            .resource-file-list-item:hover {
                box-shadow: 0px 0px 3px rgba($color: #000000, $alpha: 0.2);
            }
        }
    }
}

.play {
    display: flex;
    .paly-video {
        flex:1;
        .play-video-ico {
            display: flex;
            .icon {
                cursor: pointer;
            }
            .icon:hover {
                color: #409eff;
            }
            .back {
                margin-left: 20px;
                font-size: 12px;
                cursor: pointer;
            }
            .back:hover {
                color: #409eff;
            }
            .title {
                margin-left: 250px;
                font-size: 18px;
                font-weight: 600;
            }
        }
        .play-video-video {
            .video {
                width: 100%;
            }
        }
        .view-count {
            display: flex;
            margin-left: 20px;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .view-total {
            margin-left: 20px;
            margin-top: 10px;
            font-size: 14px;
        }
    }
}

//菜单样式
.el-menu-vertical-demo{
    min-height: 91vh;
}
.tabs-temp {    
    padding: 2px 8px;
    margin-right: 8px;
    border-radius: 4px;
    background: #dee5f5;
    font-size: 14px;
    cursor: pointer;
}
.tabs-temp.selected {     
    background: #409eff;
    color: #fff;
}
</style>