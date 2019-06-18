
import { Modal, message} from 'antd';
import { login } from 'api'
import { router, setSession } from 'utils'
export default {
  namespace: 'login',
  state: {
    username: '',
    password: ''
  },
  effects: {
    *login({ payload = {} }, { call, put, select }) {
      const response = yield call(login, payload);
      const { success, Data, Msg } = response;
      let secondsToGo = 2;
      if(success && Data){
        setSession("userInfo", Data)
        yield put({
          type: '_loginSucc',
          payload: { Data },
        })
        yield put({ type: 'app/getBiconfig' })

        const modal = Modal.success({
          width: 280,
          className: 'loginStatusModal',
          title: '登录成功',
          // content: <div><span style={{color: "#e92e3c", fontWeight: 600}}>{secondsToGo}</span> 秒后跳转至首页</div>,
          content: "",
          centered: true,
        });
        // const timer = setInterval(() => {
        //   secondsToGo -= 1;
        //   modal.update({
        //     content: <div><span style={{color: "#e92e3c", fontWeight: 600}}>{secondsToGo}</span> 秒后跳转至首页</div>,
        //   });
        // }, 1000);
        setTimeout(() => {
          modal.destroy();
          // clearInterval(timer);
          router.push({ pathname: '/data', })
        }, secondsToGo * 1000)
        //
        // message.success('登录成功，正在跳转...', 1.5).then(() => {
        //   router.push('/data')
        // });

      } else {
        // const modal = Modal.error({
        //   width: 280,
        //   className: 'loginStatusModal',
        //   title: Msg,
        //   // content: <div><span style={{color: "#e92e3c", fontWeight: 600}}>{secondsToGo}</span> 秒后跳转至首页</div>,
        //   content: "",
        //   centered: true,
        // });
        // setTimeout(() => {
        //   modal.destroy();
        // }, 1000)
        message.error(Msg);
        // throw response
      }
    },
  },
  reducers: {
    _loginSucc(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
