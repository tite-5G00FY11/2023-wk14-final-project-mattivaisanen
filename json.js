const apiURL = "https://webapi19sa-1.course.tamk.cloud/v1/weather";
let timespan = 20;
let urlpath = "limit";
let label = "Temperature";
let labelunit = "Temperature (c)";
let sensorname = "temperature";

const timespandata = document.getElementById("timespan");
const sensordata = document.getElementById("sensor");

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

function getData(){
    fetch(`${apiURL}/${urlpath}/${timespan}`)
    .then(response => response.json())
			.then(data => {
        document.getElementById("dataloader").style.display = 'none';
				var tbody = document.querySelector("#data-table tbody");    
        let keys;
        let title;    
        let value;
        tbody.innerHTML = "";
				data.forEach(function(item) {
          console.log(item);
					var tr = document.createElement("tr");
					var td1 = document.createElement("td");
					var td2 = document.createElement("td");
					var td3 = document.createElement("td");
          if(urlpath != "limit"){
            keys = Object.keys(item);
            title = keys[1];
            value = item[`${sensorname}`];
          }
          else {
            keys = Object.keys(item.data);
            title = keys[0];
            value = item.data[`${title}`];

          }
					td1.textContent = title.charAt(0).toUpperCase()+ title.slice(1);
					td2.textContent = value;
          td3.textContent = item.date_time;
					tr.appendChild(td1);
					tr.appendChild(td2);
					tr.appendChild(td3);
					tbody.appendChild(tr);
				});
			})
			.catch(error => console.error(error));
}
getData();