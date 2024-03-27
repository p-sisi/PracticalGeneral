<template>
    <div class="notice">
        <!-- 公告操作 -->
        <div class="notice-btn">
            <el-popconfirm title="确定将所有公告标为已读？" @confirm="handleAllRead">
                <template #reference>
                    <div class="read">全部标为已读</div>
                </template>
            </el-popconfirm>
            <div class="refresh" @click="handleRefresh">
                <el-icon :class="{ 'is-loading' : isRefreshLoading }" style="display: block;margin-top: 4px;margin-right: 4px;">
                    <Loading />
                </el-icon>
                <div >刷新</div>
            </div>
        </div>

        <!-- 公告列表 -->
        <div class="notice-item">
            <div 
                class="item"
                v-for="item in NOTICE_LIST_DATA"
                :class="{ 'read': item.status === 1, 'unread': item.status === 0 }"
            >
                <div class="item-title">
                    <div>{{ item.title }}</div>
                    <span style="color:#ccc;font-size: 14px;" v-if="item.status === 1">已读</span>
                    <span style="color: #4186ff;cursor: pointer;font-size: 14px;" v-else @click="handleRead(item)">标为已读</span>
                </div>
                <div class="item-content">{{item.content}}</div>
                <div class="item-footer">
                    <div>发布者：{{ item.publisher }}</div>
                    <div>发布：{{ item.createTime }}</div>
                    <div>最近一次更新：{{item.updateTime}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NOTICE_LIST_DATA } from '../../content/student';
import { Loading } from '@element-plus/icons-vue'


//全部标为已读
const handleAllRead = () => {

}

//刷新公告
const isRefreshLoading = ref(false);
const handleRefresh = () => {
    if(isRefreshLoading.value == true) return
    //TODO:刷新，重新请求公告

    //刷新结束
    isRefreshLoading.value = true;
}

const handleRead = (item: any) => {
    //TODO：根据id修改公告状态
}
</script>

<style scoped lang="scss">
.notice {
    &-btn {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
        font-size: 14px;
        margin: 10px 26px 16px 0px;
        cursor: pointer;
        .read {
            color: #1472FF;
        }
        .refresh {
            display: flex;
        }
    }

    &-item {
        width: 93%;
        .item {
            width: 100%;
            padding: 14px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0px 0px 10px #ebeaeac9;
            &-title {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                div {
                    font-weight: 600;
                    font-size: 20px;
                }
            }
            &-content {
                font-size: 14px;
            }
            &-footer {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 13px;
                color: #908d8d;
            }
        }
        .read {
            color: #c1c1c1;
            .item-footer {
                color: #c1c1c1;
            }
        }
    }
}
</style>