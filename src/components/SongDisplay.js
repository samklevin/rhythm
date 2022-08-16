import React from "react";
import DisplayRow from "./DisplayRow";

const SongDisplay = ({ songRef, position, isPlaying, hits }) =>
  [...Array(Math.floor(songRef.current.length / 16))].map((_, i) => (
    <div key={`row-${i}`} className="flex my-2">
      <DisplayRow
        songSlice={songRef.current.slice(i * 16, (i + 1) * 16)}
        position={position}
        isPlaying={isPlaying}
        hits={hits}
      />
    </div>
  ));

export default SongDisplay;
