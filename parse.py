import json

data_dict = {}
with open("./courses.tsv", "r") as file:
    file.readline()
    for line in file.readlines():
        data = line.split("\t")
        data = [item.strip() for item in data]

        course_num = data[0]
        if len(course_num) > 6:
            course_num = course_num[:6]
        
        name = data[4]
        slot = data[2]
        venue = data[15]

        if slot[-1:] == "1":
            slot = slot[:-1]
        if slot not in ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T"]:
            slot = ""

        if course_num in data_dict:
            # if data_dict[course_num]["name"] !=  name:
            #     data_dict[course_num]["name"] = ""
            if data_dict[course_num]["slot"] !=  slot:
                data_dict[course_num]["slot"] = ""
            if data_dict[course_num]["venue"] !=  venue:
                data_dict[course_num]["venue"] = ""
        else:
            data_dict[course_num]= {"name": name, "slot": slot, "venue": venue}

        

print(json.dumps(data_dict))