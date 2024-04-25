//selecting elements from html document

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//Initially Required Variables

let currentTab=userTab;
const API_KEY="c0a4de0f4cbe06b1130611c1dceb4263";

//setting Default Tab
currentTab.classList.add("current-tab");

//Initially when web page is loaded for the first time then 
//if user's current location is present in session storage or not 
//check that using getfrom session storage function call

  getfromSessionStorage();

function switchTab(clickedTab)
{
  if(clickedTab!=currentTab)
  {
      currentTab.classList.remove("current-tab");
      currentTab=clickedTab;
      currentTab.classList.add("current-tab");
      //if block is used to make searchform visible
      if(!searchForm.classList.contains("active"))
      {
         userInfoContainer.classList.remove("active");
         grantAccessContainer.classList.remove("active");
         searchForm.classList.add("active");
      } //else block is used to make weathertab visible
      else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage(); 
            //it will get coordinates from current session 
            //and then user's location weather will be visible
      }
  }
}

userTab.addEventListener('click',()=>{
          //pass clicked tab as input parameter
          switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
     //pass clicked tab as input parameter
     switchTab(searchTab);
});

//Function to check if location coordinates are stored in user's pc or not 

function getfromSessionStorage(){
   const localCoordinates=sessionStorage.getItem("user-coordinates"); //user-coordinates are fetched using showPosition function 
   if(!localCoordinates)
   {  
     // if local coordinates are not present then show grant access screen
      grantAccessContainer.classList.add("active");
   }
   else{
    const coordinates=JSON.parse(localCoordinates); //converting local coordinates into json object
    fetchUserWeatherInfo(coordinates); //function which fetches user weather info on basis of his local coordinates
   }
}

async function fetchUserWeatherInfo(coordinates)
{
   const{lat,lon}=coordinates;
   //before api call loading screen should be visible
   grantAccessContainer.classList.remove("active");
   loadingScreen.classList.add("active");
   //API Call
     try{
         //fetching weather info from weatherapi 
         const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
         );
         const data= await response.json(); //converting weather info into json object

//after api call is completed remove loading screen and add user info conatiner
         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");

 //function renderweather info is used to remove values from data fetched from api call
// and for showing only selected values on browser 
         renderWeatherInfo(data);
     }  
     catch(e){
         loadingScreen.classList.remove("active");
         console.log("Error occured",e);
     }
}

function renderWeatherInfo(weatherInfo){
    //first fetch the elements you want to render on browser

     const cityName=document.querySelector("[data-cityName]");
     const countryIcon=document.querySelector("[data-countryIcon]");
     const desc=document.querySelector("[data-weatherDesc]");
     const weatherIcon=document.querySelector("[data-weatherIcon]");
     const temp=document.querySelector("[dataTemp]");
     const windspeed=document.querySelector("[data-windspeed]");
     const humidity=document.querySelector("[data-humidity]");
     const cloudiness=document.querySelector("[data-clouds]");
     
    //fetch values from weatherInfo object and put it in UI elements

    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

function getLocation()
{  //if browser supports geolocation api then get current loctaion of user 
   if(navigator.geolocation)
   {
      navigator.geolocation.getCurrentPosition(showPosition); //showposition is function here
   }
   else{
            alert("No Geolocation Support available for this browser.");
   }
}

function showPosition(position){
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude
  };

 sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates)); //converting userCoordinate json object to json string
 fetchUserWeatherInfo(userCoordinates);
};

//if user searches for a specific city's weather then do this
let searchInput=document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  //if search input is an empty string then simply return
  if(searchInput.value===""){
        return;
  }else{
    fetchSearchWeatherInfo(searchInput.value);
  }
});

 async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
      //Api call on basis of city name given as input by user
      const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data= await response.json();
     //after finishing api call 
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(e){
      loadingScreen.classList.remove("active");
      console.log("Error occured",e);
    }
}
