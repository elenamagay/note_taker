const fs = require("fs");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        res.json(notes);      
    });    
});
app.get("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        res.json(notes[req.params.id]);      
    });
})

app.post("/api/notes", (req, res) => {
    let { title, text } = req.body;
    let  newNote = { title, text, id: uuidv4() };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        let note = JSON.parse(data);
        note.push(newNote);
        note = JSON.stringify(newNote);
        fs.writeFile("./db/db.json", note);
        return res.json(newNote);
    });

})

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
});