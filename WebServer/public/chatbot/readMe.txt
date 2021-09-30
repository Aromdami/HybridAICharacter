우선 Mysql 켜서 root 계정 및 PW: 12345으로 DB 'homestead' 만드셨다는 가정 하에 순서입니다. 

(1) config\
ⓐ DatabaseConfig.py
ⓑ GlobalParams.py
(2) utils\
ⓒ Prepocess.py
(3) train_tools\
ⓓ create_dict .py
ⓔ create_train_data_table.py
(4) intent\
ⓕ train_model.py
ⓖ IntentModel.py
(5) ner\
ⓗ train_model.py
ⓘ NerModel.py
(6) test\
make_set.py
make_que.py
make_userdict_corpus.py
make_ner_data.py
make_ner_corpus.py
(6) utils\
ⓙ Database.py
ⓚ FindAnswer.py
(7) test\
ⓛ chatbot_client_test.py
(8) utils\
ⓜ BotServer.py
(9) (최상위폴더)\
ⓝ bot.py
(10) test\
ⓞ chatbot_client_test.py