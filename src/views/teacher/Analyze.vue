<template>
    <div class="title">学生成绩分析</div>
    <!-- 学生成绩详细分析 -->
    <div class="analyze">
        <div>共&nbsp;<span style="font-weight: 600">{{commonStore.activeClass.stuNum}}</span>&nbsp;名学生</div>
        <div class="analyze-top">
            <span>最高分：<span class="score">{{highestTotalScore?.totalScore}}</span></span>
            <span>最低分：<span class="score">{{ lowestTotalScore?.totalScore }}</span></span>
        </div>
        <div class="analyze-pass">
            <span>通过率（60分及以上）：
                <span class="range">{{ (((flunkData.length-listData.length)/listData.length)*100).toFixed(2) }}%</span>
                <span class="view" @click="dialogTableVisible = true">查看</span>
            </span>
        </div>
        <div class="analyze-range">
            <span>90分以上：<span class="num">{{ nineData.length }}&nbsp;</span>人</span>
        </div>
        <div class="analyze-range">
            <span>80-90分数段：<span span class="num">{{ eightData.length }}&nbsp;</span>人</span>
        </div>
        <div class="analyze-range">
            <span>70-80分数段：<span span class="num">{{ sevenData.length }}&nbsp;</span>人</span>
        </div>
        <div class="analyze-range">
            <span>60-70分数段：<span span class="num">{{ sixData.length }}&nbsp;</span>人</span>
        </div>
    </div>

    <div class="divide"></div>

    <!-- 分析列表 -->
    <div class="list">
        <div class="list-title">
            <span>学生成绩详情</span>
            <span><el-input 
                    v-model="searchInput" 
                    style="width: 240px" 
                    placeholder="搜索学生姓名" 
                    :suffix-icon="Search" 
                    clearable 
                    @click="handleSearchDiscuss"
                    @blur="handleSearchDiscuss"
                    @keydown.enter="handleSearchDiscuss"/></span>
        </div>
        <el-table :data="listData" height="400" style="width: 100%">
            <el-table-column prop="userAccount" label="账号" width="110" align="center" />
            <el-table-column prop="userName" label="姓名" width="80" align="center"/>
            <el-table-column prop="homeworkScore.score" label="作业得分" width="110" align="center" />
            <el-table-column prop="discussionScore.score" label="讨论得分" width="110" align="center" />
            <el-table-column prop="attendanceScore.score" label="考勤得分" align="center" />
            <el-table-column prop="defenceScore.score" label="答辩得分" align="center" />
            <el-table-column prop="videoScore.score" label="资源得分" align="center" />
            <el-table-column prop="totalScore" label="总分" align="center" sortable>
                <template #default="scope">
                    <span class="score">{{ scope.row.totalScore }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 不及格人员情况表单 -->
    <el-dialog v-model="dialogTableVisible" :title="`不及格学生（共${flunkData.length}人）`" width="800">
        <el-table :data="flunkData" height="300" style="width: 100%">
            <el-table-column prop="userAccount" label="账号" width="110" align="center" />
            <el-table-column prop="userName" label="姓名" width="80" align="center"/>
            <el-table-column prop="homeworkScore.score" label="作业得分" width="110" align="center" />
            <el-table-column prop="discussionScore.score" label="讨论得分" width="110" align="center" />
            <el-table-column prop="attendanceScore.score" label="考勤得分" align="center" />
            <el-table-column prop="defenceScore.score" label="答辩得分" align="center" />
            <el-table-column prop="videoScore.score" label="资源得分" align="center" />
            <el-table-column prop="totalScore" label="总分" align="center" sortable>
                <template #default="scope">
                    <span class="score">{{ scope.row.totalScore }}</span>
                </template>
            </el-table-column>
        </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchGetScoreAnalyzeTech } from '../../apis/modules/score';
import { useCommonStore } from '../../store';
import { Search } from '@element-plus/icons-vue'

onMounted(() => {
    getListDataRequest()
})

const commonStore = useCommonStore();

const listData = ref([]);
const listDataAll = ref([])

/**
 *  获取课程的所有学生成绩
 */
const getListDataRequest = async () => {
    try {
        const params = {
            courseId: commonStore.activeClass.courseId
        }
        const result = await fetchGetScoreAnalyzeTech(params)
        listData.value = result.data
        listDataAll.value = result.data;
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const searchInput = ref('');        //搜索内容

const handleSearchDiscuss = () => {
    listData.value = listDataAll.value;
    listData.value = listDataAll.value.filter((item:any) => {
        return item.userName.includes(searchInput.value)  
    });
}

const dialogTableVisible = ref(false);

//最高分
const highestTotalScore = computed(() => {
      if (!listData.value || listData.value.length === 0) {
        return null;
      }
      return listDataAll.value.reduce((prev:any, current:any) => {
        return current.totalScore > prev.totalScore ? current : prev;
      });
});
//最低分
const lowestTotalScore = computed(() => {
      if (!listData.value || listData.value.length === 0) {
        return null;
      }
      return listDataAll.value.reduce((prev:any, current:any) => {
        return current.totalScore < prev.totalScore ? current : prev;
      });
});

//不及格学生
const flunkData = computed(() => {
    return listData.value.filter((item: any) => item.totalScore < 60)
})  
//90分及以上学生
const nineData = computed(() => {
    return listData.value.filter((item: any) => item.totalScore >= 90)
}) 
//80-90分数段
const eightData = computed(() => {
    return listData.value.filter((item: any) => {
        item.totalScore < 90 && item.totalScore >= 80
    })
}) 
//70-80分数段
const sevenData = computed(() => {
    return listData.value.filter((item: any) => {
        item.totalScore < 80 && item.totalScore >= 70
    })
}) 
//60-70分数段
const sixData = computed(() => {
    return listData.value.filter((item: any) => {
        item.totalScore < 70 && item.totalScore >= 60
    })
}) 


</script>

<style scoped lang="scss">
.title {
    font-weight: 600;
}

.analyze {
    width: 90%;
    padding: 20px;
    background-color: #f8fbff;
    border-radius: 8px;
    .analyze-top {
        display: flex;
        margin-top: 20px;
        gap: 100px;
        padding-left: 100px;
        .score {
            font-size: 20px;
            color: #f56c6c;
        }
    }
    .analyze-pass {
        margin-top: 10px;
        padding-left: 100px;
        .range {
            font-size: 20px;
            margin-right: 10px;
        }
        .view{
            font-size: 12px;
            color: #4186ff;
            cursor: pointer;
        }
    }
    .analyze-range {
        padding-left: 100px;
        margin-top: 10px;
        .num {
            font-size: 18px;
            font-weight: 600;
        }
    }
}

.divide {
    width: 90%;
    height: 1px;
    display: flex;
    margin: 10px 0px;
    margin-left: 30px;
    background-color: #cccccccc;
}

.list {
    width: 96%;
    margin-top: 20px;
    padding: 20px;
    background-color: #f8fbff;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    .list-title {
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
    }
    .score {
        color: #f56c6c;
        font-size: 18px;
    }
}
</style>