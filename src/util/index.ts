//讲Data格式转换为字符串格式"YYYY-MM-DD HH:mm:ss"

export function getStringTime(date: string) {
    var time = new Date(date);
    var year = time.getFullYear();
    var month = ('0' + (time.getMonth() + 1)).slice(-2);
    var day = ('0' + time.getDate()).slice(-2);
    var hours = ('0' + time.getHours()).slice(-2);
    var minutes = ('0' + time.getMinutes()).slice(-2);
    var seconds = ('0' + time.getSeconds()).slice(-2);
    
    var currentTimeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return currentTimeString;
}