export default {
    debug: true,  // 调试模式开关
    ports: {
        http: 8088,
        ws: 8001
    },
    log: {
        console: true,  // 是否输出到控制台
        dir: './logs',  // 日志文件保存目录
        maxSize: 10 * 1024 * 1024,  // 单个日志文件最大大小（10MB）
        keepDays: 30  // 日志保留天数
    }
};
