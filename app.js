const querystring = require('querystring');

const handleRoute = require('./src/routes/routes');

const serverHandler = (req, res) => {

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    // 回复OPTIONS
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken',
      'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    });
    res.end('');
    return;
  }
  // 统一处理接收post数据
  const handlePostData = function () {
    console.log('====================     handlePostData     ====================');
    const promise = new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk.toString();
      });
      req.on('end', () => {
        if (!data) {
          resolve({});
          return;
        }
        resolve(JSON.parse(data));
        return;
      });
    });
    return promise;
  };

  // 设置响应格式
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 获取path
  const url = req.url;
  req.path = url.split('?')[0];

  // 解析query
  req.query = querystring.parse(url.split('?')[1]);

  handlePostData(req).then((postData)=>{
    req.body = postData;

    // 博客相关的路由
    const apiDataPromise = handleRoute(req, res);
    if (apiDataPromise) {
      apiDataPromise.then((successData) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(successData));
      }).catch((errorData)=>{
        res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(JSON.stringify(errorData));
        console.log(errorData);
      })
      return;
    }
    
    // 未匹配到任何路由
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('404 not Found');
    res.end();
  })
  
};

module.exports = serverHandler;
