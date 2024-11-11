// I don't know if i should put api key here or not, but because its not production i think it should be fine
const apiKey = "e73a89a3ffd347bff8df5e833139cbcd";
const url = "https://api.openweathermap.org/data/2.5/forecast";

// This is jakarta latitude and longitude
const lat = "6.1944";
const lon = "106.8229";

const fetchData = async () => {
  try {
    const response = await fetch(
      `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const kelvinToCelsius = (temp) => {
  return (temp - 273.15).toFixed(2);
};

const mappingData = (data) => {
  const result = [];

  if (data.list) {
    data.list.forEach((item) => {
      // Get the date from the text date
      const givenDate = new Date(item.dt_txt);
      const currentDate = new Date();

      // Only save data for next 5 days
      if (givenDate.getDay() - currentDate.getDay() < 5) {
        result.push({
          date: givenDate,
          temp: kelvinToCelsius(item.main.temp), // Data in api use kelvin so we need to convert to celsius
        });
      }
    });
  }

  // Remove duplicate data by its day
  return getUniqueDataPerDay(result);
};

function getUniqueDataPerDay(data) {
  const uniqueDates = new Set();

  // I use filter to remove date that are added to uniqueDates
  return data.filter((item) => {
    const date = new Date(item.date).toISOString().split("T")[0];

    // If date is not in uniqueDates
    if (!uniqueDates.has(date)) {
      // Add date to uniqueDates and put it in result
      uniqueDates.add(date);
      return true;
    }

    // If date is in uniqueDates then dont put it in result
    return false;
  });
}

// This one quite confusing, if it from php it should have been more easy but i don't know how to do it in pure js, although there is library for that but i will avoid it for now
function getDateString(date) {
  // I'll be using Intl for this one this is the docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat

  // Create date formatter
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short", // Weekday use the 3 characters format
    day: "2-digit", // Day use the 2 number format
    month: "short", // Month use the 3 characters format
    year: "numeric", // Year use the number format meaning no changing
  });

  // Make it as parts so we can access each part
  const parts = formatter.formatToParts(date);
  const partsMap = parts.reduce((acc, part) => {
    acc[part.type] = part.value; // Assign each part to the object
    return acc;
  }, {});

  // Return the result with the format we want
  return `${partsMap.weekday}, ${partsMap.day} ${partsMap.month} ${partsMap.year}`;
}

const run = async () => {
  // Fetch data first from API
  let data = await fetchData();

  // Then map the data
  data = mappingData(data);

  // Print the result
  console.log("Weather Forecast: ");
  data.forEach((item) => {
    console.log(getDateString(item.date) + ": " + item.temp + "°C");
  });
};

run();
