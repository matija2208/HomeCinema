const LINK = "https://localhost/";
function loadNav() {
    document.body.innerHTML = `
    <nav>
        <ul style="width: 100vw;display: flex; list-style-type: none; padding: 0; margin: 0; position: fixed; top:0; left:0; background-color: #1138; z-index: 1000; border-bottom: 2px solid #08c;">
            <li style="margin: 1vw;"><a href="?content=lastWatched" style="color: #08c; text-decoration: none; font-family: 'Consolas', monospace; font-size: 1em;">Home</a></li>
            <li style="margin: 1vw;"><a href="?content=movies" style="color: #08c; text-decoration: none; font-family: 'Consolas', monospace; font-size: 1em;">Movies</a></li>
            <li style="margin: 1vw;"><a href="?content=series" style="color: #08c; text-decoration: none; font-family: 'Consolas', monospace; font-size: 1em;">Series</a></li>
            <div style="float:right;width: 100%; display: flex; justify-content: flex-end;">
                <li style="margin: 1vw;"><a href="search/" style="color: #08c; text-decoration: none; float: right;"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" style="fill:#08c"><path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z"/></svg></a></li>
                <li style="margin: 1vw;"><a href="settings/" style="color: #08c; text-decoration: none; float: right;"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" style="fill:#08c"><path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/></svg></a></li>    
            </div>
        </ul>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #446;
                font-family: 'Consolas', monospace;
                margin-top: calc(2em + 2vw);
                color: #08c;
            }
            @media(min-width: 1000px) and (max-width: 1800px) {
                body {
                    font-size: 1.5em;
                }
            }
            @media(min-width: 1800px) and (max-width: 2200px) {
                body {
                    font-size: 2em;
                }
            }
            @media(min-width: 2200px) {
                body {
                    font-size: 3em;
                }
            }
        </style>
    </nav>`+ document.body.innerHTML;
}

function addBase()
{
    document.head.innerHTML += `<base href=${LINK}>`;
}

loadNav();
addBase();