import { EMClient } from '../index';
const emMessages = () => {
  const reportMessages = (params) => {
    const { reportType, reportReason, messageId } = params;
    return new Promise((resolve, reject) => {
      EMClient.reportMessage({
        reportType: reportType, // 举报类型
        reportReason: reportReason, // 举报原因。
        messageId: messageId, // 上报消息id
      })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return {
    reportMessages,
  };
};
export default emMessages;
