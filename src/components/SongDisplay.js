import React from "react";
import DisplayRow from "./DisplayRow";
import * as Tone from "tone";

const SongDisplay = ({ ghostMode, songRef, isPlaying, hits }) => {
  const obscureRow = (i) => {
    const thisRow = songRef.current.slice(i * 16, (i + 1) * 16);
    const activeNote = thisRow.find(
      (note) => note.time === Tone.Transport.position.split(".")[0]
    );
    if (activeNote) {
      return false;
    }
    return true;
  };

  return (
    <div className="p-8 bg-slate-900">
      {[...Array(Math.floor(songRef.current.length / 16))].map((_, i) => (
        <div
          key={`row-${i}`}
          className={`flex my-2 ${ghostMode && obscureRow(i) && "opacity-25"}`}
        >
          <DisplayRow
            songSlice={songRef.current.slice(i * 16, (i + 1) * 16)}
            isPlaying={isPlaying}
            hits={hits}
          />
        </div>
      ))}
    </div>
  );
};
export default SongDisplay;
