import {WebSocketServer} from 'ws';
import CONFIG from '../utils/config.js';
import Logger from '../utils/logger.js';
import {corpClients, getConnectionCount} from '../utils/registry.js';

export const startWsServer = () => {
  const wss = new WebSocketServer({host: '0.0.0.0', port: CONFIG.ports.ws});
  Logger.info(`WebSocket服务器运行在 ws://localhost:${CONFIG.ports.ws}`);

  wss.on('connection', (ws, req) => {

    let ip = req.headers['x-real-ip']
        || req.headers['x-forwarded-for']?.split(',')[0].trim()
        || req.socket.remoteAddress;

    if (ip.substr(0, 7) === '::ffff:') ip = ip.substr(7);

    Logger.debug(`新的WebSocket连接，${JSON.stringify({remoteAddress: ip, url: req.url})}`);
    Logger.info(`当前连接数: ${getConnectionCount()}`);

    ws.on('close', () => {
      if (ws.corp && ws.phone) {
        const companyMap = corpClients.get(ws.corp);
        if (companyMap) {
          companyMap.delete(ws.phone);
          if (companyMap.size === 0) corpClients.delete(ws.corp);
        }
        Logger.debug('WebSocket连接关闭', {phone: ws.phone, corp: ws.corp, remainingClients: getConnectionCount()});
      }
    });

    ws.on('message', (body) => {

      const data = body.toString();
      Logger.info(`收到消息：${data}，${JSON.stringify({remoteAddress: ip})}`);

      /* 维持心跳 */
      if (data === 'ping') {
        ws.send("1");
        return;
      }

      try {
        const msg = JSON.parse(data);
        if (!ws.phone && msg.type === 'login') {
          if (msg?.name && msg?.corp) {
            const phone = msg.name;
            const corp = String(msg.corp);
            let companyMap = corpClients.get(corp);
            if (!companyMap) {
              companyMap = new Map();
              corpClients.set(corp, companyMap);
            }
            const existingClient = companyMap.get(phone);
            if (existingClient) {
              Logger.info(`禁止重复登录，通知${phone}自动退出！`);
              existingClient.send(JSON.stringify({type: 'quit', name: phone}));
              companyMap.delete(phone);
            }
            Logger.info(`新消息：${phone}上线`);
            ws.phone = phone;
            ws.corp = corp;
            companyMap.set(phone, ws);
          }
        }
      } catch (error) {
        Logger.error('处理WebSocket消息失败', error);
      }
    });

    ws.on('error', (error) => {
      Logger.error('WebSocket连接错误', error);
      if (ws.corp && ws.phone) {
        const companyMap = corpClients.get(ws.corp);
        if (companyMap) {
          companyMap.delete(ws.phone);
          if (companyMap.size === 0) corpClients.delete(ws.corp);
        }
      }
    });
  });

  return wss;
};
