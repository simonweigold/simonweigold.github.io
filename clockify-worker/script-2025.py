import os
import dotenv
import requests
import json
import datetime

class ClockifyAPI:
    def __init__(self):
        dotenv.load_dotenv()
        self.api_key = os.getenv("CLOCKIFY_API_KEY")
        self.workspace_id = os.getenv("CLOCKIFY_WORKSPACE_ID")
        self.user_id = os.getenv("CLOCKIFY_USER_ID")
        self.params = {'x-api-key': self.api_key}
    
    def fetch_time_entries(self):
        all_entries = []
        page = 1
        while True:
            endpoint = f"https://api.clockify.me/api/v1/workspaces/{self.workspace_id}/user/{self.user_id}/time-entries?page={page}&page-size=200"
            response = requests.request("GET", endpoint, headers=self.params)
            time_entries = response.json()

            # Filter entries at the individual level
            filtered_entries = [entry for entry in time_entries if entry['timeInterval']['start'].startswith('2025')]
            all_entries.extend(filtered_entries)
            
            # Check if there are any entries from 2023 or 2024 to stop further fetching
            if any(entry['timeInterval']['start'].startswith(('2024', '2023')) for entry in time_entries):
                break

            # If the response has fewer entries than the page size, we have reached the last page
            if len(time_entries) < 200:
                break
            
            page += 1

        return all_entries

    def parse_time_entries(self, time_entries):
        time_entries_list = []
        
        def preprocess_time_interval(time_interval):
            start = time_interval['start']
            end = time_interval.get('end', None)  # Use .get() to handle missing 'end'
            duration = time_interval['duration']
            return start, end, duration

        # Function to parse duration strings and calculate total seconds
        def parse_duration(duration_str):
            if not duration_str:
                return 0
            duration_str = duration_str[2:]  # Remove 'PT' prefix
            
            hours, minutes, seconds = 0, 0, 0
            if 'H' in duration_str:
                parts = duration_str.split('H')
                hours = int(parts[0])
                duration_str = parts[1]
            if 'M' in duration_str:
                parts = duration_str.split('M')
                minutes = int(parts[0])
                duration_str = parts[1]
            if 'S' in duration_str:
                seconds = int(duration_str.split('S')[0])
            
            total_seconds = hours * 3600 + minutes * 60 + seconds
            return total_seconds
        
        for entry in time_entries:
            start, end, duration = preprocess_time_interval(entry['timeInterval'])
            time_entry = {
                'id': entry['id'],
                'description': entry.get('description', ''),
                'projectId': entry.get('projectId', ''),
                'start': start,
                'end': end,
                'duration': parse_duration(duration)
            }
            time_entries_list.append(time_entry)
        return time_entries_list

class TimeCalculator:
    @staticmethod
    def count_weekdays_since(start_date, end_date=None):
        today = datetime.date.today()
        mondays, tuesdays, wednesdays, thursdays, fridays = 0, 0, 0, 0, 0

        current_date = start_date
        while current_date <= (end_date or today):
            if current_date.weekday() == 0:
                mondays += 1
            elif current_date.weekday() == 1:
                tuesdays += 1
            elif current_date.weekday() == 2:
                wednesdays += 1
            elif current_date.weekday() == 3:
                thursdays += 1
            elif current_date.weekday() == 4:
                fridays += 1
            current_date += datetime.timedelta(days=1)
        
        return mondays, tuesdays, wednesdays, thursdays, fridays
    
    @staticmethod
    def format_time(hours):
        total_seconds = int(hours * 3600)
        negative = total_seconds < 0
        if negative:
            total_seconds = abs(total_seconds)
        
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        time_string = "{:02d}:{:02d}:{:02d}".format(hours, minutes, seconds)
        return f"-{time_string}" if negative else time_string
    
    @staticmethod
    def calculate_time_diff(time_entries, project_id, expected_hours_per_day, num_days):
        project_entries = [entry for entry in time_entries if entry['projectId'] == project_id]
        total_seconds = sum(entry['duration'] for entry in project_entries)
        total_hours = total_seconds / 3600
        expected_hours = expected_hours_per_day * num_days
        diff_hours = total_hours - expected_hours
        return diff_hours, TimeCalculator.format_time(diff_hours)

def main():
    capi = ClockifyAPI()
    time_entries = capi.fetch_time_entries()
    time_entries = capi.parse_time_entries(time_entries)
    print(time_entries[0])
    print(min(time_entries, key=lambda x: x['start']))

    tc = TimeCalculator()
    start_date = datetime.date(2025, 1, 1)
    end_date = datetime.date.today()
    print(start_date, end_date)
    mondays, tuesdays, wednesdays, thursdays, fridays = tc.count_weekdays_since(start_date, end_date)

    print("total number of days relevant for calculation: ", mondays + tuesdays + wednesdays + thursdays + fridays)
    print("total time necessary for full-time: ", 8.4 * (mondays + tuesdays + wednesdays + thursdays + fridays))
    # Include only CoLD time entries
    law_diff, law_time_string = tc.calculate_time_diff(time_entries, "64e7801cebeee150228ea1db", 8.4, mondays + tuesdays + wednesdays + thursdays + fridays)

    print(f"Total time spent on CoLD: {sum(entry['duration'] for entry in time_entries if entry['projectId'] == '64e7801cebeee150228ea1db')/3600} hrs. Your difference is: {law_diff} hrs, formatted: {law_time_string}")

if __name__ == "__main__":
    main()
