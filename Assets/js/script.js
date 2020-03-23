//test url:  https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=8f96e056e7e69121bed0dba2ea062098

var windDegree;
var findCity = document.getElementById("citySearch");
var tempF;
var cityList = JSON.parse(window.localStorage.getItem("storedCities")) || [];
console.log("cityList = " + cityList);

currentDate = moment().format("l"); // 3/21/2020

if (cityList.length != 0) {
    for (i = 0; i < cityList.length; i++) {
        console.log("i = " + i);
      var cityButton = $("<button>").attr("value", cityList[i]).attr("class", "btn");
      $(document).on("click", currentInfo(cityList[i]));  //THIS LINE
      event.preventDefault();

      $(".searched").append(cityButton);
      //   $( "body" ).append( $newdiv1, [ newdiv2, existingdiv1 ] );
    }

    findCity.addEventListener("click", getCityName);
    getCityName();

} else {
    getCityName();

}

function getCityName() {
    var city = document.getElementById("city").value;
  
    currentInfo(city);
}

function currentInfo(city) {
  //have to get  current data in separate API than the 5 day forecast

  cityList.push(city);
  window.localStorage.setItem("storedCities", JSON.stringify(cityList));

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=8f96e056e7e69121bed0dba2ea062098";
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    currentTemp = Math.round((response.main.temp - 273.15) * 1.8 + 32);

    //  translate  ℉=((K-273.15)*1.8)+32
    console.log("kelvin = " + response.main.temp + " and F = " + currentTemp);

    windSpeed = Math.round(response.wind.speed);

    // Transfer content to HTML
    $(".city").html(response.name + " (" + currentDate + ")");
    $(".wind").text("Wind Direction and Speed: " + windSpeed + " mph");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
    $(".temp").text("Temperature: " + currentTemp + "F");

    // Converts the temp to Kelvin with the below formula
    tempF = (response.main.temp - 273.15) * 1.8 + 32;
    $(".tempF").text("Temperature (Kelvin) " + tempF);

    console.log(response.weather[0].icon);

    var imageTag = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );

    $(".city").append(imageTag);

    let lat = response.coord.lat; //latitude
    let lon = response.coord.lon; //longitude
    console.log(lat);
    console.log(lon);

    currentUv(lat, lon);
  });
}

// http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}

function currentUv(latitude, longitude) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/uvi?&appid=8f96e056e7e69121bed0dba2ea062098&lat=" +
    latitude +
    "&lon=" +
    longitude;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    $(".uv").text("UV Index: ");
    $(".uva").text(response.value);
    if (response.value < 3) {
      $(".uva").addClass("favorable");
    } else if (response.value < 8) {
      $(".uva").addClass("moderate");
    } else {
      $(".uva").addClass("severe");
    }
  });
}

// function fiveDay() {

//     var queryURL="https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=8f96e056e7e69121bed0dba2ea062098";
//     console.log(queryURL);
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then(function(response) {
//         console.log(response);
//     });

// }
