
const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../config/db');

// 创建连接对象
// const connection = mysql.createConnection(MYSQL_CONFIG);
// connection.connect();
// 关闭连接
// connection.end();

const pool = mysql.createPool(MYSQL_CONFIG);

// 
/*
这种写法可行但是会很容易出现回调地狱得情况  所以使用promise会更好
function execSQL(sql,callback){
  connection.query(sql,callback)
} 
*/

/**
 * @param {string} sql
 * @return {Promise}
 */
function execSQL(sql) {
  const promise = new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
  return promise;
}

module.exports = {
  execSQL,
};
