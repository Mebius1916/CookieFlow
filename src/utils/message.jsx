import { message } from 'antd';

export const showOperationResult = (operation, result) => {
  if (!result) {
    message.error(`${operation}Cookie失败`);
    return;
  }
  
  if (result.successCount > 0) {
    message.success(`成功${operation} ${result.successCount} 个Cookie`);
  } else {
    message.info(`没有Cookie被${operation}`);
  }
};

export const showError = (action) => {
  message.error(`${action}失败`);
};

export const showInfo = (content) => {
  message.info(content);
}; 