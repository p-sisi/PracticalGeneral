<template>
    <!-- 管理员端：头部 -->
    <div class="header">
        <!-- 左部 -->
        <div class="header-left">
            <span class="iconfont icon-shuben-book3"></span>
            <div>实训管理系统（后台）</div>
        </div>

        <!-- 右部 -->
        <div class="header-right">
            <div class="header-right-mess">{{ 1 }}</div>
            <span class="iconfont icon-xiaoxi" style="cursor: pointer;"></span>
            <div>
                <el-avatar :icon="UserFilled" size="small" :src="`${BASE_ERL}/file/images/${commonStore.userInfo.headImg}`"> </el-avatar>
            </div>
            <div class="header-right-user">
                <span>管理员：{{ commonStore.userInfo.name }}</span>
            </div>
            <div class="header-right-dropdown">
                <el-dropdown>
                    <div class="icon">
                        <el-icon><arrow-down /></el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleChangePassword">修改密码</el-dropdown-item>
                            <el-dropdown-item divided @click="handleLoginOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="header-right-divide"></div>
            <span class="iconfont icon-tuichu" style="cursor: pointer;"></span>
            <el-popconfirm title="确定要退出登录吗？" @confirm="handleLoginOut">
                <template #reference>
                    <span class="header-right-exit">退出</span>
                </template>
            </el-popconfirm>
        </div>
    </div>

</template>

<script setup lang="ts">
import { UserFilled, ArrowDown  } from '@element-plus/icons-vue';
import { useCommonStore } from '@/store'
import router from '../../router';
import { BASE_ERL } from '../../content/common'

const commonStore = useCommonStore();

//退出登录
const handleLoginOut = () => {
    router.push('/login');
    //清空store中数据
    commonStore.initStore();
    //清除localStorage中的token
    localStorage.removeItem('Token');
}

//修改密码
const handleChangePassword = () => {
    
}
</script>

<style lang="scss" scoped>
$primary-color: #4186ff;

.header {
    width: 100%;
    height: 40px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    background-color: $primary-color;

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
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 14px;
        margin-right: 16px;
        color: #fff;
        &-mess {
            position: relative;
            width: 12px;
            height: 12px;
            margin-top: -14px;
            margin-right: -34px;
            font-size: 10px;
            line-height: 12px;
            text-align: center;
            border-radius: 6px;
            background-color: #f64656;
            cursor: pointer;
            z-index: 999;
        }
        &-user {
            margin-left: -8px;
            font-size: 12px;
        }
        &-dropdown {
            .icon {
                color: #fff;
                margin-top: 6px;
                cursor: pointer;
            }
        }
        &-divide {
            width: 1px;
            height: 14px;
            background-color: #ccc;
        }
        &-exit {
            font-size: 12px;
            cursor: pointer;
        }
    }
}
</style>