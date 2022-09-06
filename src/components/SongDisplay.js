import React from "react";
import DisplayRow from "./DisplayRow";

const SongDisplay = ({ songRef, isPlaying, hits, resolution }) => (
  <div className="p-8 bg-slate-900">
    {[...Array(Math.floor(songRef.current.length / resolution))].map((_, i) => (
      <div key={`row-${i}`} className="flex my-2">
        <DisplayRow
          songSlice={songRef.current.slice(
            i * resolution,
            (i + 1) * resolution
          )}
          isPlaying={isPlaying}
          hits={hits}
          resolution={resolution}
        />
      </div>
    ))}
  </div>
);

export default SongDisplay;
