<template>
    <div class="home">
        
        <div class="home-header">
            <div class="title">实训教学过程</div>
            <div class="introduce">解锁创新教学，畅享实训之旅！为您提供全方位的教学支持和管理工具。轻松规划、组织和追踪实训课程，让学生获得实践技能，激发潜能。</div>
            <div class="introduce">全面管理学生、教师和资源，提供实时监控和评估，助力优化教学效果。打破传统教学束缚，开启互动协作新时代！</div>
        </div>

        <!-- 左边导航栏 -->
        <el-affix :offset="100">
            <div class="home-tab">
                <div class="tabList"
                    v-for="value in ['我的教学','消息']"
                    @click="tabChange(value)" 
                    :class="{ 'selectedTab': value === teacherStore.activeHomeLeftTab }">{{ value }}</div>
            </div>
        </el-affix>

        <!-- 中间内容 -->
        <div class="home-body">
            <!-- 课程列表 -->
            <div class="class-list" v-show="teacherStore.activeHomeLeftTab == '我的教学'">
                <div style="display: flex;justify-content: space-between;">
                    <div class="title">
                        <div> 课程状态</div>
                        <div class="tabs-change">
                            <div 
                                v-for="item in CLASS_STATUS" 
                                :key="item.value"  
                                @click="classStatusChange(item.label)" 
                                class="tabs-temp" 
                                :class="{ 'selected': item.label === activeClassStatus }">{{item.label}}</div>
                        </div>
                    </div>
                    <div class="search">
                        <el-input v-model="searchClassValue" style="width: 240px" placeholder="搜索课程名称" :suffix-icon="Search"/>
                    </div>
                </div>

                <!-- 课程列表 -->
                <div class="list">
                    <div 
                        class="list-item"
                        v-for="item in classListData"
                        :key="item.classId"
                        @click="handleClickClass(item)"
                        >
                        <div class="name">{{ item.className }}</div>
                        <el-image style="width: 100%; height: 180px" :src="item.imgUrl" fit="fit" />
                        <div class="user">
                            <div class="user-num">
                                <span class="iconfont icon-yonghu2"></span>
                                <span>{{ item.studentNum }} 人</span>
                            </div>
                            <div class="user-detail">{{ item.createTime }}</div>
                            <span v-if="item.status == 1" style="color:#529949">进行中...</span>
                            <span v-else style="color: #ccc;">已结束</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 消息 -->
            <div class="notice" v-show="teacherStore.activeHomeLeftTab == '消息'">
                <!-- 公告类型 -->
                <div class="notice-type">
                    <div class="type-container">
                        <div 
                            class="type" 
                            v-for="item in ['系统消息','课程消息']" 
                            :class="{ 'selected': item === activeNoticeType }" 
                            @click="noticeTypeChange(item)"
                            >
                            {{ item }}
                        </div>
                    </div>
                    
                    <div class="btn">
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
                </div>
                <!-- 公告列表 -->
                <div class="notice-item">
                    <div 
                        class="item"
                        v-for="item in NOTICE_LIST_DATA"
                        :class="{ 'read': item.status === 1, 'unread': item.status === 0 }"
                        @click="noticeItemClick(item)"
                        >
                        <div class="item-title">
                            <div>{{ item.title }}</div>
                            <span style="color:#ccc;font-size: 14px;" v-if="item.status === 1">已读</span>
                            <span style="color: #4186ff;cursor: pointer;font-size: 14px;" v-else @click="handleRead(item)">标为已读</span>
                        </div>
                        <div class="item-content">{{item.content}}</div>
                        <div class="item-footer">
                            <div>来源：{{ item.resource }}</div>
                            <div>发布：{{ item.createTime }}</div>
                            <div>最近一次更新：{{item.updateTime}}</div>
                            <div>发布者：{{ item.publisher }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search, Loading } from '@element-plus/icons-vue';
import { useTeacherStore } from '@/store';
import { CLASS_STATUS, CLASS_LIST_DATA } from '../../content/teacher';
import { NOTICE_LIST_DATA } from '../../content/student'
import router from '@/router/index.ts';

const teacherStore = useTeacherStore();

const tabChange = (label: any) => {
    //当重复点击时，取消选中
    if (teacherStore.activeHomeLeftTab === label )  return 
    teacherStore.setActiveHomeLeftTab(label);
}

let classListData = ref();

const activeClassStatus = ref('全部');
const classStatusChange = (label: any) => {

    if (activeClassStatus.value === label )  return 
    activeClassStatus.value = label;

    //初始化全部数据
    classListData.value = CLASS_LIST_DATA;

    if(label === '进行中') {
        classListData.value = classListData.value.filter( (item: any)=> item.status == 1)
    }else if(label === '已结束') {
        classListData.value = classListData.value.filter( (item: any)=> item.status == 0)
    }
}

//搜索
const searchClassValue = ref('');
const handleSearch = () => {
    //搜索课程名称
}

//点击课程item
const handleClickClass = (item:any) => {
    teacherStore.setActiveClass(item);

    if(!teacherStore.homeHeaderMenuList.includes(item.className)) {
        teacherStore.addHomeHeaderMenuList(item.className);
    }
        
    teacherStore.setActiveHomeHeaderMenu(item.className);

    //TODO:跳转到课程详情页的第一个路由
    router.push({ name: 'resource'});

}

// 公告
const activeNoticeType = ref('系统消息') //默认选中
const noticeTypeChange = (label: any) => {
    if (activeNoticeType.value === label )  return 
    activeNoticeType.value = label;
}

const handleRead = (item: any) => {
    //TODO：根据id修改公告状态
}


const handleAllRead = () => {
    //TODO:公告已读
}

//刷新公告
const isRefreshLoading = ref(false);
const handleRefresh = () => {
    if(isRefreshLoading.value == true) return
    //TODO:刷新，重新请求公告

    //刷新结束
    isRefreshLoading.value = true;
}

onMounted(() => {
    classListData.value = CLASS_LIST_DATA;
})
</script>

<style scoped lang="scss">
.home {
    &-header {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        height: 120px;
        background-image: url('../../assets/images/student-home.jpg');
        background-size: 100% 100%;
        .title {
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 6px;
        }
        .introduce {
            font-size: 12px;
        }
        .input {
            margin-top: 20px;
            ::v-deep .el-input__wrapper {
                font-size: 12px;
            }
            ::v-deep .el-input-group__append {
                background-color: #4186ff;
                color: #fff;
            }
        }
    }

    &-tab {
        float: left;
        width: 140px;
        height: 100px;
        margin-top: 10px;
        margin-left: 20px;
        color: #fff;
        .tabList {
            height: 50px;
            margin-bottom: 1px;
            text-align: center;
            line-height: 50px;
            background-color: #f4f6fa;
            border-radius: 4px;
            color: black;
            cursor: pointer;
        }
        .selectedTab {
            background-color: #4186ff;
            border-radius: 4px;
            color: #fff;
        }
    }

    &-body {
        padding: 20px 40px;
        margin-left: 180px;

        .class-list {
            .title {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
                .tabs-change {
                    display: flex;  
                    flex-direction: row;
                    .tabs-temp {   
                        height: 32px;
                        padding: 2px 16px;
                        margin-right: 8px;
                        border-radius: 4px;
                        background: #f4f6fa;
                        font-size: 14px;
                        line-height: 32px;
                        cursor: pointer;
                    }
                    .tabs-temp.selected {     
                        background: #e9f2ff;
                        color: #1472FF;
                    }
                }
            }
            .list {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                gap: 40px;
                padding: 20px 30px;
                &-item {
                    min-width: 260px;
                    min-height: 260px;
                    border-radius: 10px;
                    box-shadow: 0px 0px 10px #ccc;
                    transition: all .3s;
                    .name {
                        width: 100%;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        font-weight: 600;
                    }
                    .user {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 10px;
                        font-size: 15px;
                        margin: 0px 16px;
                        &-detail,&-num {
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
                &-item:hover {
                    box-shadow: 0px 0px 10px #5a8bd6;
                }
            }
        }

                // 公告
                .notice {
            &-type {
                width: 84%;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                gap: 20px;
                .type-container {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    gap: 20px;
                    .type {
                        width: 80px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        cursor: pointer;
                    }
                }
                .btn {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    font-size: 14px;
                    margin-top: 10px;
                    cursor: pointer;
                    .read {
                        color: #1472FF;
                    }
                    .refresh {
                        display: flex;
                    }
                }
                .selected {
                    border-bottom: 2px solid #1472FF;
                    color: #1472FF;
                    font-weight: 600;
                }
            }
            &-item {
                width: 80%;
                margin: 18px;
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
    }
}
</style>