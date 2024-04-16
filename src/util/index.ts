//将Data格式转换为字符串格式"YYYY-MM-DD HH:mm:ss"

export function getStringTime(date: any) {
    var time = new Date(date);
    var year = time.getFullYear();
    var month = ('0' + (time.getMonth() + 1)).slice(-2);
    var day = ('0' + time.getDate()).slice(-2);
    var hours = ('0' + time.getHours()).slice(-2);
    var minutes = ('0' + time.getMinutes()).slice(-2);
    var seconds = ('0' + time.getSeconds()).slice(-2);
    
    var currentTimeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return currentTimeString;
};

//将xxx秒转化成“00:00:00
export function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

//将xxx秒转化成“00小时00分钟00秒
export function formatTimeString(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}小时${formattedMinutes}分钟${formattedSeconds}秒`;
};