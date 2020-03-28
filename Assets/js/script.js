var windDegree;
var findCity = document.getElementById("citySearch");
var tempF;
var cityList = JSON.parse(window.localStorage.getItem("storedCities")) || [];

currentDate = moment().format("l"); // 3/21/2020

start();

function start() {
  if (cityList.length != 0) {
    for (i = 0; i < cityList.length; i++) {
      var cityButton = $("<button>").attr("value", cityList[i]);
      cityButton.attr("class", "btn");
      cityButton.attr("onclick", "currentInfo('" + cityList[i] + "')");
      cityButton.text(cityList[i]);

      $(".searched").append(cityButton);
    }
  }
}

findCity.addEventListener("click", getCityName);

function getCityName() {
  var city = document.getElementById("city").value;

  currentInfo(city);

  if (cityList.indexOf(city) == -1) {
    var cityButton = $("<button>").attr("value", city);
    cityButton.attr("class", "btn");
    cityButton.attr("onclick", "currentInfo('" + city + "')");
    cityButton.text(city);

    cityList.push(city);
    window.localStorage.setItem("storedCities", JSON.stringify(cityList));

    $(".searched").append(cityButton);
  }
}

function currentInfo(city) {  //have to get  current data in separate API than the 5 day forecast

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=8f96e056e7e69121bed0dba2ea062098";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    currentTemp = Math.round((response.main.temp - 273.15) * 1.8 + 32);
    windSpeed = Math.round(response.wind.speed);

    // Transfer content to HTML
    $(".city").html(response.name + " (" + currentDate + ")");
    $(".wind").text("Wind Speed: " + windSpeed + " mph");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
    $(".temp").text("Temperature: " + currentTemp + "F");

    // Converts the temp to Kelvin with the below formula
    tempF = (response.main.temp - 273.15) * 1.8 + 32;
    $(".tempF").text("Temperature (Kelvin) " + tempF);
    var imageTag = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );

    $(".city").append(imageTag);

    let lat = response.coord.lat; //latitude
    let lon = response.coord.lon; //longitude

    currentUv(lat, lon);
    fiveDay(city);
  });
}

function currentUv(latitude, longitude) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/uvi?&appid=8f96e056e7e69121bed0dba2ea062098&lat=" +
    latitude +
    "&lon=" +
    longitude;
 
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    $(".uv").text("UV Index: " + response.value);
    // $(".uva").text(response.value);
    if (response.value < 3) {
      $(".uva").addClass("favorable");
    } else if (response.value < 8) {
      $(".uva").addClass("moderate");
    } else {
      $(".uva").addClass("severe");
    }
  });
}

// function clearBox(city) {
//     document.getElementById(fiver).innerHTML = "";
//     fiveDay(city);
// }

function fiveDay(city) {
  $(".fiveDay").empty();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=8f96e056e7e69121bed0dba2ea062098";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    for (i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("15") != -1) {
        var divTag = $("<div>").attr("class", "dayBlock");
        $(".fiveDay").append(divTag);

        var newTag = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
        );

        divTag.append(newTag);

        var dateTag = $("<p>").attr("class", "date");
        dateTag.text(new Date(response.list[i].dt_txt).toLocaleDateString());
        divTag.append(dateTag);

        // Converts the temp to Kelvin with the below formula
        tempF = Math.round((response.list[i].main.temp - 273.15) * 1.8 + 32);
        // (0K − 273.15) × 9/5 + 32 = -459.7°F


        var tempTag = $("<p>").attr("class", "temp");
        tempTag.text("Temperature " + tempF + "F");
        divTag.append(tempTag);

        var humidTag = $("<p>").attr("class", "humid");
        humidTag.text("Humidity: " + response.list[i].main.humidity + "%");

        divTag.append(humidTag);
      }
    }
  });
}
