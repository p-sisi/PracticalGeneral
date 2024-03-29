<template>
    <div class="discuss">
        <div v-if="isShowDiscussDetail == false">
        <!-- 头部 -->
        <div class="discuss-header">
            <div style="display: flex;">
                <div 
                    class="tab" 
                    v-for="value in ['全部评论','时间排序','热度优先']" 
                    :class="{'isActive': activeTab === value}"
                     @click="changeTab(value)">{{ value }}</div>
                <div style="font-size: 12px;margin: 4px 0px 0px 10px; ">共{{ DISCUSS_LIST_DATA.length }}个讨论</div>
            </div>
            <div>
                <el-input v-model="inputSearch" style="width: 220px;margin-right: 20px;" placeholder="请输入" clearable :suffix-icon="Search" @click="handleSearchDiscuss"/>
                <el-button type="success" :icon="Plus" @click="newDiscussDrawer = true">发起讨论</el-button>
            </div>
        </div>

        <!-- 讨论列表 -->
        <div class="discuss-list">
            <div class="item" v-for="item in DISCUSS_LIST_DATA" :key="item.id" @click="handleClickitem(item)">
                <div style="display: flex;gap: 20px;align-items: center;">
                    <div> <el-avatar :size="50"> user </el-avatar></div>
                    <div class="item-text">
                        <div class="item-text-title">{{ item.title }}</div>
                        <div class="item-text-icon">
                            <div class="name">{{ item.publisher }}</div>
                            <div class="icon"><span class="iconfont icon-icon-"></span>{{ item.viewCount }}</div>
                            <div class="icon"><span class="iconfont icon-huifu"></span>{{ item.replyCount }}</div>
                            <div class="time">{{ item.createTime }}</div>
                        </div>
                    </div>
                </div>
                <div class="item-btn">查看详情</div>
            </div>
        </div>
        </div>


        <!-- 新建评论弹窗 -->
        <el-drawer v-model="newDiscussDrawer" size="50%" :with-header="false">
            <div style="margin-bottom: 20px; font-size: 18px; font-weight: 600">发起新讨论</div>
            <el-form
                ref="newDiscussFormRef"
                style="max-width: 600px"
                :model="newDiscussFromData"
                :rules="rulesForm"
                label-width="auto"
                class="demo-ruleForm"
                status-icon
            >
                <el-form-item label="标题" prop="title">
                    <el-input v-model="newDiscussFromData.title"  type="textarea" :rows="2"/>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="newDiscussFromData.content"  type="textarea" :rows="10"/>
                </el-form-item>
            </el-form>
            <div style="display: flex;justify-content: flex-end;margin-top: 30px;"><el-button type="primary" @click="submitForm(newDiscussFormRef)">新建讨论</el-button></div>
        </el-drawer>

        <!-- 评论详情 -->
        <div class="discuss-detail" v-if="isShowDiscussDetail == true">
            <div class="header">
                <div class="back" @click="isShowDiscussDetail = false">
                    <el-icon><ArrowLeftBold /></el-icon>
                    <div>返回评论列表</div>
                </div>
                <el-button type="success" :icon="Plus" @click="newDiscussDrawer = true">发起讨论</el-button>
            </div>

            <!-- 详情 -->
            <div class="body">
                <div class="publisher">
                    <div style="font-size: 24px;font-weight: 600;">{{ activeDiscussData.title }}</div>
                    <div style="display: flex;gap: 20px;font-size: 12px;align-items: center;margin-top: 4px;">
                        <span style="font-size: 14px;">{{ activeDiscussData.publisher }}</span>
                        <div style="color: #999;"><span class="iconfont icon-icon-"></span>{{ activeDiscussData.viewCount }}</div>
                        <div style="color: #999;"><span class="iconfont icon-huifu"></span>{{ activeDiscussData.replyCount }}</div>
                        <div style="color: #999;margin-left: 100px;">{{ activeDiscussData.createTime }}</div>
                    </div>
                </div>
                <div class="content">{{ activeDiscussData.content }}</div>
                <div class="review">
                    <el-input v-model="inputDiscussText" style="width: 90%" placeholder="请输入评论内容" clearable type="textarea" :rows="1" autosize/>
                    <div style="margin-left: 10px;"><el-button type="primary" >发表</el-button></div>
                </div>

                <div class="reply-count">全部回复（10）</div>

                <!-- 回复列表 -->
                <div class="reply-list">
                    <div class="item"  v-for="item in DISCUSS_REPLY_LIST_DATA " :key="item.id">

                        <!-- 一级回复列表 -->
                        <div style="display: flex;width: 100%;">
                            <el-avatar> user </el-avatar>
                            <div style="margin-left: 10px;width: 100%;">
                                <div style="color: #999;font-size: 12px;">
                                    <span style="margin-right: 10px;">{{ item.name }}</span>
                                    <span>{{ item.time }}</span>
                                </div>
                                <div class="reply-1">
                                    <div>{{ item.text }}</div>
                                    <span @click="handleReplyClick(item)">{{isShowReplyInput && activeReplyItemId == item.id ? '收起' : '回复'}}</span>
                                    <!-- TODO：非自己的评论不展示删除入口 -->
                                    <span @click="handleDeleteReply1(item)">删除</span>
                                </div>
                                <div  v-show="isShowReplyInput && activeReplyItemId == item.id" style="display: flex;align-items: flex-end;gap: 8px;">
                                    <el-input 
                                        v-model="inputReplyText" 
                                        style="width: 92%;margin-top: 8px;" 
                                        :rows="1" 
                                        type="textarea" 
                                        placeholder="请输入" 
                                        autosize/>
                                    <el-button type="primary" :icon="Position" round size="small" @click="handleSendReply(item)"/>
                                </div>
                            </div>
                        </div>

                        <div class="reply-2">
                            <div class="reply-2-title" v-show="item.replyData.length !== 0 && isShoeReplyList == false" @click="isShoeReplyList = true">
                                <span>---展开&nbsp;{{ item.replyData.length}}&nbsp;条回复<el-icon><ArrowDown /></el-icon></span>
                            </div>

                            <!-- 二级回复列表 -->
                            <div class="reply-2-list" v-for="list in item.replyData" :key="list.id" v-show="isShoeReplyList">
                                <div style="margin-top:4px;">
                                    <el-avatar :size="26" >ser</el-avatar>
                                </div>
                                <div class="text">
                                    <span>{{ list.name }}<span style="margin-left: 10px;font-size:10px;">回复&nbsp;{{list.replyName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;{{ list.time }}</span>
                                    <div style="display:flex;align-items: flex-end;gap:10px;">
                                        <span class="text-text">{{ list.text }}</span>
                                        <div class="text-reply" @click="handleReplyClick2(list,item)">{{isShowReplyInputList && activeReplyItemListId == list.id ? '收起' : '回复'}}</div>
                                         <!-- TODO：非自己的评论不展示删除入口 -->
                                        <span class="text-reply" @click="handleDeleteReply2(list,item)">删除</span>
                                    </div>
                                    <div v-show="isShowReplyInputList && activeReplyItemListId == list.id" style="display: flex;align-items: flex-end;gap: 8px;">
                                        <el-input 
                                            v-model="inputReplyText" 
                                            style="width: 90%;margin-top: 8px;" 
                                            :rows="1" 
                                            type="textarea" 
                                            placeholder="请输入" 
                                            autosize/>
                                        <el-button type="primary" :icon="Position" round size="small" @click="handleSendReply(list)"/>
                                    </div>
                                </div>
                                
                            </div>
                            <div v-show="isShoeReplyList && item.replyData.length !== 0" @click="isShoeReplyList = false" class="reply-2-up">
                                -----收起<el-icon><ArrowUp /></el-icon>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref,reactive, nextTick, onMounted } from 'vue';
import { Search, Plus, ArrowLeftBold, ArrowDown, ArrowUp, Position } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus'
import { DISCUSS_LIST_DATA, DISCUSS_REPLY_LIST_DATA } from '../../content/student'

const isShowDiscussDetail = ref(true);

const activeTab = ref('全部评论');
const changeTab = (label: any) => {
    if (activeTab.value === label )  return 
    activeTab.value = label;
}


//搜索
const inputSearch = ref('');   
const handleSearchDiscuss = () => {
    if(inputSearch.value === '') return 
    //TODO:搜索逻辑
}

//发起讨论
const newDiscussDrawer = ref(false);
const newDiscussFormRef = ref<FormInstance>()

const newDiscussFromData = reactive({
    title: '',
    content: '',
})

const rulesForm = reactive<FormRules>({
    title: [
        { required: true, message: '请输入讨论的标题', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入讨论的内容', trigger: 'blur' },
    ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid:any, fields:any) => {
        if (valid) {
            //TODO：新建讨论请求
        } else {
            console.log('error submit!', fields)
        }
    })
}

const activeDiscussData = ref({
    id: 0,
    title: '',
    publisher:'',
    viewCount: 0,
    replyCount: 0,
    createTime:'',
    content: '1111',
});

//点击讨论
const handleClickitem = (item: any) => {
    isShowDiscussDetail.value = true;
    activeDiscussData.value = item;
    console.log('当前点击的讨论', item,activeDiscussData.value);
}

//回复评论
const inputDiscussText = ref('');
//二级评论是否展示
const isShoeReplyList = ref(false);

//一级回复
const inputReplyText = ref('');  //回复输入内容
const isShowReplyInput = ref(false);
const activeReplyItemId = ref();

const handleReplyClick = (item: any) => {
    // 当前点击的一级回复id值和激活的id值相同则直接 ！  等于空是为了首次点击
    if(activeReplyItemId.value == item.id || activeReplyItemId.value == null) {
        isShowReplyInput.value = !isShowReplyInput.value;
        activeReplyItemId.value = item.id
        return;
    }else {
        isShowReplyInput.value = true;
        activeReplyItemId.value = item.id;
    }
}

const handleDeleteReply1 = (item: any) => {
    //删除一级评论
}

const handleSendReply = (item: any) => {
    //发送回复
    console.log('回复内容',inputReplyText.value)
}

//二级评论
const activeReplyItemListId = ref();
const isShowReplyInputList = ref(false);

const handleReplyClick2 = (list: any,item: any) => {
    // list:二级回复 item:一级回复
    if(activeReplyItemListId.value == list.id || activeReplyItemListId.value == null) {
        isShowReplyInputList.value = !isShowReplyInputList.value;
        activeReplyItemListId.value = list.id
        return;
    }else {
        isShowReplyInputList.value = true;
        activeReplyItemListId.value = list.id;
    }
}

const handleDeleteReply2 = (list: any,item: any)  => {
    //删除二级评论
}
</script>

<style scoped lang="scss">
.discuss {
    margin-top: 10px;
    &-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .tab {
            margin-right: 20px;
            padding-bottom: 4px;
            cursor: pointer;
        }
        .tab.isActive {
            color: #4186ff;
            border-bottom: 2px solid #4186ff;
        }
    }

    &-list {
        margin: 18px 0px;
        padding: 20px;
        background-color: #f4f8ff;
        border-radius: 8px;
        .item {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: center;
            padding: 12px 26px;
            margin-bottom: 18px;
            background-color: #fff;
            cursor: pointer;
            .item-text {
                display: flex;
                flex-direction: column;
                gap: 16px;
                &-title {
                    font-weight: 600;
                }
                &-icon {
                    display: flex;
                    .name {
                        font-size: 14px;
                        margin-right: 24px;
                    }
                    .icon,.time {
                        font-size: 14px;
                        color: #999;
                        margin-right: 18px;
                        span {
                            margin-right: 2px;
                        }
                    }
                    .time {
                        margin-left: 160px;
                    }
                }
            }
            .item-btn {
                font-size: 14px;
                color: #4186ff;
                cursor: pointer;
            }
        }
    }

    &-detail {
        .header {
            display: flex;
            justify-content: space-between;
            .back {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 13px;
                cursor: pointer;
            }
            .back:hover {
                color: #4186ff;
            }
        }
        .body {
            margin-top: 8px;
            border-radius: 6px;
            padding: 10px;
            background-color: #f4f8ff;
            .content {
                min-height: 100px;
                margin-top: 8px;
                padding: 10px;
                background-color: #fff;
            }
            .review {
                display: flex;
                align-items: flex-end;
                margin: 18px 0px;
            }
            .reply-count {
                font-size: 12px;
            }
            .reply-list {
                margin-top: 10px;
                .item {
                    padding-top: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e6e6e6;
                    .reply-2 {
                        width: 82%;
                        margin-left: 50px;
                        margin-top: 4px;
                        font-size: 11px;
                        color: #999;
                        .reply-2-title {
                            span {
                                cursor: pointer;
                            }
                            span:hover {
                                color: #4186ff;
                            }
                        }
                        .reply-2-list {
                            display: flex;
                            gap: 8px;
                            margin-top: 10px;
                            width: 100%;
                            .text {
                                width: 100%;
                                .text-text {
                                    width: 86%;
                                    color: #213547;
                                    font-size: 12px;
                                    padding: 4px 8px;
                                    background-color: #fff;
                                    border-radius: 4px;
                                }
                                .text-reply {
                                    cursor: pointer;
                                }
                                .text-reply:hover {
                                    color: #4186ff;
                                }
                            }
                        }
                        
                        .reply-2-up {
                            margin-top: 4px;
                            cursor: pointer;
                        }
                        .reply-2-up:hover {
                             color: #4186ff;   
                        }
                    }

                }
                .reply-1 {
                    display: flex;
                    align-items: flex-end;
                    margin-top: 4px;
                    gap: 8px;
                    div {
                        width: 86%;
                        padding: 4px 8px;
                        font-size: 15px;
                        background-color: #fff;
                        border-radius: 4px;
                    }
                    span {
                        color: #999;
                        font-size: 12px;
                        cursor: pointer;
                    }
                    span:hover {
                        color: #4186ff;
                    }
                }
            }
        }
    }
}
</style>