let returnedLongANDLatANDAccuracyJSON;
let lat;
let lng;

fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBNWZTiqu2i4JsLHXOOvXr8QCWrJhnOhYo`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
}).then((response) => response.json()).then((jsonData) => {
    console.log(jsonData);
    returnedLongANDLatANDAccuracyJSON = jsonData;
    
    lat = Number(returnedLongANDLatANDAccuracyJSON.location.lat.toFixed(4));
    lng = Number(returnedLongANDLatANDAccuracyJSON.location.lng.toFixed(4));
    console.log("lat " + lat);
    console.log("lng " + lng);
    
    

    let params = 'windDirection';
    fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
    headers: {
        'Authorization': '604a71c2-2517-11ed-8ab7-0242ac130002-604a721c-2517-11ed-8ab7-0242ac130002'
    }
        }).then((response) => response.json()).then((jsonData) => {
        
            console.log(jsonData);

            // assign current time in UTC to match API time config
            const date = new Date();
            const hour = date.getUTCHours();
            console.log(hour);

            //access the hours array and find the wind angle for the current hour
            // 0° indicates wind COMING from north
            const hours = jsonData.hours;
            // const hours = hoursArray.hours;
            const windAngleNOAA = hours[hour].windDirection.noaa;
            const windAngleSG = hours[hour].windDirection.sg;
            const windAngle = ((windAngleNOAA - windAngleSG)/2) + windAngleSG;

        
            console.log("wind angle is" + windAngle);

            let canv = document.getElementById("windDirectionArrow");
            let ctx = canv.getContext("2d");
            ctx.translate(150, 150);

            let windDirection;
            if((windAngle >= 338 && windAngle <= 360) || (windAngle >= 0 && windAngle <= 22))
            {
                windDirection = "South";
                ctx.rotate((0 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 23 && windAngle <= 67)
            {
                windDirection = "South West";
                ctx.rotate((45 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 68 && windAngle <= 112)
            {
                windDirection = "West";
                ctx.rotate((90 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 113 && windAngle <= 157)
            {
                windDirection = "North West";
                ctx.rotate((135 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 158 && windAngle <= 202)
            {
                windDirection = "North";
                ctx.rotate((180 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 203 && windAngle <= 247)
            {
                windDirection = "North East";
                ctx.rotate((225 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 248 && windAngle <= 292)
            {
                windDirection = "East";
                ctx.rotate((270 + 90 + 180) * Math.PI / 180);
            }
            else if(windAngle >= 293 && windAngle <= 337)
            {
                windDirection = "South East";
                ctx.rotate((315 + 90 + 180) * Math.PI / 180);
            }

            document.getElementById('windDirectionAngle').innerHTML = "&emsp;The current wind direction is: " + windDirection;
            
            var imageARROW = new Image();
            imageARROW.src = "arrow.png";
        
            imageARROW.onload = function() {
                ctx.drawImage(imageARROW, -150, -150, 300, 300);
            };


            //fetch wind speed
            params = 'windSpeed';
            fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
            headers: {
                'Authorization': '604a71c2-2517-11ed-8ab7-0242ac130002-604a721c-2517-11ed-8ab7-0242ac130002'
            }
                }).then((response) => response.json()).then((jsonData) => {
                    console.log("windSpeed Object:");
                    console.log(jsonData);

                    const hours = jsonData.hours;

                    const windSpeedNOAA = hours[hour].windSpeed.noaa;
                    const windSpeedSG = hours[hour].windSpeed.sg;

                    //the API documentation states that wind speed is returned in meters per second
                    //i think this is a typo?
                    //I have double checked Long and Lat coordinates and checked wind speeds from
                    //https://www.windfinder.com/forecast/burnaby_british_columbia_canada 
                    //lets assume there is a type and indeed the wind speed is returned in KMPH
                    const windSpeedInKMPH = Math.round(((windSpeedNOAA - windSpeedSG)/2) + windSpeedSG);
                    
                    
                    console.log("wind speed is: " + windSpeedInKMPH);
                    document.getElementById('windSpeed').innerHTML = "&emsp;&emsp;The current wind Speed is: " + windSpeedInKMPH + " km/h";
            });
    });

});







