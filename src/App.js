// This app is an already made markdown notes app, to practise working on something more "real-life", understanding someone else's code, fixing bugs, adding new functionalities etc.
// The comments added are my notes helping me to understand how the app works

import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
// import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";
import "./style.css";

export default function App() {
  // We use a callback function so that the .getItem() method is only executed on the first render of the app
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("localNotes")) || []
  );

  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  // We use useEffect() to timely update the localStorage, because of asynchronicity
  React.useEffect(() => {
    localStorage.setItem("localNotes", JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  // We put the recently edited note to the top of the list
  function updateNote(text) {
    setNotes(oldNotes => {
      let newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        if (oldNotes[i].id === currentNoteId) {
          newArray.unshift({ ...oldNotes[i], body: text });
        } else newArray.push(oldNotes[i]);
      }
      return newArray;
    });
  }

  // To delete the note we take the oldNotes array and filter out the one note that we want to delete by checking if its id matches the id passed by the onClick event in the Sidebar which calls the function
  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId));
  }

  function findCurrentNote() {
    return (
      notes.find(note => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
