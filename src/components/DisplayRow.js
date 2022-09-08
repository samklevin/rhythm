import React from "react";
import * as Tone from "tone";

const colorCycle = [
  "bg-red-600",
  "bg-blue-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

const widthFromResolution = {
  8: "w-20",
  16: "w-12",
};

const DisplayRow = ({ songSlice, isPlaying, hits, resolution }) =>
  songSlice.map((note, index) => {
    if (note.play) {
      return (
        <div
          data-test-id={`cell-${index}`}
          key={`note-${note.position}`}
          className={`mx-2 h-8 rounded ease-in ${
            widthFromResolution[resolution]
          } ${colorCycle[index % 4]} ${
            note.time === Tone.Transport.position.split(".")[0] &&
            isPlaying &&
            "scale-150"
          }`}
        />
      );
    } else if (hits.includes(note.time)) {
      return (
        <div
          data-test-id={`cell-${index}`}
          key={`note-${note.position}`}
          className={`mx-2 h-8 rounded ease-in bg-white animate-pulse ${widthFromResolution[resolution]}`}
        />
      );
    } else {
      return (
        <div
          data-test-id={`cell-${index}`}
          key={`note-${note.position}`}
          className={`mx-2 h-8 rounded ease-in ${widthFromResolution[resolution]}`}
        />
      );
    }
  });

export default DisplayRow;
