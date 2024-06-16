import { Hono } from 'hono';

const app = new Hono();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow any origin to access
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS', // Allowed methods
  'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
};

// Function to handle CORS preflight requests
app.options('*', (c) => {
  return c.json({}, 200, corsHeaders);
});

// BITCOIN FROM COINGECKO

app.get('/bitcoin-price', async (c) => {
    try {
      //const response = await fetch('https://api.exchange.coinbase.com/products/BTC-USD/ticker', {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      const text = await response.text();
      console.log(`Response status: ${response.status}`);
      console.log(`Response status text: ${response.statusText}`);
      console.log(`Response body: ${text}`);
  
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
  
      const data = JSON.parse(text);
      return c.json(data);
    } catch (error) {
      console.error(error.message);
      return c.json({ error: error.message }, 500);
    }
  });


// CLOCKIFY

class ClockifyAPI {
  constructor(env) {
    this.apiKey = env.CLOCKIFY_API_KEY;
    this.workspaceId = env.CLOCKIFY_WORKSPACE_ID;
    this.userId = env.CLOCKIFY_USER_ID;
    this.headers = { 'X-Api-Key': this.apiKey };
  }

  async fetchTimeEntries() {
    let allEntries = [];
    let page = 1;

    while (true) {
      const endpoint = `https://api.clockify.me/api/v1/workspaces/${this.workspaceId}/user/${this.userId}/time-entries?page=${page}&page-size=200`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const timeEntries = await response.json();
      const filteredEntries = timeEntries.filter(entry => entry.timeInterval.start.startsWith('2024'));
      allEntries = allEntries.concat(filteredEntries);

      if (timeEntries.some(entry => entry.timeInterval.start.startsWith('2023')) || timeEntries.length < 200) {
        break;
      }

      page += 1;
    }

    return allEntries;
  }

  parseTimeEntries(timeEntries) {
    const parseDuration = (durationStr) => {
      if (!durationStr) return 0;
      durationStr = durationStr.slice(2);

      let hours = 0, minutes = 0, seconds = 0;
      if (durationStr.includes('H')) {
        [hours, durationStr] = durationStr.split('H');
        hours = parseInt(hours);
      }
      if (durationStr.includes('M')) {
        [minutes, durationStr] = durationStr.split('M');
        minutes = parseInt(minutes);
      }
      if (durationStr.includes('S')) {
        seconds = parseInt(durationStr.split('S')[0]);
      }

      return hours * 3600 + minutes * 60 + seconds;
    };

    return timeEntries.map(entry => {
      const { start, end, duration } = entry.timeInterval;
      return {
        id: entry.id,
        description: entry.description || '',
        projectId: entry.projectId || '',
        start,
        end,
        duration: parseDuration(duration)
      };
    });
  }
}

class TimeCalculator {
  static countWeekdaysSince(startDate) {
    const today = new Date();
    let mondays = 0, tuesdays = 0, wednesdays = 0, thursdays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= today) {
      switch (currentDate.getUTCDay()) {
        case 1: mondays += 1; break;
        case 2: tuesdays += 1; break;
        case 3: wednesdays += 1; break;
        case 4: thursdays += 1; break;
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return { mondays, tuesdays, wednesdays, thursdays };
  }

  static formatTime(hours) {
    const totalSeconds = Math.abs(Math.round(hours * 3600));
    const hoursStr = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutesStr = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secondsStr = String(totalSeconds % 60).padStart(2, '0');
    const timeString = `${hoursStr}:${minutesStr}:${secondsStr}`;
    return hours < 0 ? `-${timeString}` : timeString;
  }

  static calculateTimeDiff(timeEntries, projectId, expectedHoursPerDay, numDays) {
    const projectEntries = timeEntries.filter(entry => entry.projectId === projectId);
    const totalSeconds = projectEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const totalHours = totalSeconds / 3600;
    const expectedHours = expectedHoursPerDay * numDays;
    const diffHours = totalHours - expectedHours;
    return { diffHours, formattedTime: this.formatTime(diffHours) };
  }
}

app.get('/time-difference', async (c) => {
  try {
    const clockifyAPI = new ClockifyAPI(c.env);
    const timeEntries = await clockifyAPI.fetchTimeEntries();
    const parsedTimeEntries = clockifyAPI.parseTimeEntries(timeEntries);

    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const weekdaysCount = TimeCalculator.countWeekdaysSince(startDate);

    const socioResult = TimeCalculator.calculateTimeDiff(parsedTimeEntries, "65d5f9f3100e865c113fd585", 6.3, weekdaysCount.wednesdays + weekdaysCount.thursdays - 14);
    const lawResult = TimeCalculator.calculateTimeDiff(parsedTimeEntries, "64e7801cebeee150228ea1db", 8.4, weekdaysCount.mondays + weekdaysCount.tuesdays);

    return c.json({
      sociology: {
        totalTime: parsedTimeEntries.filter(entry => entry.projectId === "65d5f9f3100e865c113fd585").reduce((sum, entry) => sum + entry.duration, 0) / 3600,
        difference: socioResult.diffHours,
        formatted: socioResult.formattedTime
      },
      cold: {
        totalTime: parsedTimeEntries.filter(entry => entry.projectId === "64e7801cebeee150228ea1db").reduce((sum, entry) => sum + entry.duration, 0) / 3600,
        difference: lawResult.diffHours,
        formatted: lawResult.formattedTime
      }
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
