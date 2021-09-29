//최종 빌드 시 www.js 에서 www로 파일명칭 변경할 것
const express = require('express')
const app = express()
var debug = require('debug')('webserver:server');
var http = require('http');
var port = 3000;
var server = http.createServer(app);

var liveUsers = {};   


app.use(express.static('public'))

//채팅 내역 복구, 저장
const chatDB = require('sqlite3').verbose();

//AI 활용용도의 mySQL
const aiDB = require('mysql');

var msqlDB = aiDB.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'test_DB'
  }
);

msqlDB.connect();

msqlDB.query('SELECT DATE_FORMAT(NOW(), \'%H:%I:%s\') as solution',
  function (error, results, fields)
  {
    if(error) throw error;

    console.log("현재 DB 기준 시각" + results[0].solution + "입니다.");
    console.log(results);
  }
);

msqlDB.end();


let chatLog = new chatDB.Database('..\public\db\chatlog.db', 
  (err) =>{
    if (err)
      return console.error(err.message);
    console.log('채팅 로그 DB 연결');
    chatLogDB_Init();
  }
);

//초기 테이블 생성 및 데이터 업로드(최초 1회만 실행됨)
function chatLogDB_Init()
{
  chatLog.run("DROP TABLE chatR1");
  var qry1, qry2, qry3;
  //채팅방 대화 기록 용 테이블 생성
  qry1 = 'CREATE TABLE IF NOT EXISTS chatR';
  qry2 = '(user VARCHAR(10), sentChat text, sentDate DATE, sentTime time, ';
  qry3 = 'CONSTRAINT arrival PRIMARY KEY (sentDATE, sentTime))';

  chatLog.run(qry1 + '1' + qry2 + qry3);
  console.log('채팅방 1번용 로그 DB 테이블 생성 완료');
  chatLog.run(qry1 + '2' + qry2 + qry3);
  console.log('채팅방 2번용 로그 DB 테이블 생성 완료');
  chatLog.run(qry1 + '3' + qry2 + qry3);
  console.log('채팅방 3번용 로그 DB 테이블 생성 완료');

  
}

//채팅 로그 불러오기 기능 (현재 콘솔로만 가능)
function loadChatLog(roomNo)
{
  var qry1, qry2;
  qry1 = "SELECT * FROM chatR" + roomNo;
  qry2 = " ORDER BY sentDate ASC, sentTime ASC";

  chatLog.all(qry1 + qry2, [], 
    (err, datas)=>{
        if (err)
            throw err;
        
        datas.forEach(
            (datas)=>{
                console.log(datas);
            }
        );
    }
  );

}


/*============================================*/
/*================ Socket IO =================*/
/*============================================*/

var io = require('socket.io')(server);

//접속 유무 확인, 채팅 전송
io.on('connection', (socket) => {
  console.log('사용자 접속 확인 (번호: ' + socket.id + ')');

  //간이 로그인, 접속
  socket.on('access', function(name){
    const id = name + '';
    liveUsers[id] = {room: 1, socketID: socket.id, name:id};
    socket.join('room1');
    updateUser(0, 1, id);

    console.log('사용자 로그인 확인 (아이디: ' + id + ') (번호: ' + socket.id + ')');
  });

  //채팅 전송
  socket.on('chat message', function(message, name, room){ 
    const msg = name + ': ' + message;
    console.log(msg);

    //채팅 내역 DB 기록
    var qry1 = "INSERT or IGNORE INTO chatR" + room;
    //사용자 및 메시지
    var qry2 = "  VALUES  (\"" + name + "\", \"" + message + "\"";
    //전송 시각
    var qry3 = ", strftime('%Y-%m-%d', 'now', 'localtime')" + ", strftime('%H:%M:%f', 'now', 'localtime'))";
    console.log("NEW QRY IS " + qry1 + qry2 + qry3);
    chatLog.run(qry1 + qry2 + qry3);
    socket.to('room' + room).emit('chat message', message, name);
  });

  

  //채팅방 들어감
  socket.on('join chat', function(info)
  {
    let usrname = getUsrNameSID(socket.id);
    let prv = liveUsers[usrname].room;
    let nxt = info.room;
    socket.leave('room' + prv);
    socket.join('room' + nxt);
    

    liveUsers[usrname].room = info.room;     
    updateUser(prv, nxt, socket.id);

    //loadChatLog(info.room);
  });
  
  socket.on('recover chat', function (info)
  {
    console.log('Recover chat Starts...');

    var qry1, qry2;
    qry1 = "SELECT * FROM chatR" + info.room;
    qry2 = " ORDER BY sentDate ASC, sentTime ASC";
  
    chatLog.all(qry1 + qry2, [], 
      (err, datas)=>{
          if (err)
              throw err;
      
          datas.forEach(
              (datas)=>{
                  let tag = true;
                  if (datas.user == "guest")
                    tag = false;
                  else
                    tag = true;
                  
                  io.to(socket.id).emit('recover msg', tag, datas.sentChat);
              }
          );
      }
      
    );
  });
  socket.on('disconnect', function(){
    console.log('사용자 접속 종료');

    let id = getUsrNameSID(socket.id);
    let room = liveUsers[id].room;
    delete liveUsers[id];
    
    updateUser(room, 0, id);
  }); 

  //서버 고유 id로 사용자 이름 찾기
  function getUsrNameSID(id)
  {
    return Object.keys(liveUsers).find(key => liveUsers[key].socketID === id);
  }

  //방에 접속한 사용자 정보 확인
  function roomUserList(num)
  {
    let usrLog = [];
    Object.keys(liveUsers).forEach(
      (i) => {
        if (liveUsers[i].room === num)
        {
          
          usrLog.push({
            socketID: liveUsers[i].socketID,
            name: i
          });
        }
      });

    return usrLog;
  }

  function updateUser(prv, nxt, id)
  {
    if (prv != 0)
    {
      socket.to('room' + prv).emit('users', roomUserList(prv));
      socket.to('room' + prv).emit('leave chat', id);
    }
    if (nxt != 0)
    {
      socket.to('room' + nxt).emit('users', roomUserList(nxt));
      socket.to('room' + nxt).emit('enter chat', id);
    }
  }

  function getQueries(msg)
  {
    var proto = msg.split(" ");
    var length = proto.length;
    
  }

});



/*============================================*/
/*=========== NODE JS Server Setup ===========*/
/*============================================*/



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


/*============================================*/
/*================= DataBase =================*/
/*============================================*/

//SQLITE 3
const classInfo = require('sqlite3').verbose();


let classDB = new classInfo.Database('..\public\db\datas.db', 
  (err) =>{
    if (err)
      return console.error(err.message);
    console.log('수업 DB 연결');
    classDB_Init();
    console.log('수업 DB 테이블 생성 완료');

    init_classDB_infos();
    console.log('수업 DB 초기데이터 점검 완료');
  }
);

//초기 테이블 생성 및 데이터 업로드(최초 1회만 실행됨)
function classDB_Init()
{
  var qry1, qry2, qry3, qry4;
  //교수 테이블 생성
  qry1 = 'CREATE TABLE IF NOT EXISTS 교수 (';
  qry2 = 'pName VARCHAR(20), ID VARCHAR2(4) NOT NULL, ';
  qry3 = 'CONSTRAINT prf_PK PRIMARY KEY(ID))';

  classDB.run(qry1 + qry2 + qry3);

  //수업 테이블 생성
  qry1 = 'CREATE TABLE IF NOT EXISTS 수업 (';
  qry2 = 'ID VARCHAR(4), Name VARCHAR2(30), pID VARCHAR2(4), cRoom NUMBER(4), cDay1 NUMBER(1), cDay2 NUMBER(1), startTime TIME, endTime TIME,';
  qry3 = 'CONSTRAINT class_PK     PRIMARY KEY (ID),'
  qry4 = 'CONSTRAINT class_FK     FOREIGN KEY (pID)	REFERENCES 교수(ID) )';

  classDB.run(qry1 + qry2 + qry3 + qry4);
}

function init_classDB_infos()
{
  var qry;
  var qry2 = ["(\"정상화\", \"P01\");", "(\"류광렬\", \"P02\")","(\"홍봉희\", \"P03\")", "(\"최윤호\", \"P04\")", "(\"감진규\", \"P05\")",
                "(\"우균\", \"P06\")", "(\"이기준\", \"P07\")", "(\"탁성우\", \"P08\")", "(\"염근혁\", \"P09\")", "(\"송길태\", \"P10\")"];
  var qry3 = ["(\"CP01\", \"임베디드시스템\", \"P01\", 6514, 1, 3, '15:00', '16:15')", "(\"CP02\", \"AI프로그래밍\", \"P02\", 6409, 2, 4, '15:00', '16:15')",
              "(\"CP03\", \"자료구조\", \"P03\", 6515, 1, 3, '10:30', '11:45')", "(\"CP04\", \"네트워크보안\", \"P04\", 6203, 1, 3, '09:00', '10:15')",
              "(\"CP05\", \"인공지능\", \"P05\", 6516, 2, 4, '13:30', '14:45')", "(\"CP06\", \"컴파일러\", \"P06\", 6202, 1, 3, '09:00', '10:15')",
              "(\"CP07\", \"데이터베이스\", \"P07\", 6202, 1, 3, '16:30', '14:45')", "(\"CP08\", \"컴퓨터네트워크\", \"P08\", 6515, 2, 4, '09:00', '10:15')",
              "(\"CP09\", \"소프트웨어공학\", \"P09\", 6515,  2, 4, '10:30', '11:45')", "(\"CP10\", \"데이터마이닝\", \"P10\", 6515, 2, 4, '13:30', '14:45')"];

  qry = "INSERT or IGNORE INTO 교수 VALUES ";

  for (target of qry2)
    classDB.run(qry + target);

  qry = "INSERT or IGNORE INTO 수업 VALUES ";
  for (target of qry3)
    classDB.run(qry + target);
}
function query1()
{
    var stmt1 = "SELECT name, pname, croom, cday1, cday2, startTime, endTime ";
    var stmt2 = "FROM 수업 classes "
    var stmt3 = "INNER JOIN 교수 profs ON classes.pid = profs.id "
    var stmt4 = "ORDER BY cday1 ASC, startTime ASC";

    
    classDB.all(stmt1 + stmt2 + stmt3 + stmt4, [], 
        (err, datas)=>{
            if (err)
                throw err;
            
            datas.forEach(
                (datas)=>{
                    console.log(datas);
                }
            );
        }
    );
}

function query2()
{
  var stmt = "SELECT name, pname, croom, cday1, cday2, startTime, endTime FROM 수업 classes INNER JOIN 교수 profs ON classes.pid = profs.id WHERE cday1 = strftime('%w', 'now', 'localtime') or cday2 = strftime('%w', 'now', 'localtime') ORDER BY startTime ASC";
  classDB.all(stmt, [], 
    (err, datas)=>{
        if (err)
            throw err;
        
        datas.forEach(
            (datas)=>{
                console.log(datas);
            }
        );
    }
  );
}

function query3()
{
  var stmt = "SELECT name, croom, cday1, cday2, startTime, endTime FROM 수업 classes INNER JOIN 교수 profs ON classes.pid = profs.id WHERE profs.pname = \"우균\" ORDER BY cday1 ASC, startTime ASC";
  classDB.all(stmt, [], 
    (err, datas)=>{
        if (err)
            throw err;
        
        datas.forEach(
            (datas)=>{
                console.log(datas);
            }
        );
    }
  );
}

function query4()
{
  var stmt = "SELECT name, pname, croom, cday1, cday2, startTime, endTime FROM 수업 classes INNER JOIN 교수 profs ON classes.pid = profs.id WHERE (cday1 = strftime('%w', 'now', 'localtime') or cday2 = strftime('%w', 'now', 'localtime')) AND (strftime('%H:%M', 'now', 'localtime') > startTime AND strftime('%H:%M', 'now', 'localtime') < endTime) ORDER BY cday1 ASC, startTime ASC";
  classDB.all(stmt, [], 
    (err, datas)=>{
        if (err)
            throw err;
        
        datas.forEach(
            (datas)=>{
                console.log(datas);
            }
        );
    }
  );
}

function query5()
{
  var stmt = "SELECT pname, croom, startTime, endTime FROM 수업 classes INNER JOIN 교수 profs ON classes.pid = profs.id WHERE name = \"ㅇㅇㅇ\" ORDER BY cday1 ASC, startTime ASC";
  classDB.all(stmt, [], 
    (err, datas)=>{
        if (err)
            throw err;
        
        datas.forEach(
            (datas)=>{
                console.log(datas);
            }
        );
    }
  );
}