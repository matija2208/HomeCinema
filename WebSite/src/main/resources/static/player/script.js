let timeout;
let episodesShown=false;
document.addEventListener('mousemove',function(){
    document.getElementById("videoControls").classList.add('visible')

    if(!episodesShown) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            document.getElementById('videoControls').classList.remove('visible');
        }, 2500);
    }
})

document.addEventListener("fullscreenchange", () => {
    const button = document.getElementById("maximizeMinimizeButton");
    if (document.fullscreenElement) {
        button.innerHTML = maxMinIsizeSvgs[1];
    } else {
        button.innerHTML = maxMinIsizeSvgs[0];
    }
});


document.querySelector(".episodesButton").addEventListener('click', function(){
    if(episodesShown){
        document.querySelector(".episodes").style="opacity:0; visibility:hidden";
        timeout=setTimeout(()=>{
            document.getElementById('videoControls').classList.remove('visible');
        },2500);
    }
    else {
        document.querySelector(".episodes").style = "opacity:1; visibility:visible";
        clearTimeout(timeout);
    }
    episodesShown=!episodesShown;
})
document.querySelector(".episodes").addEventListener('mouseleave', function(){
    document.querySelector(".episodes").style="opacity:0; visibility:hidden";
    timeout=setTimeout(()=>{
        document.getElementById('videoControls').classList.remove('visible');
    },2500);
    episodesShown=false;
})


let timeLine=document.getElementById("timeLine");
timeLine.addEventListener('mouseover', () => {
    timeLine.classList.add('hover');
});
timeLine.addEventListener('mouseout', () => {
    timeLine.classList.remove('hover');
});

let videoEl = document.getElementById("videoPlayer");
videoEl.addEventListener('loadedmetadata', async function(){
    timeLine.max = videoEl.duration.toFixed(0);

    let params = new URLSearchParams(location.search);

    if(params.get("type")==="movie")
    {
        let name=params.get("name");
        let year = Number(params.get("year"));

        console.log(123);

        try
        {
            let response = await axios.get(LINK+"/api/movies/one/lastWatched",{
                params:{
                    name:name,
                    year:year
                }
            })

            let seconds = timeStampToNumber(response.data.timeStamp);

            if(seconds === Number(timeLine.max))
                seconds=0;

            timeLine.value=seconds;

            timeLine.dispatchEvent(new Event('input',{bubbles:true}));

        }
        catch(err)
        {
            console.log(err);
            timeLine.value=0;

            timeLine.dispatchEvent(new Event('input',{bubbles:true}));
        }
    }
    else if(params.get("type")==="serie")
    {
        let name=params.get("name");
        let year = Number(params.get("year"));
        let seasonNumber = Number(params.get("seasonNumber"))
        let episodeNumber = Number(params.get("episodeNumber"))

        try
        {
            let response = await axios.get(LINK+"/api/episodes/one/lastWatched",{
                params:{
                    name:name,
                    year:year,
                    seasonNumber:seasonNumber,
                    episodeNumber:episodeNumber
                }
            })

            let seconds = timeStampToNumber(response.data);

            if(seconds === Number(timeLine.max))
                seconds=0;

            timeLine.value=seconds;

            timeLine.dispatchEvent(new Event('input',{bubbles:true}));

        }
        catch(err)
        {
            console.log(err);
            timeLine.value=0;

            timeLine.dispatchEvent(new Event('input',{bubbles:true}));
        }
    }

})

let data = {timeStamp:"",fileName:""}
let lastTime=0;
videoEl.addEventListener('timeupdate', function(){
    let time = this.currentTime.toFixed(0);

    data.timeStamp = Number(timeLine.value);

    if(Number(timeLine.max)-data.timeStamp<=30)
        data.timeStamp=Number(timeLine.max);

    data.timeStamp=numberToTimeStamp(data.timeStamp);

    let params = new URLSearchParams(document.getElementById("videoSource").src.split('/?')[1]);

    data.fileName = params.get("fileName").split('.')[0];

    data=new URLSearchParams({
        timeStamp:data.timeStamp,
        fileName:data.fileName
    })

    // console.log(data)

    const val = (time - timeLine.min) / (timeLine.max - timeLine.min) * 100;
    timeLine.style.background = `linear-gradient(to right, #08c8 ${val}%, #113 ${val}%)`;

    document.getElementById("currentTime").innerHTML=numberToTimeStamp(time);
    document.getElementById("remmainingTime").innerHTML=numberToTimeStamp(timeLine.max);

    timeLine.value=time;

    if(timeLine.max===timeLine.value)
    {
        let nextEpisodeButton=document.getElementById("nextEpisodeButton");
        if(nextEpisodeButton.style.display==="flex")
            nextEpisodeButton.dispatchEvent(new Event('click',{bubbles:true}));
        else
            exitPage();
    }

    if(Number(timeLine.value)-lastTime>=15) {
        saveTimeStamp();
        lastTime=Number(timeLine.value);
    }
})

document.getElementById("videoControls").addEventListener('click', function(event){

    if(event.target===event.currentTarget)
        playPause(document.getElementById("playPauseButton"));

})
document.getElementById("videoControls").addEventListener('dblclick', function(event){

    if(event.target===event.currentTarget)
        maxMinIsize(document.getElementById("maximizeMinimizeButton"));

})

function numberToTimeStamp(number)
{
    let minutes = Math.floor(number/60);
    let hours = Math.floor(minutes/60);
    minutes=minutes%60;
    let seconds=number%60;

    return `${hours>0?(hours+":"):""}${minutes>9?minutes:("0"+minutes)}:${seconds>9?seconds:("0"+seconds)}`;
}

function timeStampToNumber(timeStamp)
{
    let strs = timeStamp.split(':');
    strs.reverse();

    let number = 0;
    let multiplier=1;

    for(let str of strs)
    {
        number+=((Number(str))*multiplier);
        multiplier*=60;
    }

    return number;
}

function changeTime(input)
{
    //console.log(input)
    let time = input.value;

    const val = (time - input.min) / (input.max - input.min) * 100;
    input.style.background = `linear-gradient(to right, #08c8 ${val}%, #113 ${val}%)`;

    document.getElementById("currentTime").innerHTML=numberToTimeStamp(time);
    document.getElementById("remmainingTime").innerHTML=numberToTimeStamp(input.max);

    videoEl.currentTime=time;
}


const volumeSvgs = [`<svg class="volumeButtonSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 9.50009L21 14.5001M21 9.50009L16 14.5001M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                        `<svg class="volumeButtonSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.0012 8.99984H9.1C8.53995 8.99984 8.25992 8.99984 8.04601 9.10883C7.85785 9.20471 7.70487 9.35769 7.60899 9.54585C7.5 9.75976 7.5 10.0398 7.5 10.5998V13.3998C7.5 13.9599 7.5 14.2399 7.60899 14.4538C7.70487 14.642 7.85785 14.795 8.04601 14.8908C8.25992 14.9998 8.53995 14.9998 9.1 14.9998H10.0012C10.5521 14.9998 10.8276 14.9998 11.0829 15.0685C11.309 15.1294 11.5228 15.2295 11.7143 15.3643C11.9305 15.5164 12.1068 15.728 12.4595 16.1512L15.0854 19.3023C15.5211 19.8252 15.739 20.0866 15.9292 20.1138C16.094 20.1373 16.2597 20.0774 16.3712 19.9538C16.5 19.811 16.5 19.4708 16.5 18.7902V5.20948C16.5 4.52892 16.5 4.18864 16.3712 4.04592C16.2597 3.92233 16.094 3.86234 15.9292 3.8859C15.7389 3.9131 15.5211 4.17451 15.0854 4.69733L12.4595 7.84843C12.1068 8.27166 11.9305 8.48328 11.7143 8.63542C11.5228 8.77021 11.309 8.87032 11.0829 8.93116C10.8276 8.99984 10.5521 8.99984 10.0012 8.99984Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                        `<svg class="volumeButtonSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 9.00009C18.6277 9.83575 18.9996 10.8745 18.9996 12.0001C18.9996 13.1257 18.6277 14.1644 18 15.0001M6.6 9.00009H7.5012C8.05213 9.00009 8.32759 9.00009 8.58285 8.93141C8.80903 8.87056 9.02275 8.77046 9.21429 8.63566C9.43047 8.48353 9.60681 8.27191 9.95951 7.84868L12.5854 4.69758C13.0211 4.17476 13.2389 3.91335 13.4292 3.88614C13.594 3.86258 13.7597 3.92258 13.8712 4.04617C14 4.18889 14 4.52917 14 5.20973V18.7904C14 19.471 14 19.8113 13.8712 19.954C13.7597 20.0776 13.594 20.1376 13.4292 20.114C13.239 20.0868 13.0211 19.8254 12.5854 19.3026L9.95951 16.1515C9.60681 15.7283 9.43047 15.5166 9.21429 15.3645C9.02275 15.2297 8.80903 15.1296 8.58285 15.0688C8.32759 15.0001 8.05213 15.0001 7.5012 15.0001H6.6C6.03995 15.0001 5.75992 15.0001 5.54601 14.8911C5.35785 14.7952 5.20487 14.6422 5.10899 14.4541C5 14.2402 5 13.9601 5 13.4001V10.6001C5 10.04 5 9.76001 5.10899 9.54609C5.20487 9.35793 5.35785 9.20495 5.54601 9.10908C5.75992 9.00009 6.03995 9.00009 6.6 9.00009Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                        `<svg class="volumeButtonSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`];

function changeVolume(input)
{
    //console.log(input)
    let volumeLevel = input.value;

    localStorage.setItem("volume",volumeLevel);

    const val = (volumeLevel - input.min) / (input.max - input.min) * 100;
    input.style.background = `linear-gradient(to right, #08c8 ${val}%, #113 ${val}%)`;

    let svg = volumeSvgs[Math.floor(Number(volumeLevel)*100/34)+1];
    //console.log(svg);
    document.getElementById("volumeButton").innerHTML=svg;

    videoEl.volume = volumeLevel;
}

let volumeMuted=false;
function mute(input)
{
    //console.log(volumeMuted);
    if(volumeMuted)
    {
        changeVolume(document.getElementById("volumeInput"));
    }
    else
    {
        input.innerHTML=volumeSvgs[0];
        videoEl.volume=0;
    }

    localStorage.setItem("muted",volumeMuted)
    volumeMuted=!volumeMuted;
}

//0:pause 1:play
const playPausedSvg=[`<svg class="buttonSvg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 1H2V15H7V1Z" fill="currentColor"></path> <path d="M14 1H9V15H14V1Z" fill="currentColor"></path> </g></svg>`,
                          `<svg class="buttonSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>`];
let isPaused=false;
function playPause(button)
{
    if(isPaused)
    {
        button.innerHTML=playPausedSvg[1];
        videoEl.pause();
    }
    else
    {
        button.innerHTML=playPausedSvg[0];
        videoEl.play();
    }
    isPaused=!isPaused;
}

//0: maximize 1:minimize
const maxMinIsizeSvgs=[`<svg class="volumeButtonSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 10L20 4M20 4H15.5M20 4V8.5M4 4L10 10M4 4V8.5M4 4H8.5M14 14L20 20M20 20V15.5M20 20H15.5M10 14L4 20M4 20H8.5M4 20L4 15.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
                           `<svg class="volumeButtonSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 10L20 4M14 10H18.5M14 10V5.5M4 4L10 10M10 10V5.5M10 10H5.5M14 14L20 20M14 14V18.5M14 14H18.5M10 14L4 20M10 14H5.5M10 14V18.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`]

function maxMinIsize(button)
{
    if(document.fullscreenElement)
    {
        document.exitFullscreen();
        button.innerHTML=maxMinIsizeSvgs[0];

    }
    else
    {
        document.documentElement.requestFullscreen();
        button.innerHTML=maxMinIsizeSvgs[1];
    }
}

function saveTimeStamp()
{
    navigator.sendBeacon(LINK + "/api/files/saveTimeStamp",data);

    fetch(`${LINK}/api/files/saveTimeStamp?${data.toString()}`, {
        method: "POST",
        keepalive: true
    });


}
// let firstView=false;
// //window.addEventListener("pagehide", saveTimeStamp);
// document.addEventListener("visibilitychange",()=>{
//     if(!firstView)
//     {
//         playPause(document.getElementById("playPauseButton"));
//         firstView=true;
//     }
// });
window.addEventListener("beforeunload",saveTimeStamp)
async function exitPage()
{
    saveTimeStamp();
    let params = new URLSearchParams(location.search);
    location.href=`${LINK}?type=${params.get('type')}&name=${params.get('name')}&year=${params.get('year')}`;
}

let lastKey=null;
document.addEventListener("keydown",(event)=> {
    let k = event.key;

    if (k === " ") {
        k = lastKey;
    }
    if (k === null || k === undefined || k === "") {
        k = "k";
    }

    if (k === "k") {
        playPause(document.getElementById("playPauseButton"));
        lastKey = k;
    } else if (k === "ArrowUp") {
        let volInp = document.getElementById("volumeInput");

        volInp.value += 0.05;

        if (volInp.value > 1) volInp.value = 1;

        changeVolume(volInp);
        lastKey = k;
    } else if (k === "ArrowDown") {
        let volInp = document.getElementById("volumeInput");

        volInp.value -= 0.05;

        if (volInp.value < 0) volInp.value = 0;

        changeVolume(volInp);
        lastKey = k;
    } else if (k === "ArrowLeft") {
        let timeline = document.getElementById("timeLine");


        timeline.value = Number(timeline.value) - 10;

        if (Number(timeline.value) < Number(timeline.minValue)) timeline.value = timeline.min;

        changeTime(timeline);
        lastKey = k;
    } else if (k === "ArrowRight") {
        let timeline = document.getElementById("timeLine");

        timeline.value = Number(timeline.value) + 10;

        if (Number(timeline.value) > Number(timeline.max)) timeline.value = timeline.max;

        changeTime(timeline);
        lastKey = k;
    }
    else if (k === "f")
    {
        maxMinIsize(document.getElementById("maximizeMinimizeButton"));
    }

})

if(document.fullscreenElement)
{
    document.getElementById("maximizeMinimizeButton").innerHTML=maxMinIsizeSvgs[1];

}
else
{
    document.getElementById("maximizeMinimizeButton").innerHTML=maxMinIsizeSvgs[0];
}

let volumeLevel = Number(localStorage.getItem("volume"));

document.getElementById("volumeInput").value=volumeLevel;

volumeMuted=(localStorage.getItem("muted")==="true");

changeVolume(document.getElementById("volumeInput"));
mute(document.getElementById("volumeButton"));

let seasonMenuSvg=`<svg class="buttonSvg seasonButtonSvg" onclick="seasonMenu()" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.00 52.00" enable-background="new 0 0 52 52" xml:space="preserve" stroke="#000000" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke-width="0.0005200000000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.312"></g><g id="SVGRepo_iconCarrier"> <path d="M48.6,23H15.4c-0.9,0-1.3-1.1-0.7-1.7l9.6-9.6c0.6-0.6,0.6-1.5,0-2.1l-2.2-2.2c-0.6-0.6-1.5-0.6-2.1,0 L2.5,25c-0.6,0.6-0.6,1.5,0,2.1L20,44.6c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1c0.6-0.6,0.6-1.5,0-2.1l-9.6-9.6C14,30.1,14.4,29,15.3,29 h33.2c0.8,0,1.5-0.6,1.5-1.4v-3C50,23.8,49.4,23,48.6,23z"></path> </g></svg>`
async function loadEpisodeList(seasonNumber)
{
    try
    {
        let params=new URLSearchParams(location.search)

        let name = params.get("name");
        let year = params.get("year");

        let response = await axios.get(LINK+"/api/episodes/all",{
            params:{
                serieName: name,
                year:year,
                seasonNumber:seasonNumber
            }
        })

        let episodes=response.data;

        console.log(episodes);

        let episodesContainer = document.getElementById("episodeContainer");
        episodesContainer.innerHTML="";

        for(let episode of episodes)
        {
            episode.timeStamp=null;

            try
            {
                let res = await axios.get(LINK+"/api/episodes/one/lastWatched",{
                    params:{
                        name:name,
                        year:year,
                        seasonNumber:seasonNumber,
                        episodeNumber:episode.episodeNumber
                    }
                })

                episode.timeStamp=res.data;
            }
            catch(err)
            {
                console.log(err);
            }

            episodesContainer.innerHTML+=`
                <div class="episodeFocus" onclick="saveTimeStamp();location.href='${LINK}/player?type=serie&name=${name}&year=${year}&seasonNumber=${seasonNumber}&episodeNumber=${episode.episodeNumber}'">
                    <div class="epNoNameWrapper">
                        <p class = "episodeNumber">${episode.episodeNumber}</p>
                        <p class = "episodeName">${episode.name===null?"":episode.name}</p>
                    </div>
                    <p class = "episodeTimeStamp">${episode.timeStamp===null?"":episode.timeStamp}</p>
                </div>
            `;
        }

        document.getElementById("seasonNameContainer").innerHTML=`${seasonMenuSvg}<h2 class="seasonName">Season ${seasonNumber}</h2>`
    }
    catch(err)
    {
        console.log(err);
    }
}

async function seasonMenu()
{
    try
    {
        let params= new URLSearchParams(location.search)
        let name=params.get("name");
        let year=Number(params.get("year"))

        let response = await axios.get(LINK+"/api/seasons/all",{
            params:{
                serieName:name,
                year:year
            }
        })

        let seasons=response.data;

        console.log(seasons);

        let episodesContainer = document.getElementById("episodeContainer");
        episodesContainer.innerHTML="";

        for(let season of seasons)
        {
            episodesContainer.innerHTML+=`
                <div class="episodeFocus" onclick="loadEpisodeList(${season.seasonNumber})">
                    <div class="epNoNameWrapper">
                        <p class = "episodeNumber">Season</p>
                        <p class = "episodeName">${season.seasonNumber}</p>
                    </div>
                    <p class = "episodeTimeStamp">${season.name===null?"":season.name}</p>
                </div>
            `;
        }
        document.getElementById("seasonNameContainer").innerHTML=`<h2 class="seasonName">Seasons</h2>`;
    }
    catch(err)
    {
        console.log(err);
    }
}

async function onLoad()
{
    let params = new URLSearchParams(location.search)

    console.log(params.get("type"));
    if(params.get("type")==='movie')
    {
        let name = params.get('name');
        let year = Number(params.get('year'));

        if(name===null || year===0)
        {
            history.back();
            return;
        }

        try
        {
            let response=await axios.get(LINK+"/api/movies/one",{
                params:{
                    name:name,
                    year:year
                }
            })

            let movie = response.data;

            document.getElementById("title").innerHTML=movie.name;
            document.getElementById("extraText").innerHTML=movie.year;

            document.getElementById("thisEpisodeName").style.display="none";
            document.getElementById("episodesButton").style.display="none";
            document.getElementById("nextEpisodeButton").style.display="none";

            document.title=movie.name;

            //console.log(movie);

            let videoEl = document.getElementById("videoPlayer");

            videoEl.innerHTML=`<source id="videoSource" src="${(LINK+"/api/files/?fileName="+movie.fileName)}">`;
            videoEl.load();
        }
        catch(err)
        {
            console.log(err);
        }

        // console.log(name)
        // console.log(year)
    }
    else if(params.get('type')==='serie')
    {

        let name = params.get('name');
        let year = Number(params.get('year'));
        let seasonNumber = Number(params.get('seasonNumber'));
        let episodeNumber = Number(params.get('episodeNumber'));

        if(name===null || year===0 || seasonNumber===0 || episodeNumber===0)
        {
            history.back();
            return;
        }

        try
        {
            let response = await axios.get(LINK+"/api/episodes/one",{
                    params:{
                        serieName:name,
                        year:year,
                        seasonNumber:seasonNumber,
                        episodeNumber:episodeNumber
                    }
                })

            let episode = response.data;

            document.getElementById("title").innerHTML=name;
            document.getElementById("extraText").innerHTML=(year+" S"+seasonNumber+"E"+episodeNumber);

            document.getElementById("thisEpisodeName").style.display="flex";
            document.getElementById("thisEpisodeName").innerHTML=episode.name;
            document.getElementById("episodesButton").style.display="flex";

            document.title=name;

            try
            {
                let response = await axios.get("/api/episodes/one/nextEpisode",{
                    params:{
                        name:name,
                        year:year,
                        seasonNumber:seasonNumber,
                        episodeNumber:episode.episodeNumber
                    }
                });

                let nextEpisode = response.data;

                console.log(response)

                document.getElementById("nextEpisodeButton").onclick = async function(){
                    await saveTimeStamp();

                    window.history.pushState({}, '', `?type=serie&name=${name}&year=${year}&seasonNumber=${nextEpisode.seasonNumber}&episodeNumber=${nextEpisode.episodeNumber}`);
                    onLoad();
                    //location.href=`${LINK}/player?type=serie&name=${name}&year=${year}&seasonNumber=${nextEpisode.seasonNumber}&episodeNumber=${nextEpisode.episodeNumber}`;
                }
                document.getElementById("nextEpisodeButton").style.display="flex";
            }
            catch(err)
            {

                document.getElementById("nextEpisodeButton").style.display="none";
                console.log(err);
            }

            //console.log(movie);

            let videoEl = document.getElementById("videoPlayer");

            videoEl.innerHTML=`<source id="videoSource" src="${(LINK+"/api/files/?fileName="+episode.fileName)}">`;
            videoEl.load();
            await loadEpisodeList(seasonNumber);

            //console.log(episode);
        }
        catch(err)
        {
            console.log(err);
        }

        console.log(name)
        console.log(year)
        console.log(seasonNumber)
        console.log(episodeNumber)
    }
    else
    {
        history.back();
    }

}

onLoad();

