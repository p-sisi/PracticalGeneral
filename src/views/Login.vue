<template>
    <div class="container">
        <div  ref="animation1" class="people-json"></div> 
        <div class="login">
            <div class="login-title">
                <div 
                    v-for="item in ['登录','注册']" 
                    @click="handleChangeLogin(item)"
                    class="title-text"
                    :class="{ 'selected': item === currentStatus }"
                    > {{item}}</div>
            </div>

            <!-- 登录界面 -->
            <div class="login-input-login" v-show="currentStatus == '登录'">
                <div>
                    <span class="iconfont icon-yonghu"></span>
                    <el-input v-model="userCount" style="width: 300px" placeholder="请输入用户账号" clearable maxlength="11" ref="inputCount"/>
                </div>
                <div class="divide"></div>
                <div style="margin-top: 28px;">
                    <span class="iconfont icon-mima"></span>
                    <el-input v-model="userPassword" style="width: 300px" placeholder="请输入密码" clearable type="password" show-password maxlength="12" ref="inputPassword"/>
                </div>
                <div class="divide"></div>
            </div>
            <div class="login-forget" v-if="currentStatus == '登录'" @click="ForgetPassword">忘记密码</div>
            
            <!-- 注册界面 -->
            <div class="login-input-sign" v-show="currentStatus == '注册'">
                <div style="margin-top: 28px;">
                    <span class="iconfont icon-yonghu"></span>
                    <el-input v-model="signCount" style="width: 300px" placeholder="请输入用户账号" clearable maxlength="11" ref="inputCountRef"/>
                </div>
                <div class="divide"></div>
                <div style="margin-top: 28px;">
                    <span class="iconfont icon-mima"></span>
                    <el-input v-model="signPassword1" style="width: 300px" placeholder="请输入密码" clearable type="password" show-password maxlength="12" ref="inputPasswordRef1"/>
                </div>
                <div class="divide" ></div>
                <div style="margin-top: 28px;padding-left: 18px;">
                    <el-input v-model="signPassword2" style="width: 300px" placeholder="请再次输入密码" clearable maxlength="12" type="password" show-password ref="inputPasswordRef2"/>
                </div>
                <div class="divide" ></div>
                <div class="tips">教师账号请联系管理员创建哦</div>
            </div>

            <div class="login-btn" @click="handleLoginIn" v-if="currentStatus == '登录'">登 录 </div>
            <div class="login-btn sign" @click="handleSignUp" v-if="currentStatus == '注册'">注 册 </div>
        </div>  
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'  
import people from '../assets/iconfont/login.json'
import { ElMessage } from 'element-plus';
import { fetchLoginIn } from '../apis/modules/login';

const animation1 = ref<any>(null);
onMounted(() => {  
    lottie.loadAnimation({
        container: animation1.value,   
        renderer: 'svg',   
        loop: true,   
        autoplay: true,   
        animationData: people   
    })
})

// 登录注册状态
const currentStatus = ref('登录');
const handleChangeLogin = (item: any) => {
    if (currentStatus.value === item )  return 
    currentStatus.value = item;
}

//登录
const userCount = ref('');
const userPassword = ref('');
const inputCount = ref(null);
const inputPassword = ref(null);
const handleLoginIn  = async () => {
    if(userCount.value === '' || userPassword.value === '') {
        if(userCount.value === '') {
            ElMessage.error('用户账号不能为空');
            inputCount.value.focus();
            return
        }else{
            ElMessage.error('用户密码不能为空');
            inputPassword.value.focus();
            return 
        }
    }
    try {
        const params = {
            account: userCount.value,
            password: userPassword.value
        }
        const result = await fetchLoginIn(params);
        console.log('登录成功',result)
    } catch (error) {
        console.log('登录失败',error)
    }
}

//注册
const signCount = ref('');
const signPassword1 = ref('');
const signPassword2 = ref('');
const inputCountRef = ref(null);
const inputPasswordRef1 = ref(null);
const inputPasswordRef2 = ref(null);
const handleSignUp = () => {
    if(signCount.value === '' || signPassword1.value === '' || signPassword2.value === '') {
        if(signCount.value === '' ) {
            ElMessage.error('用户账号不能为空！');
            inputCountRef.value.focus();
        }else if(signPassword1.value === ''){
            ElMessage.error('密码不能为空！');
            inputPasswordRef1.value.focus();
        }else {
            ElMessage.error('请输入确认密码！');
            inputPasswordRef2.value.focus();
        }
    }
    if(signPassword1.value !== signPassword2.value) {
        ElMessage.error('两次输入的密码不一致！');
        inputPasswordRef1.value.focus();
        return;
    }
    //注册逻辑
}

//忘记密码
const ForgetPassword = () => {
    
}
</script>

<style lang="scss" scoped>
$primary-color: #4186ff;
.container {
    display: flex;
    flex-flow: row nowrap;
    height: 100vh;
    width: 100%;
    background: url('../assets/images/login-bgc.jpg') no-repeat;
    background-size: 100% 100%;

    .people-json {
        padding-top: 90px;
        margin-left: 140px;
        width: 28%;
    }
    .login {
        margin-top: 100px;
        margin-left: 300px;
        width: 32%;
        height: 64%;
        &-title {
            display: flex;
            flex-flow: row nowrap;
            gap: 40px;
            justify-content: center;
            align-items: flex-end;
            font-size: 26px;
            .title-text {
                color:$primary-color;
                cursor: pointer;
            }
            .selected {
                font-size: 34px;
                font-weight: 600;
                border-bottom: 3px solid $primary-color;
                border-radius: 2px;
            }
        }
        &-input-login {
            margin-top: 40px;
            margin-left: 76px;
            ::v-deep .el-input__wrapper {
                box-shadow: 0px 0px 0px 0px;
            }
            span {
                color: $primary-color;
            }
            .divide {
                height: 1px;
                width: 82%;
                background-color: #ccc;
            }
        }
        &-input-sign {
            margin-top: 40px;
            margin-left: 76px;
            ::v-deep .el-input__wrapper {
                box-shadow: 0px 0px 0px 0px;
            }
            span {
                color: $primary-color;
            }
            .divide {
                height: 1px;
                width: 82%;
                background-color: #ccc;
            }
            .tips {
                margin-top: 26px;
                margin-left: 54px;
                color: #a8abb2;
                font-size: 11px;
            }
        }
        .sign {
            margin-top: 4px;
        }
        &-forget {
            float: right;
            margin: 8px 80px;
            font-size: 12px;
            color: $primary-color;
            cursor: pointer;
        }
        &-btn {
            width: 70%;
            height: 40px;
            margin: 100px 0px 0px 15%;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background-color: $primary-color;
            border-radius: 8px;
            cursor: pointer;
        }
        &-btn:hover {
            background-color: #588ce6;
        }
    }
}
</style>