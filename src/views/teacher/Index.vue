<template>
    <div class="container">
        <el-affix>
            <div class="header">
                <!-- 左边 -->
                <div class="header-left">
                    <span class="iconfont icon-shuben-book3"></span>
                    <div>实训管理系统（教师端）</div>
                </div>

                <!-- 中间菜单头 -->
                <div class="tabs-change">
                    <div 
                        v-for="item in studentStore.menuList"   
                        @click="radioChange(item)" 
                        class="tabs-temp" 
                        :class="{ 'selected': item === activeTMenu }"
                    >
                    <!-- TODO：根据当前激活的课程名称来添加，点击课程列表的时候 -->
                        <span>{{ item }}</span>
                    </div>
                </div>

                <!-- 右边 -->
                <div class="header-right">
                    <div style="cursor: pointer;">
                        <span class="iconfont icon-xiaoxi"></span>
                        <span style="margin-left: 2px;">消息</span>
                    </div>
                    <div class="header-right-user">
                        <el-avatar :icon="UserFilled" size="small"> </el-avatar>
                        <div>教师：{{ studentStore.userName }}</div>
                        <el-dropdown>
                            <div style="color: #fff;">
                                <el-icon><arrow-down /></el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleClickClass">教学课程</el-dropdown-item>
                                    <el-dropdown-item @click="handleChangePassword">修改密码</el-dropdown-item>
                                    <el-dropdown-item divided @click="handleLoginOut">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="header-right-divide"></div>
                    <el-popconfirm title="确定要退出登录吗？" @confirm="handleLoginOut">
                        <template #reference>
                            <span class="iconfont icon-tuichu" style="cursor: pointer;"></span>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
        </el-affix>

        <div class="body">
            <!-- 学生端路由出口 -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CirclePlus, UserFilled, ArrowDown } from '@element-plus/icons-vue';
import { useStudentStore } from '@/store'
import router from '../../router';

const studentStore = useStudentStore()

// 菜单切换
const activeTMenu = ref('首页') 
const radioChange = (item:any) => {
    if (activeTMenu.value === item )  return 
    activeTMenu.value = item;
}

const handleClickClass = () => {
    //我的课程跳转
}

//修改密码
const handleChangePassword = () => {

}

//退出登录
const handleLoginOut = () => {
    router.push('/login');
    studentStore.setUserName('');
}
</script>

<style lang="scss" scoped>
// 头部菜单样式
.tabs-change {
    display: flex;   
    flex-flow: row nowrap;
    align-items: center;
    color: #fff;
    margin-left: -400px;
    .tabs-temp {   
        max-width: 50px;
        height: 30px;
        margin-right: 20px;
        font-size: 12px;
        line-height: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .tabs-temp.selected {     //选中时的样式
        border-bottom: 2px solid #fff;
        border-radius: 2px;
        font-size: 16px;
    }
}


.container {
    width: 100%;
    height: 100vh;
    .header {
        height: 50px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        background-color: #4186ff;
        &-left {
            height: 100%;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 14px;
            margin-left: 16px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            span {
                font-size: 22px;
            }
            .el-icon {
                margin-left: 40px;
                cursor: pointer;
            }
        }
        &-right {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 24px;
            margin-right: 16px;
            color: #fff;
            font-size: 14px;
            &-user{
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                gap: 2px;
                cursor: pointer;
            }
            &-divide {
                width: 1px;
                height: 14px;
                background-color: #ccc;
            }
        }
    }
}
</style>