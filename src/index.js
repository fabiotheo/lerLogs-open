import 'babel-polyfill';
import 'dotenv/config';

import Chokidar from 'chokidar';
import readLine from 'read-last-lines';
import Telegram from 'node-telegram-bot-api';
import asteriskLog from './config/asterisk';
import telegramConfig from './config/telegram';

/**
 * Importando dados do Telegram e Log's do Asterisk
 */
const token = telegramConfig.apiToken;
const { chatId } = telegramConfig;
const { logFile } = asteriskLog;
const trunk = [];
trunk[0] = asteriskLog.trunk0;
trunk[1] = asteriskLog.trunk1;
const serverName = process.env.SERVER_NAME;


/**
 * Iniciando o programa:
 */
const telegramBot = new Telegram(token, { polling: true });

const watcher = Chokidar.watch(logFile, { persistent: true });

watcher.on('raw', information => {
  readLine.read(logFile, 1).then(lines => {
    if (lines.indexOf(trunk[0]) !== -1 || lines.indexOf(trunk[1]) !== -1) {
      const message = `
        🚨 Atenção 🚨  
        Nome da Maquina: ${serverName} 
        Cliente: ${process.env.SERVER_NAME} 
        Log Capturado ${lines}
      `;
      telegramBot.sendMessage(chatId, message);
    }
  });
});
