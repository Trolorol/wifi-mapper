#!/usr/bin/env python

import pycristoforo as pyc
import csv

import random


country = pyc.get_shape("Portugal")

points = pyc.geoloc_generation(country, 100000, "Portugal")

f = open('./wifi-dummy.csv', 'w')
writer = csv.writer(f)
writer.writerow(["BSSID","Strength","Security","Location"])
count = 0

for point in points:
    rand = random.randint(10000,90000)
    s_rand = random.randrange(-90, -30)
    operator = random.choice(["MEO", "VODAFONE", "NOS"])
    security = random.choice(["AES", "DES", "3DES", "WEP", "WPA", "WPA2"])
    c = point["geometry"]["coordinates"]
    location = "{}, {}".format(c[1], c[0])
    writer.writerow([str(operator) + str(rand), str(s_rand), str(security), location])
    print(count)
    count += 1

f.close()
# 
# writer = csv.writer(f)

# #iterate over points hash BSSID,Strength,Security,Location
# for point in points:
#     


# writer.writerow(row)


# f.close()

# with open('./wifi-dummy.csv', 'w', newline='') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         print(row['first_name'], row['last_name'])
