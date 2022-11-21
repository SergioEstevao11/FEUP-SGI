import math

def bullet_animation():
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

def tiefighter_animation():
    x_distance = -20
    y_distance = 0
    z_distance = 0

    duration = 10
    frames_per_second = 30
    x_distance_per_frame = x_distance / (duration * frames_per_second)

    current_x_distance = 0
    instant = 8
    f = open("./keyframe_gen_output.txt", "w")
    while(current_x_distance > x_distance):
        f.write('<keyframe instant="' + str(instant)  + '">\n')
        f.write('     <translate x="' + str(current_x_distance) + '" y="' + str(2*math.sin(current_x_distance)) + '" z="' + str(2*math.cos(current_x_distance)) + '"/>\n')
        f.write('     <rotate axis="x" angle="' + str(30*math.sin(current_x_distance)) + '" />\n')
        f.write("</keyframe>\n")
        instant += 1/frames_per_second
        current_x_distance += x_distance_per_frame

    f.close()
def main():
        tiefighter_animation()

if __name__ == "__main__":
    main()