import { message, notification } from 'antd'
message.config({
  top: 120,
  maxCount: 1,
  // duration: 100000
});
notification.config({
  top: 50,
  duration: 3,
});

export default {
  onError(e, dispatch) {
    e.preventDefault()
    if(e.message)
    notification["error"]({ message: e.message, description: '', });
  },
}
