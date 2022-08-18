import React from "react";
import * as Tone from "tone";

const colorCycle = [
  "bg-red-600",
  "bg-blue-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

const DisplayRow = ({ songSlice, isPlaying, hits }) =>
  songSlice.map((note, index) => {
    if (note.play) {
      return (
        <div
          key={`note-${note.position}`}
          className={`mx-2 w-12 h-8 rounded ease-in ${colorCycle[index % 4]} ${
            note.time === Tone.Transport.position.split(".")[0] &&
            isPlaying &&
            "scale-150"
          }`}
        />
      );
    } else if (hits.includes(note.time)) {
      return (
        <div
          key={`note-${note.position}`}
          className="mx-2 w-12 h-8 rounded ease-in bg-white animate-pulse"
        />
      );
    } else {
      return (
        <div
          key={`note-${note.position}`}
          className={`mx-2 w-12 h-8 rounded ease-in `}
        />
      );
    }
  });

export default DisplayRow;
