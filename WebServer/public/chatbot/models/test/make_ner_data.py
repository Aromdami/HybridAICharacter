import csv
from konlpy.tag import Komoran
from random import  *

# 날짜 및 시간 관련 키워드 파일
date_file = 'date.csv'
# 과목명 관련 키워드 파일
subj_file = 'subj.csv'
# 교수명 관련 키워드 파일
prof_file = 'prof.csv'
# 강의실 호수 관련 키워드 파일
classroom_file = 'classroom.csv'

# 여러 키워드의 질문 조합 파일명
sent_file = '질문조합.csv'

komoran = Komoran(userdic='../../utils/user_dic.tsv')


file = open("output_ner_train.txt", 'w')
with open(date_file, mode='r', encoding='utf-8-sig') as df:
    dr = csv.reader(df)
    for k, r in enumerate(dr):

        # BIO 태그가 붙은 명사들을 임의 생성
        # 243 -> 으로 수정
        class_time = randint(1, 1955)
        # 과목명 파일 읽기
        with open(subj_file, mode='r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)

            for i, row in enumerate(reader):
                # food_sel->class_time 답변으로 변경
                if i != class_time: continue

                #
                sel = randint(1, 155)
                # 질문조합 처리
                with open(sent_file, mode="r", encoding="utf-8") as qf:
                    qreader = csv.reader(qf)
                    for qi, qrow in enumerate(qreader):
                        if(qi != sel): continue

                        sentence = []
                        tmp = r[0].split(' ')
                        for t in tmp:
                            date = t.split(':')
                            sentence.append(tuple(date))

                        word = row[0].split(':')
                        sentence.append(tuple(word))

                        q = qrow[0]
                        q = q.replace('\ufeff', '')
                        pos = komoran.pos(q)
                        for p in pos:
                            x = (p[0], 'O', p[1])
                            sentence.append(x)
                        break

                    # 파일 저장
                    raw_q = ";"
                    res_q = '$'
                    line = ""
                    for i, s in enumerate(sentence):
                        raw_q += "{} ".format(s[0])
                        res_q += "{} ".format(s[0])
                        if s[1] == 'B_TIME':
                            line += "{}\t{}\t{}\t{}\n".format(i + 1, s[0], 'NNG', s[1])
                        elif s[1] == 'B_PROF':
                            line += "{}\t{}\t{}\t{}\n".format(i + 1, s[0], 'NNP', s[1])
                        elif s[1] == 'B_CLASSROOM':
                            line += "{}\t{}\t{}\t{}\n".format(i + 1, s[0], 'NNG', s[1])
                        elif s[1] == 'B_SUBJ':
                            line += "{}\t{}\t{}\t{}\n".format(i + 1, s[0], 'NNP', s[1])
                        else:
                            line += "{}\t{}\t{}\t{}\n".format(i + 1, s[0], s[2], s[1])

                    print(raw_q)
                    print(res_q)
                    print(line)
                    file.write(raw_q + "\n")
                    file.write(res_q + "\n")
                    file.write(line + "\n")

file.close()
