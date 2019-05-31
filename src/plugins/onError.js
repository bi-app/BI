import { message, notification } from 'antd'
message.config({
  top: 100,
  maxCount: 2,
  duration: 100000
});
notification.config({
  top: 50,
  duration: 3,
});

export default {
  onError(e) {
    e.preventDefault()
    if(e.message)
    // message.error(e.message)
    notification["error"]({
      message: e.message,
      description: '',
    });
  },
}
