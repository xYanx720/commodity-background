const { execSQL } = require('../db/mysql');

const register = (username, password) => {
  /* 
  做不出来烦死了 注册需要先查找有没有这个用户 execSQL 里面必写select语句
  如果能找到这个用户名对应得数据代表这个用户存在那不能继续注册（Empty set）
  找不到得话就继续用insert语句添加 
  但是添加数据也要用execSQL来添加 那怎么返回一个数据说明添加成功呢
  */
  // 实现注册效果
  const searchSql = `select * from user where username='${username}'`;

  return execSQL(searchSql).then((response) => {
    if (response.length == 0) {
      const addSql = `insert into user (username,password) values ('${username}','${password}')`;
      return execSQL(addSql);
    }
    return Promise.resolve('账号已存在');
  });
};

const getUserList = (flag) => {
  const sql = `select ${flag} from user`;
  return execSQL(sql);
};

const postTest = () => {
  return Promise.resolve('aaaa');
};

const getDtList = (data) => {
  let { nextcount } = data;
  nextcount = nextcount || 0;
  console.log('nextcount', nextcount);
  let sql = `SELECT * FROM duitang LIMIT ${nextcount},24`;
  return execSQL(sql);
};

const getGoodsList = (body) => {
  let { nextcount } = body;
  nextcount--;
  if (nextcount < 0) {
    nextcount = 0;
  }
  // console.log(nextcount)
  let sql = `select * from goods limit ${nextcount},30`;
  return execSQL(sql);
};

const goodsDetail = (body) => {

  let { goods_id } = body;
  let sql = `select * from goods where goods_id=${goods_id}`;
  return execSQL(sql);
}


module.exports = {
  register,
  getUserList,
  postTest,
  getDtList,
  getGoodsList,
  goodsDetail
};
