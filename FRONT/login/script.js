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
    }
}