from iitmcalendar import iitmcal
import re

SEMSTART = "20250114"

INFO = """
IITM Timetable Generator
Created by Achintya Raghavan
"""

START_DISCLAIMER = """
The output file will be wriiten to the same directory as the script under the name "output.ics". This may be imported to most calendars including google/outlook.
"""

FILENAME = "output.ics"

def inp_check(inp_str, exp="^.*"):
    data = input(inp_str)
    while not re.match(exp, data):
        print("Invalid!")
        data = input(inp_str)
    
    return data

def menu(cal):
    slot = inp_check("Enter Slot: ", r"[A-FP-T]")
    summary = inp_check("Enter Summary: ")
    loc = inp_check("Enter Location: ")
    semstart  = SEMSTART
    cal.add_slot(slot, summary, loc, semstart)
    print("")



def main():
    cal = iitmcal(FILENAME)
    
    print(f"{INFO}{START_DISCLAIMER}")

    keypress='a'

    while keypress=='a':
        menu(cal)
        keypress=input("Enter 'a' to continue and any other key to quit : ")
        print()
    
    cal.write()



if __name__=="__main__":
    try:
        main()
    except:
        print("\n\nKeyboard Interrupt Detected. Terminating....\n")
        exit()
