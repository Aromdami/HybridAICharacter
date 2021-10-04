
a = ["오늘", "내일", "다음주"]
for k in a:
    time = "{}:B_DT".format(k)
    print(time)


for k in a:
     for i in range(24):
         time = "{}:B_DT".format(k) + " {}시:B_DT".format(i)
         print(time)


for k in a:
     for i in range(24):
         for m in range(60):
             time = "{}:B_DT".format(k) + " {}시:B_DT {}분:B_DT".format(i, m)
             print(time)


for i in range(24):
     for m in range(60):
         time = "{}시:B_DT {}분:B_DT".format(i, m)
         print(time)