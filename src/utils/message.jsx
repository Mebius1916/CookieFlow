import { message } from 'antd';

export const showOperationResult = (operation, result) => {
  if (!result) {
    message.error(`${operation}Cookie失败`);
    return;
  }
  
  if (result.failureCount > 0) {
    message.info(`成功${operation} ${result.successCount} 个Cookie，${result.failureCount} 个失败`);
  } else {
    message.success(`成功${operation} ${result.successCount} 个Cookie`);
  }
};

export const showError = (action) => {
  message.error(`${action}失败`);
};

export const showInfo = (content) => {
  message.info(content);
}; 