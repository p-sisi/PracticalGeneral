<template>
    <div class="resource">
        <!-- 视频资源 -->
        <div class="resource-video">
            <div class="resource-video-title">
                <span class="iconfont icon-video"></span>
                <span>视频</span>
                <div class="divide"></div>
            </div>
            <div class="resource-video-list" v-if="videoResourceList.length !== 0">
                视频资源列表
            </div>
            <!-- 没有视频资源列表的空状态 -->
            <div class="resource-video-empty">
                <img src="../../assets/images/no-message.png" alt="">
                <span>暂无视频资源</span>
            </div>
        </div>

        <!-- 文档资源 -->
        <div class="resource-file">
            <div class="resource-file-title">
                <span class="iconfont icon-file"></span>
                <span>文档</span>
                <div class="divide"></div>
            </div>
            <div class="resource-file-list" v-if="fileResourceList.length !== 0">
                文档资源列表
            </div>
            <!-- 没有视频资源列表的空状态 -->
            <div class="resource-file-empty">
                <img src="../../assets/images/no-message.png" alt="">
                <span>暂无文档资源</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import { fetchVideoResource } from '../../apis/modules/resource'
import { useCommonStore } from '@/store'

onMounted(() => {
    getVideoResourceRequest()
})

const commonStore = useCommonStore();   

const videoResourceList = ref([]);   //视频资源列表

/**
 *  获取全部视频资源请求
 */
const getVideoResourceRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchVideoResource(params)
        videoResourceList.value = result.data
    } catch (error) {
        ElMessage.error('获取视频资源失败')
    }
}

const fileResourceList = ref([]);   //文档资源列表

</script>

<style scoped lang="scss">
.divide {
    width: 100%;
    height: 1px;
    margin: 10px 0;
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

.resource {
    &-video {
        min-height: 200px;
        &-title {
            font-size: 15px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
                color: #4186ff;
            }
        }
        .resource-video-list {
            padding: 10px 20px;
        }
    }

    &-file {
        &-title {
            font-size: 15px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
                color: #4186ff;
            }
        }
    }
}
</style>