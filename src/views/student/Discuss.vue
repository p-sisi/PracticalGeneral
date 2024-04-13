<template>
    <div class="discuss">
        <div v-if="isShowDiscussDetail == false">
        <!-- 头部 -->
        <div class="discuss-header">
            <div style="display: flex;">
                <div 
                    class="tab" 
                    v-for="value in ['全部讨论','时间排序','热度优先','我的讨论']" 
                    :class="{'isActive': activeTab === value}"
                     @click="changeTab(value)">{{ value }}</div>
                <div style="font-size: 12px;margin: 4px 0px 0px 10px; ">共{{ discussListData.length }}个讨论</div>
            </div>
            <div>
                <el-input 
                v-model="inputSearch" 
                style="width: 220px;margin-right: 20px;" 
                placeholder="请输入关键词" 
                clearable 
                :suffix-icon="Search" 
                @click="handleSearchDiscuss"
                @blur="handleSearchDiscuss"
                @keydown.enter="handleSearchDiscuss"/>
                <el-button type="success" :icon="Plus" @click="newDiscussDrawer = true">发起讨论</el-button>
            </div>
        </div>

        <!-- 讨论列表 -->
        <div class="discuss-list">
            <div class="item" v-for="item in discussListData" :key="item.id" @click="handleClickItem(item)">
                <div style="display: flex;gap: 20px;align-items: center;">
                    <div> <el-avatar :size="50"> user </el-avatar></div>
                    <div class="item-text">
                        <div class="item-text-title">{{ item.title }}</div>
                        <div class="item-text-icon">
                            <div class="name">发起者：{{ item.creatorName }}</div>
                            <div class="icon"><span class="iconfont icon-icon-"></span>{{ item.viewNum }}</div>
                            <div class="icon"><span class="iconfont icon-huifu"></span>{{ item.commentNum }}</div>
                            <div class="icon delete" v-show="commonStore.userInfo.userId == item.creatorId">
                                <el-popconfirm title="确定删除该讨论?" @confirm="handleDeleteDiscuss(item)">
                                    <template #reference>
                                        <el-icon><Delete /></el-icon>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div class="time">{{ item.createTime }}</div>
                        </div>
                    </div>
                </div>
                <div class="item-btn" @click="handleClickItem(item)">查看详情</div>
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
                <div class="back" @click="handleBack">
                    <el-icon><ArrowLeftBold /></el-icon>
                    <div>返回评论列表</div>
                </div>
                <el-button type="success" :icon="Plus" @click="newDiscussDrawer = true">发起讨论</el-button>
            </div>

            <!-- 详情 -->
            <div class="body">
                <div class="publisher">
                    <div style="font-size: 24px;font-weight: 600;">{{ activeDiscussData.title }}</div>
                    <div style="display: flex;font-size: 12px;align-items: center;margin-top: 4px;justify-content: space-between;margin-right: 20px;">
                        <div style="display: flex;gap: 20px;">
                            <span style="font-size: 14px;">发起者：{{ activeDiscussData.creatorName }}</span>
                            <div style="color: #999;"><span class="iconfont icon-icon-"></span>{{ activeDiscussData.viewNum }}</div>
                            <div style="color: #999;"><span class="iconfont icon-huifu"></span>&nbsp;{{ activeDiscussData.commentNum }}</div>
                            <div style="color: #999;margin-left: 100px;">{{ activeDiscussData.createTime }}</div>
                        </div>
                       
                        <div v-show="activeDiscussData.creatorId ==  commonStore.userInfo.userId">
                            <el-button type="danger" size="small" @click="deleteDialogVisible = true">删除</el-button>
                        </div>
                    </div>
                </div>
                <div class="content">{{ activeDiscussData.content }}</div>
                <div class="review">
                    <el-input v-model="inputDiscussText" style="width: 90%" placeholder="请输入评论内容" clearable type="textarea" :rows="1" autosize/>
                    <div style="margin-left: 10px;" @click="handleReplyDiscuss"><el-button type="primary" >发表</el-button></div>
                </div>

                <div class="reply-count">全部回复（{{ discussCommentData.length }}）</div>

                <!-- 回复列表 -->
                <div class="reply-list">
                    <div class="item"  v-for="item in discussCommentData " :key="item.id">

                        <!-- 一级回复列表 -->
                        <div style="display: flex;width: 100%;">
                            <el-avatar v-if="item.ownerHeadImg != null" :src="`${BASE_ERL}file/images/${item.ownerHeadImg}`"> user </el-avatar>
                            <el-avatar v-else> user </el-avatar>
                            <div style="margin-left: 10px;width: 100%;">
                                <div style="color: #999;font-size: 12px;">
                                    <span style="margin-right: 10px;">{{ item.ownerName }}</span>
                                    <span>{{ item.createTime }}</span>
                                </div>
                                <div class="reply-1">
                                    <div>{{ item.content }}</div>
                                    <span @click="handleReplyClick(item)">{{ isShowReplyInput && activeReplyItemId == item.id ? '收起' : '回复'}}</span>
                                    <el-popconfirm
                                        confirm-button-text="删除"
                                        cancel-button-text="取消"
                                        icon-color="#4186ff"
                                        :icon="InfoFilled"
                                        title="确定删除该回复?"
                                        @confirm="handleDeleteReply1(item)"
                                    >
                                        <template #reference>
                                            <span v-if="commonStore.userInfo.userId == item.ownerId" >删除</span>
                                        </template>
                                    </el-popconfirm>     
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
                            <div class="reply-2-title" v-show="item.secondaryCommentDTOS.length !== 0 && isShoeReplyList == false" @click="isShoeReplyList = true">
                                <span>---展开&nbsp;{{ item.secondaryCommentDTOS.length}}&nbsp;条回复<el-icon><ArrowDown /></el-icon></span>
                            </div>

                            <!-- 二级回复列表 -->
                            <div class="reply-2-list" v-for="list in item.secondaryCommentDTOS" :key="list.id" v-show="isShoeReplyList">
                                <div style="margin-top:4px;">
                                    <el-avatar :size="26" >ser</el-avatar>
                                </div>
                                <div class="text">
                                    <span>
                                        {{ list.ownerName }}<span style="color:rgba(65, 134, 255,0.6);margin: 0 4px;">回复</span>{{list.replyUserName}}
                                        &nbsp;&nbsp;&nbsp;&nbsp;{{ list.createTime }}
                                    </span>
                                    <div style="display:flex;align-items: flex-end;gap:10px;">
                                        <span class="text-text">{{ list.content }}</span>
                                        <div class="text-reply" @click="handleReplyClick2(list,item)">{{isShowReplyInputList && activeReplyItemListId == list.id ? '收起' : '回复'}}</div>
                                        <el-popconfirm
                                            confirm-button-text="删除"
                                            cancel-button-text="取消"
                                            icon-color="#4186ff"
                                            :icon="InfoFilled"
                                            title="确定删除该回复?"
                                            @confirm="handleDeleteReply2(list)"
                                        >
                                            <template #reference>
                                                <span v-if="commonStore.userInfo.userId == list.ownerId" class="text-reply">删除</span>
                                            </template>
                                        </el-popconfirm>   
                                    </div>
                                    <div v-show="isShowReplyInputList && activeReplyItemListId == list.id" style="display: flex;align-items: flex-end;gap: 8px;">
                                        <el-input 
                                            v-model="inputReplyText" 
                                            style="width: 90%;margin-top: 8px;" 
                                            :rows="1" 
                                            type="textarea" 
                                            placeholder="请输入" 
                                            autosize/>
                                        <el-button type="primary" :icon="Position" round size="small" @click="handleSendReply2(list,item)"/>
                                    </div>
                                </div>
                                
                            </div>
                            <div v-show="isShoeReplyList && item.secondaryCommentDTOS.length !== 0" @click="isShoeReplyList = false" class="reply-2-up">
                                -----收起<el-icon><ArrowUp /></el-icon>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- 删除讨论对话框 -->
        <el-dialog
            v-model="deleteDialogVisible"
            title="提示"
            width="400"
        >
            <span style="font-size: 16px;">确定删除该评论？</span>
            <span>删除后将无法恢复</span>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleDeleteDiscuss(activeDiscussData)" color="#4186ff">删除</el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref,reactive, Ref, onMounted } from 'vue';
import { Search, Plus, ArrowLeftBold, ArrowDown, ArrowUp, Position, InfoFilled, Delete } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus'
import { Discuss, Discuss_First_Reply } from '../../content/discuss'
import { BASE_ERL } from '../../content/common';
import { fetchDiscussByCourseId, fetchDiscussComment, fetchNewDiscuss, fetchReplyDiscuss, fetchDeleteReplyDiscuss, fetchDeleteDiscuss } from '../../apis/modules/discuss';
import { useCommonStore } from '@/store';

onMounted(() => {
    getDiscussListRequest();
})

const commonStore = useCommonStore();

const discussListData: Ref<Discuss[]> = ref([]);
const discussListDataAll: Ref<Discuss[]> = ref([]);

/*
*   删除讨论请求
*/
const handleDeleteDiscuss = async (item: any) => {
    try {
        const params = {
            discussionId: item.id
        }
        await fetchDeleteDiscuss(params)
        ElMessage.success('删除成功')

        deleteDialogVisible.value = false;
        isShowDiscussDetail.value = false;
        getDiscussListRequest();
    } catch (error: any) {
        console.log(error)
    }
}

const deleteDialogVisible = ref(false);

//返回讨论列表
const isShowDiscussDetail = ref(false);   //是否展示讨论详情
const handleBack = () => {
    isShowDiscussDetail.value = false;
    isShoeReplyList.value = false;
    getDiscussListRequest();
}

//获取讨论列表
const getDiscussListRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchDiscussByCourseId(params);
        discussListDataAll.value = result.data;
        discussListData.value = result.data;
    } catch (error) {
        console.log(error);
    }
}

//获取某个讨论的全部回复
const getDiscussReplyListRequest = async (id: number) => {
    try {
        const params = {
            discussionId: id
        }
        const result = await fetchDiscussComment(params);
        discussCommentData.value = result.data;
    } catch (error) {
        console.log(error)
    }
}


//讨论排序类型切换
const activeTab = ref('全部讨论');
const changeTab = (label: any) => {
    if (activeTab.value === label )  return 
    activeTab.value = label;
    if(activeTab.value === '时间排序') {
        discussListData.value = discussListData.value.sort((a:any, b:any) => {
            return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
        })
    } else if(activeTab.value === '热度优先') {
        discussListData.value = discussListData.value.sort((a:any, b:any) => {
            return b.hotDegree - a.hotDegree;
        })
    }else if(activeTab.value == '我的讨论'){
        discussListData.value = discussListData.value.filter((item:any) => commonStore.userInfo.userId == item.creatorId)
    }else {
        return getDiscussListRequest();
    }
}


//搜索
const inputSearch = ref('');   
const handleSearchDiscuss = () => {
    if(inputSearch.value === '') return discussListData.value = discussListDataAll.value;
    discussListData.value = discussListData.value.filter((item:any) => {
        return (
            item.content.includes(inputSearch.value) || 
            item.title.includes(inputSearch.value)  ||
            item.creatorName.includes(inputSearch.value)
        )
    });

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

/*
*   进行表单验证，表单验证通过
*   发起讨论请求
*/
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid:any, fields:any) => {
        if (valid) {
            try {
                const params = {
                    courseId: commonStore.activeClass.courseId,
                    content: newDiscussFromData.content,
                    title: newDiscussFromData.title,
                }
                await fetchNewDiscuss(params);
                ElMessage.success('发起讨论成功')

                newDiscussDrawer.value = false;
                inputSearch.value = '';
                activeTab.value = '全部讨论'
                formEl.resetFields();
                
                getDiscussListRequest();
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

const activeDiscussData: Ref<Discuss> = ref({
    id: 0,
    content: '',
    title: '',
    createTime: '',
    creatorHeadImg: '',
    creatorName: '',
    hotDegree: 0,
    commentNum: 0,
    viewNum: 0,
    isTop: false,
});

const discussCommentData: Ref<Discuss_First_Reply[]>= ref([]);

//点击讨论
const handleClickItem = async (item: any) => {
    isShowDiscussDetail.value = true;
    activeDiscussData.value = item;
    getDiscussReplyListRequest(item.id)
}

/*
*   回复评论请求封装
*   params: {discussionId: 0, replyId: 0, content: 内容}
*/
const replyDiscussRequest = async (content:string, parentCommentId: number, replyUserId: number) => {
    try {
        const params = {
            content,
            discussionId: activeDiscussData.value.id,
            parentCommentId,
            replyUserId,
        }
        await fetchReplyDiscuss(params);

        ElMessage.success('回复成功')
        isShowReplyInput.value = false;
        isShoeReplyList.value = true;
        getDiscussReplyListRequest(activeDiscussData.value.id)
    } catch (error) {
        console.log(error)
    }
}

/*
*   删除回复评论接口请求封装
*   @params commentId：该回复的id
*/
const deleteReplyDiscussRequest = async (id: number) => {
    try {
        const params = {
            commentId: id,
        }
        await fetchDeleteReplyDiscuss(params);
        ElMessage.success('删除成功');
        isShowReplyInput.value = false;
        getDiscussReplyListRequest(activeDiscussData.value.id)
    } catch (error) {
        console.log(error)
    }
}

//发表讨论的回复
const inputDiscussText = ref('');
const handleReplyDiscuss = async () => {
    replyDiscussRequest(inputDiscussText.value,0,0);
    inputDiscussText.value = '';
}

//二级评论是否展示
const isShoeReplyList = ref(false);

const inputReplyText = ref('');      //一级二级评论输入内容
const isShowReplyInput = ref(false);
const activeReplyItemId = ref();

//回复一级评论
const handleSendReply = (item: any) => {
    console.log(item)
    replyDiscussRequest(inputReplyText.value, item.id, item.ownerId)
}

//删除一级评论
const handleDeleteReply1 = (item: any) => {
    deleteReplyDiscussRequest(item.id);
}

const handleReplyClick = (item: any) => {
    // 当前点击的一级回复id值和激活的id值相同则直接 ！  等于空是为了首次点击
    inputReplyText.value = '';
    if(activeReplyItemId.value == item.id || activeReplyItemId.value == null) {
        isShowReplyInput.value = !isShowReplyInput.value;
        activeReplyItemId.value = item.id
        return;
    }else {
        isShowReplyInput.value = true;
        activeReplyItemId.value = item.id;
    }
}

//二级评论
const activeReplyItemListId = ref();
const isShowReplyInputList = ref(false);

//回复二级评论 
const handleSendReply2 = (list:any,item: any) => {
    replyDiscussRequest(inputReplyText.value, item.id, list.ownerId)
}

//删除二级评论
const handleDeleteReply2 = (list: any)  => {
    deleteReplyDiscussRequest(list.id)
}

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
        .item {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: center;
            padding: 12px 26px;
            margin-bottom: 18px;
            border: 1px solid #cccccc5a;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
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
                    .delete {
                        margin-top: 4px;
                    }
                    .delete:hover {
                        color: #4186ff;
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
        .item:hover {
            box-shadow: 0px 0px 4px rgba(0,0,0,0.2);
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
                                    width: 84%;
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