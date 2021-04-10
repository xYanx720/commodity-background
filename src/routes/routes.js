const { SuccessModel, ErrorModel } = require('../model/responseModel');
const {
  register,
  getUserList,
  getDtList,
  getGoodsList,
  goodsDetail,
} = require('../controllers/controllers');
const Cookies = require('cookies');

//处理路由
const handleRoute = (req, res) => {
  // 定义处理路由的逻辑
  const { method, path } = req;
  console.log('====================', method, path, '====================');

  // 统一处理路由
  const MAP_CONFIG = [
    ['GET_/api/register', apiRegister],
    ['GET_/api/getUserList', apiGetUserList],
    ['POST_/api/getDtList', apiGetDtList],
    ['POST_/api/getGoodsList', apiGetGoodsList],
    ['POST_/api/getGoodsDetail', apiGoodsDetail],
    ['GET_/api/login', apiLogin],
  ];
  const actions = new Map(MAP_CONFIG);
  let action = actions.get(`${method}_${path}`);
  console.log('req.body', req.body);
  return action();

  /* ============================ 接下来处理各个路由的方法 ============================ */

  // 注册（未完善）
  function apiRegister() {
    const username = req.query.username || '';
    const password = req.query.password || '';

    const resultPromise = register(username, password);
    return resultPromise.then((resultData) => {
      return new SuccessModel(resultData);
    });
  }

  // 获取user表全部数据
  function apiGetUserList() {
    const flag = req.query.flag || '*';

    const resultPromise = getUserList(flag);
    return resultPromise.then((resultData) => {
      return new SuccessModel(resultData);
    });
  }

  // 堆糖接口
  function apiGetDtList(aa) {
    let resultPromise = getDtList(req.body);
    return resultPromise.then((resultData) => {
      // console.log(resultData)
      let temp = { data: [...resultData], nextcount: req.body.nextcount };

      return new SuccessModel(temp);
    });
  }

  // 商品列表
  async function apiGetGoodsList() {
    // 尝试使用async 和 await
    let result = await getGoodsList(req.body);
    result = { data: [...result], nextcount: req.body.nextcount + 30 };
    return Promise.resolve(new SuccessModel(result));
  }

  // 商品详情页
  async function apiGoodsDetail() {
    let result = await goodsDetail(req.body);
    if (!result.length) {
      return Promise.reject(new ErrorModel('无用id'));
    }
    return Promise.resolve(new SuccessModel(result));
  }

  // 登录
  function apiLogin() {
    // cookies进行签名（加密）
    let keys = ['keyboardCat'];

    let cookies = new Cookies(req, res, { keys: keys });
    // console.log(cookies);

    // 设置cookie('键名','值','有效期')
    cookies.set('LastVisit', new Date().getTime(), { signed: true });
    // cookies.set('k1', 'v1', { signed: true,maxAge:0 }); //永久有效
    // cookies.set('k3', 'v3', { signed: true,maxAge:-1 }); //删除cookie
    // cookies.set('k2', 'v2',{ signed: true,maxAge:60000*60*24*7 }); //单位毫秒，有效期为7天

    // 获取cookie,new Cookies时设置了签名，获取时也要进行签名认证
    let lastVisit = cookies.get('LastVisit', { signed: true });
    // let lastVisit2 = cookies.get('LastVisit' );
    console.log(lastVisit);
    // console.log(lastVisit2);

    return Promise.resolve(new SuccessModel('Cookie Api'));
  }
};

module.exports = handleRoute;
