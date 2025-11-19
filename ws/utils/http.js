import {serve} from '@hono/node-server';
import {Hono} from 'hono';
import CONFIG from '../utils/config.js';
import Logger from '../utils/logger.js';
import {corpClients} from '../utils/registry.js';

export const startHttpServer = () => {

    const app = new Hono();

    const param = async (c) => {
        let data = {};
        const queryParams = c.req.query();
        if (Object.keys(queryParams).length > 0) data = {...data, ...queryParams};
        if (c.req.method === 'POST') {
            const contentType = c.req.header('content-type') || '';
            try {
                if (contentType.includes('application/json')) {
                    const jsonData = await c.req.json();
                    data = {...data, ...jsonData};
                } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
                    const formData = await c.req.parseBody();
                    data = {...data, ...formData};
                }
            } catch (parseError) {
                Logger.warn('解析请求数据失败', parseError);
            }
        }
        return data;
    };

    app.all('/send', async (c) => {
        try {
            const data = await param(c);
            Logger.debug('收到请求', data);
            if (!!data.phone && !!data.name && !!data.type && !!data.corp) {
                const companyMap = corpClients.get(String(data.corp));
                const client = companyMap ? companyMap.get(data.name) : null;
                if (!client) return c.json({code: 0, message: '你的APP账号没有上线！'}, 200);
                client.send(JSON.stringify(data)); /* 操作 */
                return c.json({code: 1, message: 'ok'});
            } else {
                return c.json({code: 0, message: 'fail'});
            }
        } catch (error) {
            Logger.error('处理webhook请求失败', error);
            return c.json({code: 0, message: 'error'}, 200);
        }
    });

    serve({fetch: app.fetch, port: CONFIG.ports.http}, (info) => {
        Logger.info(`HTTP服务器运行在 http://localhost:${info.port}`);
        Logger.info(`调试模式: ${CONFIG.debug ? '开启' : '关闭'}`);
    });

    return app;
};
