// import dependencies
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// APIs
const inspireAPI_URL = "https://zenquotes.io/api/random";
const programmerAPI_URL = "https://programming-quotesapi.vercel.app/api/random";
const memeAPI_URL = "https://icanhazdadjoke.com";

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
// express middleware to serve static file
app.use(express.static("public"));

// get default quote once the user enter the website
app.get("/", async (req, res) => {
    try {
        const result = await axios.get(inspireAPI_URL);
        const data = {
            type: "inspiration",
            quote: result.data[0].q,
            author: result.data[0].a,
        };
        console.log(data);
        res.render("index.ejs", { data: data });
    } catch (error) {
        console.log("Failed to make request: ", error.message);
        res.render("index.ejs", {error: error.message});
    }
});

// post quote depends on the user's choice
app.post("/", async (req, res) => {
    const choice = req.body.type;   // quote choice that user picked
    let data;
    let result = "";
    console.log(choice);
    try {
        switch (choice) {   // switch to get proper API
            case "inspiration":
                result = await axios.get(inspireAPI_URL);
                data = {
                    type: choice,
                    quote: result.data[0].q,
                    author: result.data[0].a,
                };
                res.render("index.ejs", { data: data });
                break;
            case "programmer":
                result = await axios.get(programmerAPI_URL);
                data = {
                    type: choice,
                    quote: result.data.quote,
                    author: result.data.author,
                };
                res.render("index.ejs", { data: data });
                break;
            case "joke":
                result = await axios.get(memeAPI_URL, {
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                data = {
                    type: choice,
                    quote: result.data.joke,
                    author: "Someone...",
                };
                res.render("index.ejs", { data: data });
                break;
            default:
                res.render("index.ejs", {error: "Invalid choice. Please try again."})
        }
        console.log(data);
    } catch (error) {   // error handling
        console.log("Failed to make request: ", error.message);
        res.render("index.ejs", {error: error.message});
    }
    
});

// server run local on port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});