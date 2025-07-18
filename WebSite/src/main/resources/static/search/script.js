async function search(searchParam)
{
    if (searchParam.length > 3)
    {
        try
        {
            searchParam=searchParam.split(' ').join('%25');

            let response = await axios.get(LINK+"api/search?searchParam="+searchParam);

            let results=response.data;

            let cardContainer =
                document.getElementById("cardContainer");

            cardContainer.innerHTML='';

            for(let result of results)
            {
                console.log(result);
                let card = document.createElement('div');
                card.className="card";

                if(result.type === 'movie')
                {
                    try{

                        let response = await axios.get(LINK+"api/movies/one",{
                            params:{
                                name:result.name,
                                year:result.year
                            }
                        })

                        let movie=response.data;

                        card.innerHTML =
                            `
                            <img src="${LINK+"api/files/?fileName="+movie.posterName}" alt="Poster banner">
                                <div class="card-content">
                                    <p class="title">${movie.name}</p>
                                    <div class = "serie-info">
                                        <p class = "extra">${movie.year}</p>
                                       ` + (movie.category!==null ? `<p class = "extra">${movie.category}</p></div>` : "</div>");
                        card.onclick=()=>
                        {
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
                        cardContainer.appendChild(card);
                    }
                    catch(err)
                    {
                        console.log(err);
                    }
                }
                else if(result.type==='serie')
                {
                    try
                    {
                        let response = await axios.get(LINK+"api/series/one",{
                            params:{
                                serieName:result.name,
                                year:result.year
                            }
                        })

                        let serie = response.data;

                        let card = document.createElement("div");
                        card.className = "card";
                        card.innerHTML =
                                `
                            <img src="${LINK+"api/files/?fileName="+serie.posterName}" alt="Poster banner">
                            <div class="card-content">
                                <p class="title">${serie.name}</p>
                                <div class = "serie-info">
                                    <p class = "extra">${serie.year +" "+serie.noOfSeasons}</p>
                                     
                                    ` + (serie.category!==null ? `<p class = "extra">${serie.category}</p></div></div>` : "</div></div>");

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
                        cardContainer.appendChild(card);
                    }
                    catch(err)
                    {
                        console.log(err);
                    }
                }
            }



            console.log(response);
        }
        catch (err)
        {
            console.log(err);
        }
    }

}

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

    if(year===0 || name===null || type===null)
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
        const Url = new URL(window.location.href);
        Url.searchParams.delete("name");
        Url.searchParams.delete("year");
        Url.searchParams.delete("type");
        window.history.pushState({}, '', Url);
    }
} )

loadFocus();
search(document.getElementById("searchBox").value)