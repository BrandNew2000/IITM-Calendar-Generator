import icalendar
from datetime import datetime
from zoneinfo import ZoneInfo

class iitmcal:
    
    hour_slots={'A':['MO0800', 'TU1300', 'TH1100', 'FR1000'], 'B':['MO0900', 'TU0800', 'WE1300', 'FR1100'], 'C':['MO1000', 'TU0900', 'WE0800', 'FR1300'], 'D':['MO1100', 'TU1000', 'WE0900', 'TH1300'], 'E':['TU1100', 'WE1000', 'TH0800', 'FR1700'], 'F':['TU1700', 'WE1100', 'TH0900', 'FR0800']}
    long_slots={'P':['MO1400'], 'Q':['TU1400'], 'R':['WE1400'], 'S':['TH1400'], 'T':['FR1400']}

    def __init__(self, cal_name="cal.ical"):
        self.file_name=cal_name
        self.cal=icalendar.Calendar()
        self.cal.add('prodid', '-//IITM Time Table//mxm.dk//')
        self.cal.add('version', '2.0')
    

    def add_event(self, start: str, end: str, summary: str, loc: str, weekly: bool, day: str):
        start = datetime.strptime(start, '%Y%m%d%H%M').replace(tzinfo=ZoneInfo("Asia/Kolkata"))
        end = datetime.strptime(end, '%Y%m%d%H%M').replace(tzinfo=ZoneInfo("Asia/Kolkata"))

        event=icalendar.Event()
        event.add('summary', summary)
        event.add('dtstart', start)
        event.add('dtend', end)
        event.add('location', loc)
        if weekly:
            event.add('rrule', {'freq':"weekly", 'byday': day})

        self.cal.add_component(event)

    def add_slot(self, slot: str, summary: str, loc: str, sem_start: str):
        if slot in self.hour_slots.keys():
            slots=self.hour_slots
            slot_len=1
        elif slot in self.long_slots.keys():
            slots=self.long_slots
            slot_len=3
        else:
            print("Skill Issue")
            exit()

        for timepoint in slots[slot]:
            start_time=sem_start+timepoint[2:]
            end_time=sem_start+f"{(int(timepoint[2:4])+slot_len):02}"+timepoint[4:]
            self.add_event(start_time, end_time, summary, loc, True, timepoint[:2])
        
    def write(self):
        with open(self.file_name, "wb") as f:
            f.write(self.cal.to_ical())



def main():
    obj = iitmcal()
    obj.add_slot('A', 'A', 'CRC101', '20250112')
    obj.write()


if __name__=="__main__":
    main()
