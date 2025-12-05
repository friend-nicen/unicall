/**
 * 自定义事件管理器
 * 使用 Map 存储事件，key 为事件名称，value 为监听器数组
 */
class CustomEventBus {
    constructor() {
        this._cache = new Map();
    }

    /**
     * 添加事件监听器
     * @param {string} eventName - 事件名称
     * @param {Function} listener - 监听器函数
     * @returns {CustomEventBus} 返回实例自身，支持链式调用
     */
    add(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }
        if (!this._cache.has(eventName)) {
            this._cache.set(eventName, []);
        }
        this._cache.get(eventName).push(listener);
        return this;
    }

    /**
     * 获取指定事件名称对应值的最后一个事件监听器
     * @param {string} eventName - 事件名称
     * @returns {Function|null} 最后一个监听器，不存在则返回 null
     */
    get(eventName) {
        const listeners = this._cache.get(eventName);
        return listeners && listeners.length ? listeners[listeners.length - 1] : null;
    }

    /**
     * 移除最后一个事件监听器
     * @param {string} eventName - 事件名称
     * @returns {Function|null} 被移除的监听器，不存在则返回 null
     */
    pop(eventName) {
        const listeners = this._cache.get(eventName);
        if (!listeners || !listeners.length) return null;
        const removed = listeners.pop();
        if (!listeners.length) this._cache.delete(eventName);
        return removed;
    }

    /**
     * 删除指定的事件监听器
     * @param {string} eventName - 事件名称
     * @param {Function} listener - 要删除的监听器
     * @returns {boolean} 是否删除成功
     */
    remove(eventName, listener) {
        const listeners = this._cache.get(eventName);
        if (!listeners) return false;
        const idx = listeners.indexOf(listener);
        if (idx === -1) return false;
        listeners.splice(idx, 1);
        if (!listeners.length) this._cache.delete(eventName);
        return true;
    }

    /**
     * 清空指定事件的所有监听器
     * @param {string} eventName - 事件名称
     * @returns {boolean} 是否清空了事件
     */
    clear(eventName) {
        return this._cache.delete(eventName);
    }

    /**
     * 获取所有事件名称
     * @returns {IterableIterator<string>} 事件名称迭代器
     */
    eventNames() {
        return this._cache.keys();
    }

    /**
     * 获取指定事件的所有监听器
     * @param {string} eventName - 事件名称
     * @returns {Function[]} 监听器数组
     */
    listeners(eventName) {
        return this._cache.get(eventName) || [];
    }

    /**
     * 获取监听器数量
     * @param {string} [eventName] - 事件名称；不传则返回总数量
     * @returns {number} 数量
     */
    listenerCount(eventName) {
        if (eventName === undefined) {
            let count = 0;
            for (const arr of this._cache.values()) count += arr.length;
            return count;
        }
        const listeners = this._cache.get(eventName);
        return listeners ? listeners.length : 0;
    }
}

export default new CustomEventBus();