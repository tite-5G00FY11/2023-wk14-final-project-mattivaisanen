Final Project by: Matti Väisänen

This site was created for IoT and Web Development 2023 class at TAMK

HTML was created by using Bootstrap 5 and basic HTML.
Very little CSS was used as Bootstrap 5 is very versatile.

The javascript was created by me with the help of some ChatGPT (obviously).
I have seperated the javascript mostly into functions to keep it consice and easily readable.

Site can be found from https://tite-5g00fy11.github.io/2023-wk14-final-project-mattivaisanen/


script.js:

getWeather function as the name suggests, gets the weather information from another function, and does the necessary work to show the data on the site. The function calls other functions, and gives them the weatherData as an argument.
The function calls fetchData, calculateMath and createChart.

fetchData function gets the actual data from the API, based on the selection of the user from the site. As default the data fetched is the temperature data from the last 20 hours. Otherwise it fetches the data based on the user. Then it returns the data found.

createChart function gets weatherData from getWeather and creates a chart from it. It gets it's labels from the sensor selected, and the weatherData is an argument passed from getWeather. The function first creates the configuration for the chart, then destroys any previous possible charts and then creates the new one, and pushes it on to the site.

getCurrentWeather function gets its own weather data and doesnt use the getWeather function. This is because it needs the latest data from all the sensors, not just one. The function gets all the possible values from the api, and then displays it on the site.

calculateMath function gets its data from getWeather. First it changes the array of strings into an array of floats. Then it calculates the lenght of the array. The function calculates mean, median, standard deviation and range from the current selection of the sensor. Then it displays the calculations under the chart.


json.js:

This script only has one function; getData. First it calls the api and gets 50 of the latest values from all the sensors. Then creates a table, and displays the data on the table. It gets the name of the sensor from the api, aswell as the value and the timestamp.

This script is very simple and quite consice. It has a lot of the same code as script.js for the selection boxes.