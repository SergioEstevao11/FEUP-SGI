import math

def bullet_animation():
    x_distance = 0
    y_distance = 0
    z_distance = 50

    duration = 10
    frames_per_second = 30
    z_distance_per_frame = z_distance / (duration * frames_per_second)

    current_z_distance = 0
    instant = 15.5
    f = open("./keyframe_gen_output.txt", "w")
    while(current_z_distance < z_distance):
        f.write('<keyframe instant="' + str(instant)  + '">\n')
        f.write('     <translate x="' + str(current_z_distance) + '" y="0" z="0"/>\n')
        f.write("</keyframe>\n")
        instant += 1/frames_per_second
        current_z_distance += z_distance_per_frame

    f.close()

def tiefighter_helix():
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

def tiefighter_parabola_yz():
    x_distance = -30
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
        f.write('     <translate x="' + str(current_x_distance) + '" y="' + str(4*math.sin(math.radians(180*(current_x_distance/x_distance)))) + '" z="' + str(1*math.sin(math.radians(180*(current_x_distance/x_distance)))) + '"/>\n')
        f.write('     <rotate axis="z" angle="' + str(-15*math.cos(math.radians(180*(current_x_distance/x_distance)))) + '" />\n')
        f.write('     <rotate axis="y" angle="' + str(30*math.cos(math.radians(180*(current_x_distance/x_distance)))) + '" />\n')
        f.write("</keyframe>\n")
        instant += 1/frames_per_second
        current_x_distance += x_distance_per_frame

    f.close()

def tiefighter_hiperbole_xy():
    pass

def millenium_falcon_wobble():
    x_distance = -50
    y_distance = 0
    z_distance = 0

    duration = 10
    frames_per_second = 5
    x_distance_per_frame = x_distance / (duration * frames_per_second)

    current_x_distance = 0
    instant = 8
    f = open("./keyframe_gen_output.txt", "w")
    while(current_x_distance >= x_distance):
        f.write('<keyframe instant="' + str(instant)  + '">\n')
        f.write('     <translate x="0" y="' + str(2*(math.sin(math.radians(360*(current_x_distance/x_distance))))) + '" z="' + str(2*abs(math.sin(math.radians(360*(current_x_distance/x_distance))))) + '"/>\n')
        f.write('     <rotate axis="x" angle="' + str(15*math.sin(math.radians(360*(current_x_distance/x_distance)))) + '" />\n')
        f.write("</keyframe>\n")
        instant += 1/frames_per_second
        current_x_distance += x_distance_per_frame

    f.close()

def chase_movement():
    x_distance = 20
    y_distance = 0
    z_distance = 0

    duration = 10
    frames_per_second = 30
    x_distance_per_frame = x_distance / (duration * frames_per_second)

    current_x_distance = 0
    instant = 8
    f = open("./keyframe_gen_output.txt", "w")
    while(current_x_distance < x_distance):
        f.write('<keyframe instant="' + str(instant)  + '">\n')
        f.write('     <translate x="' + str(current_x_distance) + '" y="0" z="0"/>\n')
        f.write("</keyframe>\n")
        instant += 1/frames_per_second
        current_x_distance += x_distance_per_frame

    f.close()

def tiefighter_barrel_roll():
    x_distance = -30
    y_distance = 0
    z_distance = 0

    duration = 10
    frames_per_second = 30
    x_distance_per_frame = x_distance / (duration * frames_per_second)

    current_x_distance = 0
    instant = 8
    f = open("./keyframe_gen_output.txt", "w")
    while(current_x_distance >= x_distance):
        f.write('<keyframe instant="' + str(instant)  + '">\n')

        distance_ratio = current_x_distance / x_distance

        if(distance_ratio < 2/3):
            f.write('     <translate x="' + str(current_x_distance) + '" y="5" z="' + str(5*(math.sin(math.radians(90*( (current_x_distance/x_distance)/(2/3) ))))) + '"/>\n')
            f.write('     <rotate axis="x" angle="' + str(15*(math.sin(math.radians(90*( (current_x_distance/x_distance)/(2/3) ))))) + '" />\n')
        else:
            f.write('     <translate x="' + str(current_x_distance) + '" y="5" z="' + str(5*math.cos(math.radians(90*( ( (current_x_distance/x_distance) - 2/3 )/(1/3) )))) + '"/>\n')
            f.write('     <rotate axis="x" angle="' + str(360*( ( (current_x_distance/x_distance) - 2/3 )/(1/3) )) + '" />\n')
        f.write("</keyframe>\n")
        instant += 1/frames_per_second
        current_x_distance += x_distance_per_frame

    f.close()
def main():
        millenium_falcon_wobble()

if __name__ == "__main__":
    main()