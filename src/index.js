import "./template.css";
import Day from "./day";

async function fetchWeatherData(location) {
  try {
    const response = await fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
        location +
        "?key=VGWSEMM6QDU6P6M7RFPQQWCDZ",
      {
        mode: "cors",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

function parseWeatherData(data) {
  let daysList = [];

  let rawDays = data.days;
  console.log(rawDays);
  for (let rawDay of rawDays) {
    const dateTime = rawDay.datetime;
    const tempMin = rawDay.tempmin;
    const tempMax = rawDay.tempmax;
    const conditions = rawDay.conditions;

    const newDay = new Day(dateTime, tempMax, tempMin, conditions);

    daysList.push(newDay);
  }

  return daysList;
}

async function userQuery(location) {
  let data = await fetchWeatherData(location);
  return parseWeatherData(data);
}

function renderDay(day) {
  const dayContainer = document.createElement("div");
  dayContainer.classList.add("day-card");

  const datetimeDiv = document.createElement("div");
  const tempMinDiv = document.createElement("div");
  const tempMaxDiv = document.createElement("div");
  const conditionsDiv = document.createElement("div");

  datetimeDiv.textContent = day.datetime;
  tempMinDiv.textContent = day.tempmin;
  tempMaxDiv.textContent = day.tempmax;
  conditionsDiv.textContent = day.conditions;

  dayContainer.appendChild(datetimeDiv);
  dayContainer.appendChild(tempMinDiv);
  dayContainer.appendChild(tempMaxDiv);
  dayContainer.appendChild(conditionsDiv);

  return dayContainer;
}

function renderDays(days) {
  const daysContainer = document.getElementById("days-container");
  for (let day of days) {
    let dayContainer = renderDay(day);
    daysContainer.appendChild(dayContainer);
  }
}

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", async () => {
  const inputData = document.getElementById("location").value;
  document.getElementById("location").value = "";
  let dayList = await userQuery(inputData);
  renderDays(dayList);
});
