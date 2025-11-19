import CONFIG from './config.js';
import fs from 'fs/promises';
import path from 'path';

export default {
    levels: {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR'
    },

    getLogFileName() {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`;
    },

    ensureLogDir() {
        const logDir = path.resolve(CONFIG.log.dir);
        return fs.mkdir(logDir, {recursive: true}).then(() => logDir);
    },

    async writeToFile(message) {
        const logDir = await this.ensureLogDir();
        const logFile = path.join(logDir, this.getLogFileName());

        try {
            /* 检查文件大小 */
            try {
                const stats = await fs.stat(logFile);
                if (stats.size >= CONFIG.log.maxSize) {
                    /* 如果超过最大大小，创建备份文件 */
                    const backupFile = `${logFile}.${Date.now()}.bak`;
                    await fs.rename(logFile, backupFile);
                }
            } catch (error) {
                // 文件不存在，忽略错误
            }

            /* 追加日志内容 */
            await fs.appendFile(logFile, message + '\n');
        } catch (error) {
            console.error('写入日志文件失败:', error);
        }
    },

    async log(level, message, data = null) {
        if (level === this.levels.DEBUG && !CONFIG.debug) return;

        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        const dataStr = data ? JSON.stringify(data) : '';
        const fullMessage = logMessage + dataStr;

        // 输出到控制台
        if (CONFIG.log.console) {
            console.log(fullMessage);
        }

        // 写入文件
        await this.writeToFile(fullMessage);
    },

    debug(message, data = null) {
        this.log(this.levels.DEBUG, message, data);
    },

    info(message, data = null) {
        this.log(this.levels.INFO, message, data);
    },

    warn(message, data = null) {
        this.log(this.levels.WARN, message, data);
    },

    error(message, data = null) {
        this.log(this.levels.ERROR, message, data);
    }
};