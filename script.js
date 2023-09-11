/*fetch elements*/

const channellinks = [
  "https://abcnews-streams.akamaized.net/hls/live/2023569/abcnews10/master.m3u8",
  "https://fox-foxnewsnow-samsungus.amagi.tv/playlist.m3u8",
  "https://livetv-channels.b-cdn.net/8050/chunklist0.m3u8",
  "https://aajtaklive-amd.akamaized.net/hls/live/2014416/aajtak/aajtaklive/live_404p/chunks.m3u8",
  "https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8",
  "https://livetv-channels.b-cdn.net/8052/chunklist0.m3u8",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const abcNews = document.querySelector("#abc");
const foxnews = document.querySelector("#fox");
const primeNews = document.querySelector("#primenews");
const aajtakNews = document.querySelector("#aajtak");
const cnnNews = document.querySelector("#cnn");
const news24News = document.querySelector("#news24");

const mainWindow = document.querySelector(".main");
const livetvWindow = document.querySelector(".livetv");

const formtab = document.querySelector(".search-form");
const input = document.querySelector("#search-tab");
const loadWindow = document.querySelector(".loader");
const wheatherInfo1 = document.querySelector(".content-1-txt");
const weekdiv = document.querySelector(".weekly-forcast");

const toggleBtn = document.querySelector(".toggle");
const displayunit = document.querySelectorAll(".temp");
const displayunit2 = document.querySelector(".temprature");

const usertab = document.querySelector(".user-logo");
const tvTab = document.querySelector(".tv-icon");
const notiTab = document.querySelector(".bell");
const searchTab = document.querySelector("#search-tab");

const grantAcessWindow = document.querySelector(".grant-acess");
const acessbtn = document.querySelector(".primary-btn");

const API_KEY = "a900867b3a2d5c2c10b7663bed0f5a33";
let unit = "cel";

let currtab = usertab;

/*default calls*/
setdefaulttemp();
defaultSetUnits();

defaultWindowcall();

/*function*/

function setallNull() {
  const weekDayTemp = document.querySelectorAll(".weektemp");
  const weekDayDesc = document.querySelectorAll(".weekdesc");
  const perHourTemp = document.querySelectorAll(".temp2");
  const perHourTime = document.querySelectorAll(".time2");
  const rainchance = document.querySelector(".rain");
  const countryName = document.querySelector(".country-name");
  const temp = document.querySelector(".temprature");
  const desc = document.querySelector(".wheather-status");
  const windspeed = document.querySelector(".wind");
  const humidity = document.querySelector(".humidity");
  const cloud = document.querySelector(".air");

  rainchance.innerText = "00";

  weekDayTemp.forEach((value) => {
    value.innerText = "00";
  });
  cnt = 0;
  weekDayDesc.forEach((value) => {
    value.innerText = "00";
  });
  cnt = 0;
  perHourTemp.forEach((value) => {
    value.innerText = "00";
  });
  cnt = 0;
  perHourTime.forEach((value) => {
    value.innerText = "00";
  });

  countryName.innerText = "00";
  temp.innerText = "00";
  desc.innerText = "00";
  windspeed.innerText = "00";
  humidity.innerText = "00";
  cloud.innerText = "00";
  weekdiv.classList.add("makeopacity1");
  wheatherInfo1.classList.add("makeopacity1");
}

function defaultWindowcall(){
  currtab = usertab;
  playChannel(-1);
  livetvWindow.classList.remove("active");
  mainWindow.classList.add("activeflex");
  usertab.classList.add("selected-icon");
  setallNull();
  getcurrLoc();
}

//fetch local coordinates
function getgeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not Supported in your browser");
  }
}
function showPosition(position) {
  let coordinates = {
    lat: 0,
    lon: 0,
  };
  coordinates.lon = position.coords.longitude;
  coordinates.lat = position.coords.latitude;

  //console.log(coordinates);
  sessionStorage.setItem("coordinates", JSON.stringify(coordinates));
  grantAcessWindow.classList.remove("activeflex");
  fetchWheatherFromCoords(coordinates);
  fetchWheatherFromCoordshourly(coordinates);
}
async function fetchWheatherFromCoords(coordinates) {
  let { lat, lon } = coordinates;
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let data = await response.json();
    rederinfo(data);
  }
  catch(err){
    setallNull();
  }
}
async function fetchWheatherFromCoordshourly(coordinates) {
  let { lat, lon } = coordinates;
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let data = await response.json();
    //console.log(data);
     renderWeeklyHoulydata(data);
  }
  catch(err){
    setallNull();
  }
}

//function for cont 3 and 2
function renderWeeklyHoulydata(data) {
  const weekDayTemp = document.querySelectorAll(".weektemp");
  const weekDayDesc = document.querySelectorAll(".weekdesc");
  const perHourTemp = document.querySelectorAll(".temp2");
  const perHourTime = document.querySelectorAll(".time2");
  const rainchance = document.querySelector(".rain");
  const a = [20, 30, 25, 29, 22, 28];
  let index = Math.floor(Math.random() * (6 - 0)) + 0;
  rainchance.innerText = a[index] + "%";
  let cnt = 0;

  weekDayTemp.forEach((value) => {
    value.innerText = data?.list[cnt]?.main?.temp;
    cnt += 6;
  });
  cnt = 0;
  weekDayDesc.forEach((value) => {
    value.innerText = data?.list[cnt]?.weather[0]?.description;
    cnt += 6;
  });
  cnt = 0;
  perHourTemp.forEach((value) => {
    value.innerText = data?.list[cnt]?.main?.temp;
    cnt += 1;
  });
  cnt = 0;
  perHourTime.forEach((value) => {
    let a = data?.list[cnt]?.dt_txt.split(" ");
    let b = a[1].split(":");
    value.innerText = b[0] + ":" + b[1];
    cnt += 1;
  });
}
async function fetchWeeklyhourlyCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    weekdiv.classList.add("makeopacity1");
    renderWeeklyHoulydata(data);
  } catch (e) {
    setallNull();
  }
}
//function of div 1
function rederinfo(data) {
  const countryName = document.querySelector(".country-name");
  const temp = document.querySelector(".temprature");
  const desc = document.querySelector(".wheather-status");
  const windspeed = document.querySelector(".wind");
  const humidity = document.querySelector(".humidity");
  const cloud = document.querySelector(".air");

  countryName.innerText = data.name;
  temp.innerText = data?.main?.temp;
  desc.innerText = data?.weather?.[0]?.description;
  windspeed.innerText = data?.wind?.speed + " mph";
  humidity.innerText = data?.main?.humidity + " %";
  cloud.innerText = data?.clouds?.all;

  getdate();
}
//curr-loc
function getcurrLoc() {
  let localCoordinates = sessionStorage.getItem("coordinates");
  if (!localCoordinates) {
    grantAcessWindow.classList.add("activeflex");
  } else {
    grantAcessWindow.classList.remove("activeflex");
    fetchWheatherFromCoords(JSON.parse(localCoordinates));
    fetchWheatherFromCoordshourly(JSON.parse(localCoordinates));
  }
}

//switching tabs
function switchTab(clickedTab) {
  if (currtab != clickedTab) {
    currtab.classList.remove("selected-icon");
    currtab = clickedTab;
    if (clickedTab !== searchTab) currtab.classList.add("selected-icon");

    if (clickedTab === tvTab) {
      mainWindow.classList.remove("activeflex");
      livetvWindow.classList.add("active");
      abcNews.classList.add("selected-channel");
      playChannel(0);
    } else if (clickedTab === usertab) {
     // playChannel(-1);
      livetvWindow.classList.remove("active");
      mainWindow.classList.add("activeflex");
      getcurrLoc();
    } else if (clickedTab === searchTab) {
     // playChannel(-1);
      livetvWindow.classList.remove("active");
      mainWindow.classList.add("activeflex");
      setallNull();
    }
  }
}

async function fetchinfoCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadWindow.classList.remove("active");
    wheatherInfo1.classList.add("makeopacity1");
    rederinfo(data);
  } catch (e) {
    alert('Provided city doesnt exits or not included in ower records');
    setallNull();
  }
}
function searchFromCity(city) {
  loadWindow.classList.add("active");
  fetchinfoCity(city);
  fetchWeeklyhourlyCity(city);
}

function rederinfodefaultcity(data) {
  const indtemp = document.querySelector(".ind");
  const usatemp = document.querySelector(".us");
  const chinatemp = document.querySelector(".ch");
  const japantemp = document.querySelector(".jap");

  if (data.name === "Delhi") indtemp.innerText = data?.main?.temp;

  if (data.name === "California") usatemp.innerText = data?.main?.temp;

  if (data.name === "Tokyo") japantemp.innerText = data?.main?.temp;

  if (data.name === "Beijing") chinatemp.innerText = data?.main?.temp;
}
async function fetchDefalutCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    rederinfodefaultcity(data);
  } catch (e) {
    alert('Provided city doesnt exits or not included in ower records');
    setallNull();
  }
}
function defaultSetUnits() {
  displayunit.forEach((value) => {
    value.setAttribute("data-value", " °C");
  });
  displayunit2.setAttribute("data-value", " °C");
}
function updateUnit(unit) {
  const prevTemp = document.querySelectorAll(".unittemp");
  if (unit === "cel") {
    prevTemp.forEach((val) => {
      let data = Number(val.innerText);
      data = data * 1.8 + 32;
      val.innerText = data.toFixed(2);
    });
  }

  if (unit === "feh") {
    prevTemp.forEach((val) => {
      let data = Number(val.innerText);
      data = (data - 32) * (5 / 9);
      val.innerText = data.toFixed(2);
    });
  }
}
function setdefaulttemp() {
  fetchDefalutCity("Delhi");
  fetchDefalutCity("California");
  fetchDefalutCity("Tokyo");
  fetchDefalutCity("Beijing");
}
function getdate() {
  let now = new Date();
  const day = document.querySelector(".day");
  day.innerText = days[now.getUTCDay()];
  const time = document.querySelector(".time");
  time.innerText = now.getHours() + " : " + now.getMinutes();
}

//livetv
/*function removeselectedChannel() {
  abcNews.classList.remove("selected-channel");
  foxnews.classList.remove("selected-channel");
  aajtakNews.classList.remove("selected-channel");
  news24News.classList.remove("selected-channel");
  primeNews.classList.remove("selected-channel");
  cnnNews.classList.remove("selected-channel");
}
function stopLoad() {
  var video = document.getElementById("video");
  video.src = "";
}
function playChannel(index) {
  if (Hls.isSupported()) {
    var video = document.getElementById("video");
    var hls = new Hls();
    if (index === -1) {
      stopLoad();
      return;
    }
    hls.loadSource(channellinks[index]);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else {
    alert("no");
  }
}*/
/*event listners*/
/*
abcNews.addEventListener("click", () => {
  removeselectedChannel();
  abcNews.classList.add("selected-channel");
  playChannel(0);
});
foxnews.addEventListener("click", () => {
  removeselectedChannel();
  foxnews.classList.add("selected-channel");
  playChannel(1);
});
primeNews.addEventListener("click", () => {
  removeselectedChannel();
  primeNews.classList.add("selected-channel");
  playChannel(2);
});
aajtakNews.addEventListener("click", () => {
  removeselectedChannel();
  aajtakNews.classList.add("selected-channel");
  playChannel(3);
});
cnnNews.addEventListener("click", () => {
  removeselectedChannel();
  cnnNews.classList.add("selected-channel");
  playChannel(4);
});
news24News.addEventListener("click", () => {
  removeselectedChannel();
  news24News.classList.add("selected-channel");
  playChannel(5);
});
*/
toggleBtn.addEventListener("click", () => {
  console.log("hi");
  updateUnit(unit);
  if (unit === "cel") {
    unit = "feh";
    displayunit.forEach((value) => {
      value.setAttribute("data-value", " °F");
    });
    displayunit2.setAttribute("data-value", " °F");
  } else {
    unit = "cel";
    displayunit.forEach((value) => {
      value.setAttribute("data-value", " °C");
    });
    displayunit2.setAttribute("data-value", " °C");
  }
});

formtab.addEventListener("submit", (e) => {
  e.preventDefault();
  //console.log("hi");
  if (input.value === "") return;
  else {
    searchFromCity(input.value);
  }
});

tvTab.addEventListener("click", () => {
  switchTab(tvTab);
});
usertab.addEventListener("click", () => {
  switchTab(usertab);
});
notiTab.addEventListener("click", () => {
  switchTab(notiTab);
});
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});
acessbtn.addEventListener("click", () => {
  getgeolocation();
});
