//일반 사용자 로그인
$('#gstAcc').click(function (e){
    e.preventDefault();

    usrName = "guest";
    location.href = "chat.html?user=guest";
});

//상담원 로그인
$('#csrAcc').click(function (e){
    e.preventDefault();

    usrName = "CSR";
    location.href = "chat.html?user=CSR";
});
