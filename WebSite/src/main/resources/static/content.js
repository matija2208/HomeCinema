async function loadMovies()
{
    document.title = "Movies";

    document.getElementById("lastWatched").style.display = "none";
    document.getElementById("movies").style.display = "block";
    document.getElementById("series").style.display = "none";

    let response = await axios.get(LINK + "api/movies/all");
    // console.log(response);

    let movies = response.data;
    let container = document.getElementById("moviesContainer");

    container.innerHTML = "";
    movies.forEach(movie => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML =
        `
            <img src="${LINK+"api/files/?fileName="+movie.posterName}" alt="Poster banner">
            <div class="card-content">
                <p class="title">${movie.name}</p>
                <div class = "serie-info">
                    <p class = "extra">${movie.year}</p>
                 ` + (movie.category!==null ? `<p class = "extra">${movie.category}</p></div>` : "</div>");
        card.onclick=()=>{
            const Url = new URL(window.location.href);
            Url.searchParams.set("name",movie.name);
            Url.searchParams.set("year",movie.year);
            Url.searchParams.set("type","movie");
            window.history.pushState({}, '', Url);
            loadFocus();
        }
        if (movie.posterName === null || movie.posterName === "") {
            card.querySelector("img").style.display = "none"; // Hide image if no poster
            card.querySelector(".card-content").style = "opacity: 1;pointer-events: auto;z-index: 1;";
        }
        container.appendChild(card);
    });
}



async function loadSeries()
{
    document.title = "Series";

    document.getElementById("lastWatched").style.display = "none";
    document.getElementById("movies").style.display = "none";
    document.getElementById("series").style.display = "block";

    let response = await axios.get(LINK + "api/series/all");
    console.log(response);

    let series = response.data;
    let container = document.getElementById("seriesContainer");

    container.innerHTML = "";
    series.forEach(serie => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML =
        `
            <img src="${LINK+"api/files/?fileName="+serie.posterName}" alt="Poster banner">
            <div class="card-content">
                <p class="title">${serie.name}</p>
                <div class = "serie-info">
                    <p class = "extra">${serie.year +" "+serie.noOfSeasons}</p>
                     <p class = "extra">${serie.category}</p></div>
        `;
        card.onclick=()=>{
            const Url = new URL(window.location.href);
            Url.searchParams.set("name",serie.name);
            Url.searchParams.set("year",serie.year);
            Url.searchParams.set("type","serie");
            window.history.pushState({}, '', Url);
            loadFocus();
        }
        if (serie.posterName === null || serie.posterName === "") {
            card.querySelector("img").style.display = "none"; // Hide image if no poster
            card.querySelector(".card-content").style = "opacity: 1;pointer-events: auto;z-index: 1;";
        }
        container.appendChild(card);
    });
}

async function loadLastWatched()
{
    try
    {
        document.title = "Last Watched";
        document.getElementById("lastWatched").style.display = "block";
        document.getElementById("movies").style.display = "none";
        document.getElementById("series").style.display = "none";

        let responseMovies = await axios.get(LINK + "api/movies/lastWatched");
        let responseSeries = await axios.get(LINK + "api/series/lastWatched");

        console.log("Movies:", responseMovies.data);
        console.log("Series:", responseSeries.data);

        let movies = responseMovies.data;
        let series = responseSeries.data;

        let videos = [...movies, ...series];

        
        videos.sort((a, b) => {
            return new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime();
        })

        if (videos.length === 0)
        {
            //document.getElementById("lastWatched").style.display = "none";

            let movies = await axios.get(LINK + "api/movies/all");
            let series = await axios.get(LINK + "api/series/all");

            console.log("No last watched content found, loading all movies and series.");
            videos = [...movies.data, ...series.data];
            videos.sort((a, b) => {
                if (a.name.localeCompare(b.name) === 0)
                    return a.year - b.year; // Sort by year if names are the same
                return a.name.localeCompare(b.name); // Sort by name
            });

            let sectionTitles = document.querySelectorAll(".sectionTitle");
            sectionTitles.forEach(title => {
                title.style.display = "none"; // Hide section titles if no last watched content
            });

        }


        console.log("Sorted Videos:", videos);

        let container = document.getElementById("lastWatchedContainer");
        container.innerHTML = "";
        for (let i = 0; i < Math.min(10,videos.length); i++)
        {
            let video = videos[i];
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${LINK + "api/files/?fileName=" + (video.posterName)}" alt="Poster banner">
                <div class="card-content">
                    <p class="title">${video.name}</p>
                    <div class="serie-info">
                        <p class="extra">${video.year}${(video?.noOfSeasons !== null && video.noOfSeasons !== undefined) ? " " + video.noOfSeasons : ""}</p>
                        ${video.category !== null ? `<p class="extra">${video.category}</p>` : ""}
                    </div>
                </div>
            `;

            card.onclick=()=>{
                const Url = new URL(window.location.href);
                Url.searchParams.set("name",video.name);
                Url.searchParams.set("year",video.year);
                Url.searchParams.set("type",(video?.noOfSeasons !== null && video.noOfSeasons !== undefined)?"serie":"movie");
                window.history.pushState({}, '', Url);
                loadFocus();
            }

            if (video.posterName === null || video.posterName === "") {
                card.querySelector("img").style.display = "none"; // Hide image if no poster
                card.querySelector(".card-content").style = "opacity: 1;pointer-events: auto;z-index: 1;";
            }
            container.appendChild(card);
        }
    }
    catch (error)
    {
        console.log("Error loading last watched content:", error);
    }
}

async function loadContent()
{
    try
    {
        let params = new URLSearchParams(window.location.search);
        let content = params.get("content") || "lastWatched"; // Default to lastWatched if no content specified
        
        if(content === "lastWatched")
        {
            loadLastWatched();
        }
        else if(content === "movies")
        {
            loadMovies();
        }
        else if(content === "series")
        {
            loadSeries();
        }
        else
        {
            loadLastWatched();
        }
    }
    catch (error)
    {
        console.log("Error loading content:", error);
    }
}

loadContent();

let changeSeasonButtonValue=true;
function changeSeasonButton()
{
    if(changeSeasonButtonValue)
    {
        document.getElementById("seasonList").style.display="flex";
    }
    else
    {
        document.getElementById("seasonList").style.display="none";
    }

    changeSeasonButtonValue=!changeSeasonButtonValue;
}

async function changeSeason(name,year,seasonNumber)
{
    try
    {
        let response = await axios.get(LINK+"api/seasons/one",{
            params: {
                serieName: name,
                year: year,
                seasonNumber: seasonNumber
            }
        });

        let season = response.data;

        let seasonButton = document.getElementById("focusSeasonButton");

        let svg="<svg"+seasonButton.innerHTML.split('<svg')[1];

        seasonButton.innerHTML="Season "+seasonNumber+" "+svg;

        console.log(season);

        if(season.name!==null)
        {
            document.getElementById("focusSeasonButtonLabel").innerHTML=season.name;
        }
        else
        {
            document.getElementById("focusSeasonButtonLabel").innerHTML="";
        }

        console.log(svg);

        let episodeContainer = document.getElementById("episodesFocus");
        episodeContainer.innerHTML="";
        for(let episode of season.episodes)
        {
            let timeStamp=null;
            try
            {
                response = await axios.get(LINK+"api/episodes/one/lastWatched",{
                    params: {
                        name: name,
                        year: year,
                        seasonNumber: season.seasonNumber,
                        episodeNumber: episode.episodeNumber
                    }
                });

                timeStamp = response.data;
            }
            catch (err)
            {
                console.log(err);
            }

            episodeContainer.innerHTML+=`
                <div class="episode" onclick="document.location.href='${LINK+"player?type=serie&name="+name+"&year="+year+"&seasonNumber="+seasonNumber+"&episodeNumber="+episode.episodeNumber}';">
                    <p class = "episodeNumber">${episode.episodeNumber}</p>
                    <p class = "episodeName">${((episode.name!==null)?episode.name:"")}</p>
                    <p class = "episodeTimeStamp">${((timeStamp!==null)?timeStamp:"")}</p>
                </div>`
        }

        document.getElementById("seasonList").style.display="none";
        changeSeasonButtonValue=!changeSeasonButtonValue
    }
    catch(err)
    {
        console.log(err);
    }
}

function findFirstEpisode(seasons)
{

    for(let i=0;i<seasons.length;i++)
    {
        if(seasons[i].episodes.length>0)
            return i;
    }
    return -1;
}

async function loadFocus()
{
    let params = new URLSearchParams(window.location.search);
    let type = params.get("type");
    let name=params.get("name");
    let year = Number(params.get("year"));

    console.log(year);
    console.log(name);
    console.log(type);

    if(year===0 && name===null && type===null)
    {
        return;
    }

    if(type==="movie")
    {
        try
        {
            let response = await axios.get(LINK+"api/movies/one",{
                params:{
                    name:name,
                    year:year
                }
            })

            //console.log(response.data)


            let movie = response.data;

            document.getElementById("seasonFocusContainer").style.display="none";
            document.getElementById("seasonAndEpisodeFocus").style.display="none";
            document.getElementById("episodesFocus").style.display="none"

            document.getElementById("focusTitle").innerHTML=movie.name;
            document.getElementById("focusYear").innerHTML=movie.year;
            document.getElementById("focusCategory").innerHTML=movie.category;


            document.getElementById("playButton").onclick=()=>{
                location.href=`./player?type=movie&name=${movie.name}&year=${movie.name}`
            }

            try {
                response = await axios.get(LINK + "api/movies/one/lastWatched", {
                    params: {
                        name: movie.name,
                        year: movie.year
                    }
                })
                document.getElementById("timestampFocus").innerHTML=response.data.timeStamp;

                document.getElementById("timestampFocus").style.display="block";

            }
            catch(err)
            {
                document.getElementById("timestampFocus").style.display="none";
            }

            // document.getElementById("focusBackground").onclick=()=>
            // {
            //     document.getElementById("focusBackground").style.display="none";
            // }

            document.getElementById("focusBackground").style.display="block";
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else if(type==="serie")
    {
        try
        {
            let response = await axios.get(LINK+"api/series/one",{
                params:{
                    serieName:name,
                    year:year
                }
            })

            console.log(response.data);

            let serie = response.data;

            if(serie.posterName!==null)
            {
                console.log(1);
                document.getElementById("focusPoster").src=(LINK+"api/files/?fileName="+serie.posterName);
            }
            else
            {
                document.getElementById("focusPoster").src="";
            }

            document.getElementById("seasonFocusContainer").style.display="flex";
            document.getElementById("episodesFocus").style.display="flex"

            document.getElementById("focusTitle").innerHTML=serie.name;
            document.getElementById("focusYear").innerHTML=(serie.year+" "+serie.noOfSeasons+((serie.noOfSeasons===1)?" season":" seasons"));
            document.getElementById("focusCategory").innerHTML=serie.category;

            if(findFirstEpisode(serie.seasons))
            {
                document.getElementById("playButton").style.display="none";
            }
            else
            {
                document.getElementById("playButton").style.display="inline-block";
            }

            let lastWatched=null;

            try {
                response = await axios.get(LINK + "api/series/one/lastWatched", {
                    params: {
                        name: serie.name,
                        year: serie.year
                    }
                })

                lastWatched={
                    seasonNumber:response.data.seasonNumber,
                    episodeNumber:response.data.episodeNumber,
                };


                document.getElementById("timestampFocus").innerHTML=response.data.timeStamp;

                document.getElementById("timestampFocus").style.display="block";

                document.getElementById("seasonAndEpisodeFocus").innerHTML="S"+response.data.seasonNumber+"E"+response.data.episodeNumber;

                document.getElementById("seasonAndEpisodeFocus").style.display="block";

                document.getElementById("playButton").onclick=()=>{
                    location.href=`./player?type=movie&name=${serie.name}&year=${serie.year}&seasonNumber=${lastWatched.seasonNumber}&episodeNumber=${lastWatched.episodeNumber}`;
                }
            }
            catch(err)
            {
                document.getElementById("seasonAndEpisodeFocus").style.display="none";
                document.getElementById("timestampFocus").style.display="none";

                document.getElementById("playButton").onclick=()=>{
                    location.href=`./player?type=movie&name=${serie.name}&year=${serie.year}&seasonNumber=${serie.seasons[findFirstEpisode(serie.seasons)].seasonNumber}&episodeNumber=${serie.seasons[findFirstEpisode(serie.seasons)].episodes[0].episodeNumber}`;
                }
            }

            let seasonsDiv = document.getElementById("seasonList");
            seasonsDiv.innerHTML="";

            for(let season of serie.seasons)
            {
                seasonsDiv.innerHTML+=`<p class = "seasonEntry" onclick="changeSeason('${serie.name}',${serie.year},${season.seasonNumber})">Season ${season.seasonNumber + ((season.name!==null)?(": "+season.name):"")}</p>`;
            }

            if(lastWatched===null)
            {
                changeSeason(serie.name,serie.year,1);
            }
            else
            {
                changeSeason(serie.name,serie.year,lastWatched.seasonNumber);
            }
            changeSeasonButtonValue=!changeSeasonButtonValue
            document.getElementById("focusBackground").style.display="block";
        }
        catch(err)
        {
            console.log(err);
        }
    }
}

document.addEventListener('click', function(event){
    let focusBack = document.getElementById("focusBackground");
    let focusDiv = focusBack.querySelector(".focus");

    if(focusBack.style.display==="block" && !focusDiv.contains(event.target))
    {
        focusBack.style.display="none";
    }
} )