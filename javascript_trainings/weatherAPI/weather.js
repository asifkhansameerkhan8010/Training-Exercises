let input=document.getElementById("inputs");
let cityname=document.getElementById("cityname");
let temperature=document.getElementById("temperature");
let humids=document.getElementById("humidity");
let searchbtn=document.getElementById("searchbtn");
let wicon=document.getElementById("icon");
let apikey="de702e942b245eeaf2cb87b4f27f5d84";
let errmsg=document.getElementById("err");

searchbtn.addEventListener("click",async event=>{
    const city=input.value;
    console.log(city);
    if(city)
    {
        errmsg.style.display="none";
       try{
          const data=await getWeatherdata(city);
          displayweather(data);
       }
       catch(error){
        console.error(error);
       }
    }
    else{
        displayError();
    }
})

async function getWeatherdata(city)
{
    const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response=await fetch(apiUrl);
    
    if(!response.ok)
    {
        throw new Error("Could not fetch");
    }

    return await response.json();
}


function displayweather(data){
    const {name:city,
        main:{temp,humidity},
        weather:{id}}=data
    console.log(data);
    cityname.textContent=city;
    temperature.textContent=`${(temp-273.15).toFixed(1)}°C`;
    humids.textContent=`${humidity}%`
    wicon.textContent=getweathericon(id);
}

function getweathericon(id){
    switch(true){
        case(id>=200 && id<300):
           return "⛈";
        case(id>=300 && id<400):
            return "🌦";
        case(id>=500 && id<600):
            return "🌧";
        case(id>=600 && id<700):
            return "❄";
        case(id>=700 && id<800):
            return "🌤";
        case(id==800):
            return "☀";
        case(id>800 && id<810):
           return "☁";
        default:
            return "❓";
    }
}

function displayError(message){
    errmsg.style.display="block";
    console.log("Please Enter a City!");
}
