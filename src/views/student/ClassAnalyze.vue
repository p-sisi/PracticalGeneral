<template>
    <div class="analyze">

        <!-- 头部个人信息 -->
        <div class="analyze-header">
            <el-avatar :size="60"> user </el-avatar>
            <div class="info">
                <div>
                    <span style="font-weight: 600;font-size: 18px;">{{ studentStore.userName }}</span>
                </div>
                <div style="display: flex;gap: 40px;">
                    <div class="flex-column">
                        <span>0</span>
                        <span class="font12-999">出勤</span>
                    </div>
                    <div class="flex-column">
                        <span style="color:#f56c6c;">0</span>
                        <span class="font12-999">缺勤</span>
                    </div>
                    <div class="flex-column">
                        <span>0</span>
                        <span class="font12-999">迟到</span>
                    </div>
                    <div class="flex-column">
                        <span>0</span>
                        <span class="font12-999">请假</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 作业、答辩 -->
        <div class="analyze-task">
            <div class="task">
                <span>作业</span>
                <div style="display: flex;gap: 20px;justify-content: space-between;margin: 10px 20px;">
                    <div class="part">
                        <div>9/10</div>
                        <span>参与</span>
                    </div>
                    <div class="score">
                        <div style="color: #f56c6c;">90</div>
                        <span>平均分</span>
                    </div>
                </div>
            </div>
            <div class="reply">
                <span>答辩</span>
                <div></div>
            </div>
        </div>

        <!-- 讨论 -->
        <div class="analyze-discuss">
            <div style="font-size: 20px;">讨论</div>
            <div class="list">
                <div>
                    <span>10</span>
                    <div class="font12-999">课堂发布数</div>
                </div>
                <div class="divide"></div>
                <div>
                    <span>9</span>
                    <div class="font12-999">参与数</div>
                </div>
                <div class="divide"></div>
                <div>
                    <span>2</span>
                    <div class="font12-999">被回复</div>
                </div>
            </div>
        </div>

        <!-- 资源 -->
        <div class="analyze-resource">
            <div style="font-size: 20px;">资源</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStudentStore } from '@/store'

const studentStore = useStudentStore();

</script>

<style scoped lang="scss">
.flex-column {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}
.font12-999 {
    font-size: 12px;
    color: #999;
}
.analyze {
    width: 100%;
    &-header {
        display: flex;
        gap: 20px;
        padding: 20px;
        background-color: #f4f8ff;
        border-radius: 8px;
    }
    &-task {
        display: flex;
        justify-content: space-between;
        gap: 50px;
        margin: 20px 0px;
        .task,.reply {
            width: 50%;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
            span {
                font-size: 20px;
            }
            .part,.score {
                width: 140px;
                height: 100px;
                padding: 10px;
                text-align: center;
                background-color: #f4f8ff;
                border-radius: 8px;
                box-sizing: border-box;
                div {
                    font-size: 30px;
                }
                span {
                    font-size: 13px;
                    color: #999;
                }
            }
        }
    }
    &-discuss {
        width: 100%;
        height: 160px;
        padding: 20px;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
        border-radius: 8px;
        box-sizing: border-box;
        .list {
            padding: 0px 80px;
            display: flex;
            text-align: center;
            justify-content: space-between;
            align-items: center;
            .divide {
                height: 50px;
                width: 1px;
                background-color: #999;
            }
            span {
                font-size: 30px;
            }
        }
    }

    &-resource {
        width: 100%;
        height: 200px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
        border-radius: 8px;
        box-sizing: border-box;
    }
}
</style>