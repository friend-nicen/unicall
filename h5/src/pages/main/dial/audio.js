import {onUnmounted, ref} from "vue";
import api from "@/service/api";

export default function () {

    /* 音频播放相关状态 */
    const audioPlayer = ref(null);
    const currentPlayingIndex = ref(null);
    const audioDuration = ref(0);
    const currentTime = ref(0);
    const timer = ref(null);

    /* 播放或暂停音频 */
    const togglePlay = (item, index) => {

        item.audio = item.audio.replace('\\', '/');

        /* 如果当前没有播放任何音频或者播放的不是当前点击的音频 */
        if (currentPlayingIndex.value !== index) {

            /* 如果有正在播放的音频，先停止它 */
            if (audioPlayer.value) {
                audioPlayer.value.pause();
                audioPlayer.value = null;
                clearInterval(timer.value);
                timer.value = null;
            }

            /* 创建新的音频播放器 */
            audioPlayer.value = new Audio(api.host + item.audio);

            audioPlayer.value.addEventListener('loadedmetadata', () => {
                audioDuration.value = audioPlayer.value.duration;
                currentTime.value = 0;

                /* 开始播放 */
                audioPlayer.value.play();
                currentPlayingIndex.value = index;

                /* 设置定时器更新播放进度 */
                timer.value = setInterval(() => {
                    currentTime.value = audioPlayer.value.currentTime;
                    /* 如果播放结束，重置状态 */
                    if (currentTime.value >= audioDuration.value) {
                        clearInterval(timer.value);
                        timer.value = null;
                        currentPlayingIndex.value = null;
                        audioPlayer.value = null;
                    }
                }, 1000);
            });

            /* 监听播放结束事件 */
            audioPlayer.value.addEventListener('ended', () => {
                clearInterval(timer.value);
                timer.value = null;
                currentPlayingIndex.value = null;
                audioPlayer.value = null;
            });
        } else {
            /* 如果点击的是当前正在播放的音频，则暂停/继续播放 */
            if (audioPlayer.value.paused) {
                audioPlayer.value.play();
                /* 重新启动定时器 */
                timer.value = setInterval(() => {
                    currentTime.value = audioPlayer.value.currentTime;
                    /* 如果播放结束，重置状态 */
                    if (currentTime.value >= audioDuration.value) {
                        clearInterval(timer.value);
                        timer.value = null;
                        currentPlayingIndex.value = null;
                        audioPlayer.value = null;
                    }
                }, 1000);
            } else {
                audioPlayer.value.pause();
                clearInterval(timer.value);
                timer.value = null;
            }
        }
    };

    /* 检查是否正在播放 */
    const isPlaying = (index) => {
        return currentPlayingIndex.value === index && audioPlayer.value && !audioPlayer.value.paused;
    };

    /* 获取播放进度百分比 */
    const getProgress = (index) => {
        if (currentPlayingIndex.value !== index || !audioPlayer.value) return 0;
        return (currentTime.value / audioDuration.value) * 100;
    };

    /* 获取剩余时间（秒） */
    const getRemainingTime = (index) => {
        if (currentPlayingIndex.value !== index || !audioPlayer.value) return 0;
        return Math.max(0, audioDuration.value - currentTime.value);
    };

    /* 格式化时间为 mm:ss 格式 */
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };

    /* 组件卸载时清理资源 */
    onUnmounted(() => {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            audioPlayer.value = null;
        }
        if (timer.value) {
            clearInterval(timer.value);
            timer.value = null;
        }
    });

    return {
        togglePlay,
        isPlaying,
        getProgress,
        getRemainingTime,
        formatTime
    }

}