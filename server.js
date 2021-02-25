const fs = require("fs");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        return res.json(notes);      
    });    
});
app.get("/api/notes/:id", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        return res.json(notes[req.params.id]);      
    });
});

app.post("/api/notes", (req, res) => {
    let { title, text } = req.body;
    let  newNote = { title, text, id: uuidv4() };

    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        let note = JSON.parse(data);
        note.push(newNote);
        note = JSON.stringify(newNote);
        fs.writeFile(path.join(__dirname, "./db/db.json"), note, err => {
            if (err) throw err;
        });
        return res.json(newNote);
    });
});

app.delete("/api/notes/:id", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        let allNotes = JSON.parse(data);
        let noteDel = allNotes.filter(dNote => dNote.id === req.params.id);
        allNotes.splice(noteDel, 1);

        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes), err => {
            if (err) throw err;
        });
        return res.json({});
    });
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
});