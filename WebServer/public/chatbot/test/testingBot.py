# -*- coding: utf-8 -*-
import socket
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

# 챗봇 엔진 서버 접속 정보
host = "127.0.0.1"  # 챗봇 엔진 서버 IP 주소
port = 5050  # 챗봇 엔진 서버 통신 포트

# 클라이언트 프로그램 시작

def getQuestion(question):
    query = question
    if(query == "exit"):
        exit(0)
    mySocket = socket.socket()
    mySocket.connect((host, port))

    # 챗봇 엔진 질의 요청
    json_data = {
        'Query': query,
        'BotType': "MyService"
    }
    message = json.dumps(json_data)
    mySocket.send(message.encode('utf-8'))

    # 챗봇 엔진 답변 출력
    data = mySocket.recv(2048).decode()
    ret_data = json.loads(data)
    print(ret_data['Answer'], end='')


    # 챗봇 엔진 서버 연결 소켓 닫기
    mySocket.close()


if __name__ == '__main__': 
    getQuestion(sys.argv[1])
