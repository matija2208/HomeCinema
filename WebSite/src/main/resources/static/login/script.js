
async function checkLoginStatus()
{
    try {
        let response = await axios.get(LINK + "auth/check");
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

async function login()
{
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    let messageElement = document.getElementById("message");
    messageElement.innerText = ""; // Clear previous messages
    if (username === "" || password === "")
    {
        messageElement.innerText = "Please fill in both fields.";
        messageElement.style.display = "block";
        return;
    }

    try {
        let response = await axios.post(LINK + "/auth/login", {
            name: username,
            password: password
        });
        console.log("Login successful:", response.data);
        messageElement.style.display = "none"; // Hide message on success
        location.href = LINK;
        return true;
    }
    catch (error)
    {
        if (error.status === 401) {
            messageElement.innerText = error.response.data;
            messageElement.style.display = "block";
        }
        else if (error.status === 500 && error.response.data === "Incorrect result size: expected 1, actual 0") {
            messageElement.innerText = "Invalid username";
            messageElement.style.display = "block";
        }
        else
        {
            messageElement.innerText = "An unexpected error occurred. Please try again later.";
            messageElement.style.display = "block";
            console.error("Login error:", error);
        }
        return false;
    }
}