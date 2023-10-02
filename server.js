const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Serve static assets
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  // Read notes from db.json and send them as a response
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  console.log(notes)
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  // Create a new note, save it to db.json, and send it as a response
  const id = uuidv4();
  const { title, text } = req.body;
  const newNote = {
    id,
    title,
    text,
  };
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  // Get the ID of the note to delete from the URL parameters
  const noteIdToDelete = req.params.id;

  // Read the existing notes from db.json
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));

  // Find the index of the note with the specified ID
  const noteIndexToDelete = notes.findIndex((note) => note.id === noteIdToDelete);

  if (noteIndexToDelete !== -1) {
    // If the note exists, remove it from the notes array
    notes.splice(noteIndexToDelete, 1);

    // Write the updated notes array back to db.json
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));

    // Send a success response
    res.json({ message: 'Note deleted successfully' });
  } else {
    // If the note with the specified ID is not found, send a not found response
    res.status(404).json({ error: 'Note not found' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
