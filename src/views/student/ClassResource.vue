<template>
    <div class="resource">
        <!-- 视频资源 -->
        <div class="resource-video">
            <div class="resource-video-title">
                <span class="iconfont icon-video"></span>
                <span>视频</span>
                <div class="divide"></div>
            </div>
            <div class="resource-video-list">
                视频资源列表
            </div>
        </div>

        <!-- 文档资源 -->
        <div class="resource-file">
            <div class="resource-file-title">
                <span class="iconfont icon-file"></span>
                <span>文档</span>
                <div class="divide"></div>
            </div>
            <div class="resource-file-list">
                文档资源列表
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.divide {
    width: 100%;
    height: 1px;
    margin: 10px 0;
    background-color: #ccc;
}
.resource {
    &-video {
        &-title {
            font-size: 15px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
                color: #4186ff;
            }
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