<template>
    <!-- 教师列表 -->
    <div v-if="adminStore.isShowTeacherList == true">
    <!-- 搜索区 -->
    <div class="search">
        <div class="search-title">
            <div class="time">
                <span>创建时间</span>
                <el-date-picker
                    v-model="inputDate"
                    type="date"
                    placeholder="请选择年月日"
                    :disabled-date="disabledDate"
                    :shortcuts="shortcuts"
                />
                </div>
                <div>
                    <span>账号状态</span>
                    <el-select v-model="status" placeholder="账号当前状态" clearable style="width: 160px">
                        <el-option label="启用中" value="启用中" />
                        <el-option label="禁用" value="禁用" />
                    </el-select>
                </div>
                <div>
                    <span>教师名称</span>
                    <el-input v-model="inputTeacherName" style="width: 180px" placeholder="请输入教师名称" />
                </div>
                <div>
                    <span>账号</span>
                    <el-input v-model="inputTeacherAccount" style="width: 180px" placeholder="请输入账号" />
                </div>
            </div>
            <div class="search-button">
                <el-button type="primary" @click="handleSearch" color="#4186ff">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
    </div>

    <!-- 列表区 -->
    <div class="table">
        <!--  标题及添加新课程 -->
        <div class="table-title">
            <div class="title">教师列表</div>
            <div class="new" >
                <div @click="handleClickNew()">+&nbsp;创建教师账号</div>
                <div style="display: flex;align-items: flex-start;gap: 10px">
                    <el-button type="primary" @click="handleClickMultiple()">批量创建</el-button>
                    <el-tooltip placement="top" effect="light" content="一次创建多个教师账号">
                        <el-icon><InfoFilled /></el-icon>
                    </el-tooltip>
                </div>
            </div>
        </div>

        <!-- 课程列表表格 -->
        <div class="table-list">
            <el-table :data="tableList" height="450" stripe>
            <el-table-column fixed prop="account" label="账号" width="120px" />
            <el-table-column prop="name" label="名称" width="80" />
            <el-table-column fixed prop="password" label="密码" width="140px" />
            <el-table-column prop="email" label="绑定邮箱" width="110">
                <template #default="scope">
                    <span v-if="scope.row.email == null">未绑定</span>
                    <span v-else>{{ scope.row.email }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="绑定手机号" width="110">
                <template #default="scope">
                    <span v-if="scope.row.phone == null">未绑定</span>
                    <span v-else>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isEnable" label="账号状态" width="90">
                <template #default="scope">
                    <span v-if="scope.row.isEnable == false" class="isEnable">禁用</span>
                    <span v-else class="isDoing">启用中</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
                <template #default="scope">
                    <span>{{getStringTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
    </div>
    </div>

    <!-- 编辑、新建教师 -->
    <div v-else>
        <TeacherEdit></TeacherEdit>
    </div>
</template>

<script setup lang="ts">
import TeacherEdit from './TeacherEdit.vue'
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { ref, onMounted, Ref } from 'vue'
import { fetchAllTeacher } from '../../apis/modules/user'
import { TACH_LIST } from '../../content/common'
import { getStringTime } from '../../util/index'
import { useAdminStore } from '@/store'

onMounted(() => {
    getTeacherList()
})

const adminStore = useAdminStore();

const tableList: Ref<TACH_LIST[]> = ref([]);    //教师列表信息
const tableListAll = ref(); //暂存所有教师列表

/**
 *  获取教师列表
*/
const getTeacherList = async () => {
    try {
        const result = await fetchAllTeacher();
        tableList.value = result.data;
        tableListAll.value = result.data;
    } catch (error) {
        ElMessage.error('获取教师列表失败')
    }
}

//搜索
const inputDate = ref();
const status = ref();
const inputTeacherName = ref();
const inputTeacherAccount = ref();

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一个星期前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

const handleSearch = () => {
    const filteredList = tableListAll.value.filter((teacher: any) => {
        const createTimeMatched = !inputDate.value || new Date(teacher.createTime) >= inputDate.value;
        const statusMatched = status.value ? teacher.isEnable === (status.value === '启用中') : true;
        const nameMatched = inputTeacherName.value === null || teacher.name.includes(inputTeacherName.value);
        const accountMatched = inputTeacherAccount.value === null || teacher.account.includes(inputTeacherAccount.value);
        return createTimeMatched && statusMatched && nameMatched && accountMatched;
    });

    tableList.value = filteredList;
}

const handleReset = () => {
    inputDate.value = '';
    status.value = '';
    inputTeacherName.value = '';
    inputTeacherAccount.value = '';

    getTeacherList();
}

//点击添加教师
const handleClickNew = () => {
    adminStore.setIsShowTeacherList(false);
    adminStore.setIsEditTeacher(false)
}

//点击批量创建
const handleClickMultiple = () => {
    //展示创建页面
    adminStore.setIsShowTeacherList(false);
    //展示创建页面中的批量导入
    adminStore.setIsShowMultipleCreate(true);
}

//表格操作
const handleEdit = (row: any) => {
    adminStore.setIsShowTeacherList(false);
    adminStore.setIsEditTeacher(true);
    //保存当前教师信息
    adminStore.setActiveTeacherItem(row);
}

const handleDelete = (index: number, row: any) => {
    //TODO:执行删除课程请求操作，出现确认弹窗
  console.log(index, row)
}


</script>

<style lang="scss" scoped>
.search {
    width: 100%;
    height: auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    .search-title {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            gap: 10px;
           
            span {
                font-size: 14px;
                margin-right: 10px;
            }
        }
        .search-button {
            margin-top: 16px;
        }
}

//表格
.table {
    width: 100%;
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    .table-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        .title {
            font-weight: 600;
        }
        .new {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 10px;
            color: #4186ff;
            font-size: 14px;
            cursor: pointer;
        }
    }
    .table-list {
        .isDoing {
            padding: 4px 8px;
            color: #67c23a;
            background-color: #f0f9eb;
        }
        .isEnable {
            padding: 4px 4px;
            color: #909399;
            background-color: #f4f4f5;
        }
    }
}
</style>