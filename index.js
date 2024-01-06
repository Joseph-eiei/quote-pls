import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const inspireAPI_URL = "https://zenquotes.io/api/random";
const programmerAPI_URL = "https://programming-quotesapi.vercel.app/api/random";
const memeAPI_URL = "https://icanhazdadjoke.com";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

app.post("/", async (req, res) => {
    const choice = req.body.type;
    let data;
    let result = "";
    console.log(choice);
    try {
        switch (choice) {
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
    } catch (error) {
        console.log("Failed to make request: ", error.message);
        res.render("index.ejs", {error: error.message});
    }
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});