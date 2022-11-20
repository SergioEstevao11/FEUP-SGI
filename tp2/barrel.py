import math

topr = float(input("top radius: "),3)
midr = float(input("middle radius: "),3)
height = float(input("height: "),3)
partsU = int(input("slices: "))
partsV = int(input("stacks: "))

d = (midr-topr)*4/3
y1 =   d/math.tan(45)
y2 =   height - y1

pointlist=[
                [-topr  ,           0,  0],
                [-topr-d,           0, y1],
                [-topr-d,           0, y2],
                [-topr  ,           0,  height],
                [-topr  , (-topr  )/0.75,  0],
                [-topr-d, (-topr-d)/0.75, y1],
                [-topr-d, (-topr-d)/0.75, y2],
                [-topr  , (-topr  )/0.75,  height],
                [+topr  , (-topr  )/0.75,  0],
                [+topr+d, (-topr-d)/0.75, y1],
                [+topr+d, (-topr-d)/0.75, y2],
                [+topr  , (-topr  )/0.75,  height],
                [+topr  ,           0,  0],
                [+topr+d,           0, y1],
                [+topr+d,           0, y2],
                [+topr  ,           0,  height]
]

print('<patch degree_u="3" parts_u="' + str(partsU) + '" degree_v="3" parts_v="' + str(partsV) + '" >')
for point in pointlist:
    print('<controlpoint x="' + str(point[0]) +'" '+ 'y="' + str(point[1]) +'" '+  'z="' + str(point[2]) +'" />')
print('</patch>')