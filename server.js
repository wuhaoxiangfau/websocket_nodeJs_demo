//使用第三方模块WS创建 WS 服务器
//1:加载相应模块 ws
//检查ws模块是否复制成功
const ws = require("ws");
//2:创建ws服务器，监听指定端口  9001
var server = new ws.Server({port:9001});


//3:为ws服务器监听事件connection 客户端连接触发事件
server.on("connection",(socket)=>{
    console.log("ws服务器接收到一个连接请求");
    var old_n=0;
    var n=0;//存储我发送的消息的字符长度
    var txt="";//存储我发送的消息
    //5:ws 服务器接收客户端发来消息
    //绑定事件 message
    socket.on("message",(msg)=>{
        old_n=n;
        console.log("服务器接收到消息:"+msg);
        txt+=msg;
        n=txt.length;
        console.log("n:"+n+",old_n:"+old_n);
    });
    //4:ws 服务器向客户发送消息
    var timer=null;
    timer=setInterval(function(){
        if(old_n!=n){//更新了  那么将两者长度设为相同
            socket.send('{"code":1,"msg":"'+uName+'"}');
            old_n=n;
        }
        else
            socket.send('{"code":-1,"msg":"'+uName+'"}');
    },1000);

    //6:可选项目:如果客户端发来断开连接请求,不再发消息
    socket.on("close",()=>{
        console.log("客户端断开连接");
        clearInterval(timer);//不再继续发送消息
    });
});


var mysql      = require('mysql');
var uName="";
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'wechat'
});


connection.connect();

var  sql = 'SELECT * FROM user where uid=1';
//查
connection.query(sql,function (err, result) {
    if(err) throw err;

    uName=result[0].uname;

    console.log('--------------------------SELECT----------------------------');
    console.log(result[0].uname);
    console.log('------------------------------------------------------------\n\n');
});

connection.end();