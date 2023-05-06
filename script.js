//Setting variables and their default values
const apiURL = "https://webapi19sa-1.course.tamk.cloud/v1/weather"; //Api address that will remain the same.
let timespan = 20; //Default value for when site is loaded
let urlpath = "temperature"; // -||-
let label = "Temperature"; // -||-
let labelunit = "Temperature (c)"; // -||-
let sensorname = "temperature"; // -||-
let chart; //Variable where the chart is saved to

//setting variables of the two selectors
const timespandata = document.getElementById("timespan");
const sensordata = document.getElementById("sensor");

//If timespan selector is changed, check what the value is, and get the weather based on those values.
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

//If the selector for the sensor is changed, change variables and get weather
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

//Simple function to get get the api data.
function fetchData() {
  return fetch(`${apiURL}/${urlpath}/${timespan}`)
    .then(response => response.json())
    .then(data => data.map(item => item[`${sensorname}`]))
    .catch(error => {
      //If there is an error fetching the data, write it to the console, and to the site.
      console.error(error);
      throw new Error('Error fetching data, check connection.');
    });
}

//Chart creation function, takes weatherData as a variable.
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
  //Set chart to the ctx div
  const ctx = document.getElementById('chart').getContext('2d');
  //if chart isnt undefined, destory the chart. 
  //otherwise there will be multiple charts overlapping on the site.
  if(chart != undefined) chart.destroy();
  chart = new Chart(ctx, chartConfig); //Create new chart from the config above.
  chart.update();  //update the chart.
}

function getWeather() {
  showLoader();
  fetchData()
    .then(weatherData => {
      hideLoader();   //After the data has been fetched, the loader can be hidden.
      calculateMath(weatherData);   //Calulating the math of the specific api call
      createChart(weatherData);   //Creating the chart from this specific api call
    })
    .catch(error => { //In the case of an error
      hideLoader(); //Also hide the laoder as it isnt loading anything
      document.getElementById("error").innerHTML = error.message; //Display the error on the site.
    });
}


//function to get the newest weather of each sensor at once
function getCurrentWeather(){
  fetch(`${apiURL}/limit/50`)
    .then(response => response.json())
    .then(data =>{
      console.log(data);
      let wind_direction_letter;
      //Find the newest data of these sensors that isnt undefined.
      //Sometimes there are values that arent values, so the !== undefined is important
      const temp = data.find(item => item.data.temperature !== undefined).data.temperature;
      const wind_speed = data.find(item => item.data.wind_speed !== undefined).data.wind_speed;
      const wind_direction = data.find(item => item.data.wind_direction !== undefined).data.wind_direction;
      const rain = data.find(item => item.data.rain !== undefined).data.rain;
      const light = data.find(item => item.data.light !== undefined).data.light;
      const humidity_in = data.find(item => item.data.humidity_in !== undefined).data.humidity_in;
      const humidity_out = data.find(item => item.data.humidity_out !== undefined).data.humidity_out;

      //Cringe switch to detect what direction the wind is blowing in
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

      //Setting the div elements to show the weather values.
      document.getElementById("current_temp").innerHTML = `Temperature: ${(temp)} c °`;
      document.getElementById("current_windspeed").innerHTML = `Wind speed: ${(wind_speed)} m/s`;
      document.getElementById("current_winddirection").innerHTML = `Wind direction: ${(wind_direction_letter)}`;
      document.getElementById("current_rain").innerHTML = `Rain amount: ${(rain).toFixed(1)} mm`;
      document.getElementById("current_light").innerHTML = `Light level: ${(light).toFixed(1)}`;
      document.getElementById("current_humidity_in").innerHTML = `Humidity in: ${(humidity_in).toFixed(1)}`;
      document.getElementById("current_humidity_out").innerHTML = `Humidity out: ${(humidity_out).toFixed(1)}`;
    })
}

//function to show loader
function showLoader(){
  document.getElementById("loader").style.display = 'block';
  document.getElementById("loader2").style.display = 'block';
}

//function to hide loader
function hideLoader(){
  document.getElementById("loader").style.display = 'none';
  document.getElementById("loader2").style.display = 'none';
}

//calculating the math from a specific table
function calculateMath(data) {
  let median;
  //change the array of strings into array of floats
  const values = data.map(item => parseFloat(item));
  const length = values.length;   //length of the map
  //Mean or average is calculated with reduce. It just adds all the values together, and then divides it by the lenght of the array.
  const mean = values.reduce((acc, val) => acc + val) / length;

  //sorting the values in the array using sort. Using slice to create a copy of the array.
  const sortedValues = values.slice().sort((a, b) => a - b);
   //Returns the index of the middle value in the array. Using floor as the division might not be even.
  const mid = Math.floor(length / 2);

  //median is the middle value of an array.
  median = sortedValues[mid];

  //standard deviation shows how deviated the values are of eachother
  //variance is calculated by the sum of all the values with the mean subtracted squared, divided by the lenght of the array
  const variance = values.reduce((acc, val) => acc + (val - mean) ** 2) / length;
  //deviation is the square root of variance
  const standardDeviation = Math.sqrt(variance);


  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  //range is the minimum value of the array, subtracted from the maximum value of the array.
  const range = maxValue - minValue;
  
  //Setting the div elements to show the calculated values. They all have only one decimal point as that looks neater.
  document.getElementById("mean").innerText = `Mean: ${mean.toFixed(1)}`;
  document.getElementById("median").innerText = `Median: ${median.toFixed(1)}`;
  document.getElementById("deviation").innerText = `Deviation: ${standardDeviation.toFixed(1)}`;
  document.getElementById("range").innerText = `Range: ${range.toFixed(1)}`;
}

//calling the functions
getWeather();
getCurrentWeather();
