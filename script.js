const apiURL = "https://webapi19sa-1.course.tamk.cloud/v1/weather";
let timespan = 20;
let urlpath = "temperature";
let label = "Temperature";
let labelunit = "Temperature (c)";
let sensorname = "temperature";
let chart;

const timespandata = document.getElementById("timespan");
const sensordata = document.getElementById("sensor");

timespandata.addEventListener("change", () => {
  switch (timespandata.value) {
    case "now":
      timespan = 20;
      break;
    case "24hours":
      timespan = 24;
      break;
    case "72hours":
      timespan = 72;
      break;
    case "1week":
      timespan = 168;
      break;
    case "1month":
      timespan = 730;
      break;
  }
  document.getElementById("error").innerHTML = "";
  getWeather();
});

sensordata.addEventListener('change', function() {
  switch (sensordata.value){
    case "temperature":
      urlpath = `temperature`;
      label = "Temperature"
      labelunit = "Temperature (c)"
      sensorname = "temperature"
      break;
    case "windspeed":
      urlpath = `wind_speed`;
      label = "Wind Speed"
      labelunit = "Wind Speed (m/s)"
      sensorname = "wind_speed"
      break;
    case "winddirection":
      urlpath = `wind_direction`;
      label = "Wind Direction"
      labelunit = "Wind Direction (deg)"
      sensorname = "wind_direction"
      break;
    case "rainamount":
      urlpath = `rain`;
      label = "Rain Amount"
      labelunit = "Rain Amount (mm)"
      sensorname = "rain"
      break;
    case "humidity_in":
      urlpath = `humidity_in`;
      label = "Humidity Inside"
      labelunit = "Humidity (%)"
      sensorname = "humidity_in"
      break;
    case "humidity_out":
      urlpath = `humidity_out`;
      label = "Humidity Outside"
      labelunit = "Humidity (%)"
      sensorname = "humidity_out"
      break;
    case "light":
      urlpath = `light`;
      label = "Light level"
      labelunit = "Light level"
      sensorname = "light"
      break;

  };
  document.getElementById("error").innerHTML = "";
  getWeather();

});

function fetchData() {
  return fetch(`${apiURL}/${urlpath}/${timespan}`)
    .then(response => response.json())
    .then(data => data.map(item => item[`${sensorname}`]))
    .catch(error => {
      console.error(error);
      throw new Error('Error fetching data, check connection.');
    });
}

function createChart(weatherData) {
  const labels = Array.from({ length: weatherData.length }, (_, i ) => i + 1);
  const chartConfig = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: weatherData,
        backgroundColor: 'rgba(246,189,210)',
        borderColor: 'rgba(227,37,107)',
        borderWidth: 3
      }]
    },
    options: {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: labelunit,
          },
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }],
        xAxes:[{
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }]
      }
    }
  };
  const ctx = document.getElementById('chart').getContext('2d');
  if(chart != undefined) chart.destroy();
  chart = new Chart(ctx, chartConfig);
  chart.update();
}

function getWeather() {
  showLoader();
  fetchData()
    .then(weatherData => {
      hideLoader();
      calculateMath(weatherData);
      createChart(weatherData);
    })
    .catch(error => {
      hideLoader();
      document.getElementById("error").innerHTML = error.message;
    });
}


function getCurrentWeather(){
  fetch(`${apiURL}/limit/50`)
    .then(response => response.json())
    .then(data =>{
      console.log(data);
      let wind_direction_letter;
      const temp = data.find(item => item.data.temperature !== undefined)?.data.temperature;
      const wind_speed = data.find(item => item.data.wind_speed !== undefined)?.data.wind_speed;
      const wind_direction = data.find(item => item.data.wind_direction !== undefined)?.data.wind_direction;
      const rain = data.find(item => item.data.rain !== undefined)?.data.rain;
      const light = data.find(item => item.data.light !== undefined)?.data.light;
      const humidity_in = data.find(item => item.data.humidity_in !== undefined)?.data.humidity_in;
      const humidity_out = data.find(item => item.data.humidity_out !== undefined)?.data.humidity_out;





      switch (true) {
        case wind_direction >= 0 && wind_direction < 45:
          wind_direction_letter = "North";
          break;
        case wind_direction >= 45 && wind_direction < 90:
          wind_direction_letter = "North East";
          break;
        case wind_direction >= 90 && wind_direction < 135:
          wind_direction_letter = "East";
          break;
        case wind_direction >= 135 && wind_direction < 180:
          wind_direction_letter = "South East";
          break;
        case wind_direction >= 180 && wind_direction < 225:
          wind_direction_letter = "South";
          break;
        case wind_direction >= 225 && wind_direction < 270:
          wind_direction_letter = "South West";
          break;
        case wind_direction >= 270 && wind_direction < 315:
          wind_direction_letter = "West";
          break;
        case wind_direction >= 315 && wind_direction < 360:
          wind_direction_letter = "North West";
          break;
      }

      document.getElementById("current_temp").innerHTML = `Temperature: ${(temp)} c °`;
      document.getElementById("current_windspeed").innerHTML = `Wind speed: ${(wind_speed)} m/s`;
      document.getElementById("current_winddirection").innerHTML = `Wind direction: ${(wind_direction_letter)}`;
      document.getElementById("current_rain").innerHTML = `Rain amount: ${(rain).toFixed(1)} mm`;
      document.getElementById("current_light").innerHTML = `Light level: ${(light).toFixed(1)}`;
      document.getElementById("current_humidity_in").innerHTML = `Humidity in: ${(humidity_in).toFixed(1)}`;
      document.getElementById("current_humidity_out").innerHTML = `Humidity out: ${(humidity_out).toFixed(1)}`;


    })

}

function showLoader(){
  document.getElementById("loader").style.display = 'block';
  document.getElementById("loader2").style.display = 'block';

}

function hideLoader(){
  document.getElementById("loader").style.display = 'none';
  document.getElementById("loader2").style.display = 'none';

}

function calculateMath(data) {
  const values = data.map(item => parseFloat(item));
  console.log(values);
  const n = values.length;
  const mean = values.reduce((acc, val) => acc + val, 0) / n;
  const sortedValues = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sortedValues[mid] : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  const modeMap = {};
  values.forEach(val => modeMap[val] = (modeMap[val] || 0) + 1);
  const mode = Object.entries(modeMap).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  const standardDeviation = Math.sqrt(variance);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  document.getElementById("mean").innerText = `Mean: ${mean.toFixed(1)}`;
  document.getElementById("mode").innerText = `Mode: ${parseFloat(mode).toFixed(1)}`;
  document.getElementById("median").innerText = `Median: ${median.toFixed(1)}`;
  document.getElementById("deviation").innerText = `Deviation: ${standardDeviation.toFixed(1)}`;
  document.getElementById("range").innerText = `Range: ${range.toFixed(1)}`;

}




getWeather();
getCurrentWeather();
