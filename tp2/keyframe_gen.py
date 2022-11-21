
x_distance = 0
y_distance = 0
z_distance = 50

duration = 5
frames_per_second = 30
z_distance_per_frame = z_distance / (duration * frames_per_second)

current_z_distance = 0
instant = 6
f = open("./keyframe_gen_output.txt", "w")
while(current_z_distance < z_distance):
    f.write('<keyframe instant="' + str(instant)  + '">\n')
    f.write('     <translate x="' + str(current_z_distance) + '" y="0" z="0"/>\n')
    f.write("</keyframe>\n")
    instant += 1/frames_per_second
    current_z_distance += z_distance_per_frame

f.close()