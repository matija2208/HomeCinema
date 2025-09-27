
async function checkLoginStatus()
{
    try {
        let response = await axios.get(LINK + "/auth/check");
        location.href = LINK; // Redirect to the main page if already logged in
        return true;
    } catch (error) {
        console.log("Error checking login status:", error);
        return false;
    }
}
checkLoginStatus();
const params = new URLSearchParams(window.location.search);

if (params.has("username") && params.has("password"))
{
    console.log("URL parameters:", params.toString());
    document.getElementById("username").value = params.get("username");
    document.getElementById("password").value = params.get("password");
}

function login()
{

    let messageElement = document.getElementById("message");
    messageElement.innerText = ""; // Clear previous messages
    if(params.has("error"))
    {
        let error = params.get("error");
        if (error==="Invalid username" || error==="Invalid password") {
            messageElement.innerText = error;
            messageElement.style.display = "block";
        }
        else if (error === "Incorrect result size: expected 1, actual 0") {
            messageElement.innerText = "Invalid username";
            messageElement.style.display = "block";
        }
        else
        {
            messageElement.innerText = "An unexpected error occurred. Please try again later.";
            messageElement.style.display = "block";
            console.error("Login error:", error);
        }
    }
}

document.getElementById("loginForm").action = `${LINK}/auth/login`

login();