const http = require('http');

const serverHandler = require('../app');

const PORT = 5000;
const server = http.createServer(serverHandler);
server.listen(PORT,()=>{
  console.log('serve running at port 5000');
})  