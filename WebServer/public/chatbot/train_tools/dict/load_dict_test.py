import pickle

f = open("chatbot_dict.bin", "rb")
word_index = pickle.load(f)
f.close()

print(word_index['OOV'])
print(word_index['정상화'])
print(word_index['임베디드시스템'])
