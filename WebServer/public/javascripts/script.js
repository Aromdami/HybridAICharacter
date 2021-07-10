const socket = io();
const chat = document.getElementById('submitter');
const chatLog = document.getElementById('chatlog');
var usrName =  document.getElementById("username").innerText;


chat.addEventListener('submit', function (e) {
    var message = document.getElementById('chat');
    socket.emit('chat message', message.value, usrName);
    chatLog.appendChild(msgLogging(message.value, true));
    message.value = '';
    message.focus();
    e.preventDefault();
});

socket.on('chat message', function(message){
    chatLog.appendChild(msgLogging(message, false));
});

const msgLogging = (message, isMine) => {
    var msgLog = document.createElement('div');
    var msgType = isMine ? "mine" : "others";

    msgLog.className = msgType;
    msgLog.innerText = message;
    return msgLog;
};

function changeNameTest()
{
    var newName = prompt("새로운 이름을 입력해주세요");
    if (newName === "")
        newName = usrName;
    else
        document.getElementById("username").innerText = newName;
    usrName = newName;
}