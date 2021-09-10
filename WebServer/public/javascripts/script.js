const socket = io();
const chat = document.getElementById('submitter');
const chatLog = document.getElementById('chatlog');
const testJoin = document.getElementById('testJoin');
const userlist = document.getElementById('userlist');

var room = 1;
var socketID = socket.id;

var usrName;
/* 사용자 정보 초기화 */
$(document).ready(function(){
    usrName = location.href.substr(
        location.href.lastIndexOf('=') + 1
    );
        
    socket.emit('access', usrName);
    socket.emit('users');
    
   $("#username").html(usrName);
});


/* 채팅 전송 기능*/

//채팅 전송 및 로그에 기록
chat.addEventListener('submit', function (e) {
    var message = document.getElementById('chat');
    socket.emit('chat message', message.value, usrName, room);
    chatLog.appendChild(msgLogging(message.value, true));
    message.value = '';
    message.focus();
    e.preventDefault();
});

//상대방 채팅 메시지 서버에서 가져옴
socket.on
(
    'chat message', 
    function(message)
    {
        chatLog.appendChild(msgLogging(message, false));
    }
);

//전송, 수신된 메시지 구분 후 출력
const msgLogging = (message, isMine) => {
    var msgLog = document.createElement('div');
    var msgType = isMine ? "mine" : "others";

    msgLog.className = msgType;
    msgLog.innerText = message;
    return msgLog;
};



/* 채팅방 접속 */

//채팅방에 접속, 접속된 채팅방 표시
$('#chatRooms').on("click", "button", function(){
    //다른 채팅 방을 선택할 시 room를 변경
    if (room != $(this).data('id'))
    {
        room = $(this).data('id');
        var newTitle = "채팅방 " + room + "번";
    }
    else
        return;
    //기존에 들어가있던 채팅방의 css 클래스에서 ON 상태를 제거함
    $(this).parents().children().removeClass("ON");
    //새로 들어갈 클래스에 ON을 추가함
    $(this).addClass("ON");
    //서버의 불도 들어오게 함
    $(this).next().removeClass("OFF");
    $(this).next().addClass("ON");
    
    //채팅방 제목을 변경
    $('#chatTitle').html(newTitle);

    //새로고침 용 이전 채팅방에서 사용했던 채팅을 비워줌
    $('#chatlog').html("");
    socket.emit('join chat', {room});
});

//채팅방에 들어와 있는 사용자 표시
socket.on
('users', 
    function (data)
    {   
        let lst = "";
        data.foreach(
            (i) => {
                if (i.socketID == socketID)
                    lst += '<div class = "chUsers"> ${i.name} (나)</div>';
                else
                    lst += '<div class = "chUsers"> ${i.name}</div>';
            });
        $('#userlist').html(lst);
    }
);

//채팅방 들어가고 나가기 표z현

socket.on
('enter chat', 
    function (data)
    {
        $('#chatLog').append('<div class="inNout"><strong>${data}</strong>님께서 들어오셨습니다.</div>')
    }
);

socket.on
('leave chat', 
    function (data)
    {
        $('#chatLog').append('<div class="inNout"><strong>${data}</strong>님께서 나가셨습니다.</div>')
    }
);

