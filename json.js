//Setting variables and their default values
const apiURL = "https://webapi19sa-1.course.tamk.cloud/v1/weather";
let timespan = 20;
let urlpath = "limit";
let label = "Temperature";
let labelunit = "Temperature (c)";
let sensorname = "temperature";
//setting variables of the two selectors

const timespandata = document.getElementById("timespan");
const sensordata = document.getElementById("sensor");
//If timespan selector is changed, check what the value is, and get the weather based on those values.

timespandata.addEventListener('change', function() {
    switch (timespandata.value){
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
    };
    getData();
    
  });
  //If the selector for the sensor is changed, change variables and get weather

  sensordata.addEventListener('change', function() {
    switch (sensordata.value){
      case "temperature":
        urlpath = `temperature`;
        sensorname = "temperature"
        break;
      case "windspeed":
        urlpath = `wind_speed`;
        sensorname = "wind_speed"
        break;
      case "winddirection":
        urlpath = `wind_direction`;
        sensorname = "wind_direction"
        break;
      case "rainamount":
        urlpath = `rain`;
        sensorname = "rain"
        break;
      case "humidity_in":
        urlpath = `humidity_in`;
        labelunit = "Humidity (%)"
        sensorname = "humidity_in"
        break;
      case "humidity_out":
        urlpath = `humidity_out`;
        sensorname = "humidity_out"
        break;
      case "light":
        urlpath = `light`;
        sensorname = "light"
        break;
      case "all":
        urlpath = `limit`;
        break;
    };
    getData();
  });

//function to get the data and creating the table
function getData(){
    fetch(`${apiURL}/${urlpath}/${timespan}`)
    .then(response => response.json())
			.then(data => {
        //hiding the loader
        document.getElementById("dataloader").style.display = 'none';
        //variables for the table elements
				var tbody = document.querySelector("#data-table tbody");    
        let keys;
        let title;    
        let value;
        //setting the table empty so old values wont be there
        tbody.innerHTML = "";
				data.forEach(function(item) {
					var tr = document.createElement("tr");
					var td1 = document.createElement("td");
					var td2 = document.createElement("td");
					var td3 = document.createElement("td");

          //if the selection is for all the sensors, the syntax is a bit different
          if(urlpath != "limit"){
            keys = Object.keys(item); //getting the keys from json
            title = keys[1]; //Setting the title of the values from key 1
            value = item[`${sensorname}`]; //setting values from the sensor
          }
          else {
            keys = Object.keys(item.data); //getting keys from json
            title = keys[0]; //setting the title of the values from key 0
            value = item.data[`${title}`]; //value of the data is the value of the title

          }
					td1.textContent = title.charAt(0).toUpperCase()+ title.slice(1); //Changing the first letter of the title to uppercase
					td2.textContent = value;
          td3.textContent = item.date_time;
					tr.appendChild(td1);
					tr.appendChild(td2);
					tr.appendChild(td3);
					tbody.appendChild(tr);
				})
			})
      //writing errors into the 
			.catch(error => console.error(error));
}
getData();