//学生、教师、管理员端----课程列表接口
export interface Course {
    addCode: string ;   //加课码
    courseId: number ;   //课程id
    courseName: string;  //课程名
    courseNumber: number; //课程号
    createTime: string;   //创建时间
    isOver: boolean;      //是否结课
    stuNum: number;       //学生总人数
    teacherHeadImg: any; //教师头像
    teacherName: any;    //教师名称
}