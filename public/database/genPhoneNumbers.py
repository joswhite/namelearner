from random import randint
phoneNumberCount = 200
dashes = [3, 6]
for i in range(200):
    number = ''
    for i in range (10):
        if i in dashes:
            number += '-'
        number += str(randint(0, 9))
    print(number)
