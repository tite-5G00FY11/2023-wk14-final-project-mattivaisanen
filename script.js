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

function getWeather(){
  showLoader();
  fetch(`${apiURL}/${urlpath}/${timespan}`)
  .then(response => response.json())
  .then(data => {
    hideLoader();
    const weatherData = data.map(item => item[`${sensorname}`]);
    console.log(weatherData);
    calculateMath(weatherData);
      const labels = Array.from({ length: weatherData.length }, (_, i ) => i + 1);
      const chartConfig = {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: label,
              data: weatherData,
              backgroundColor: 'rgba(109,36,42)',
              borderColor: 'rgba(109,3,3,0.2)',
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
  })
  .catch(error => {
    console.error(error);
    hideLoader();
    document.getElementById("error").innerHTML = "Error fetching data, check connection.";
  })
}



function getCurrentWeather(){
  fetch(`${apiURL}/current`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    document.getElementById("current_temp").innerHTML = "homo";

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

  document.getElementById("mean").innerText = `Mean: ${mean.toFixed(1)}`;
  document.getElementById("mode").innerText = `Mode: ${parseFloat(mode).toFixed(1)}`;
  document.getElementById("median").innerText = `Median: ${median.toFixed(1)}`;
  document.getElementById("deviation").innerText = `Standard deviation: ${standardDeviation.toFixed(1)}`;
}




getWeather();
getCurrentWeather();
