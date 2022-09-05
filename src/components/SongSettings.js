import React from "react";
import { generateSong } from "../songMaker";

const SongSettings = ({
  isPlaying,
  tempo,
  setTempo,
  songIndex,
  setSongIndex,
  songRef,
  startPlaying,
}) => {
  const updateTempo = (tempo) => () => setTempo(tempo);

  const updateSongIndex = (index) => () => {
    setSongIndex(index);
    songRef.current = generateSong(index);
  };

  return (
    <div className="my-10 flex w-full">
      <div className="w-1/3 flex justify-center">
        {!isPlaying && (
          <button
            className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed"
            onClick={startPlaying}
          >
            Play
          </button>
        )}
      </div>
      <div className="w-1/3 flex justify-center space-x-2">
        <button
          onClick={updateTempo(56)}
          className={`${
            tempo === 56
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          normal
        </button>
        <button
          onClick={updateTempo(68)}
          className={`${
            tempo === 68
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          fast
        </button>
        <button
          onClick={updateTempo(80)}
          className={`${
            tempo === 80
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          mega
        </button>
      </div>
      <div className="w-1/3 flex justify-center space-x-2">
        <button
          onClick={updateSongIndex(0)}
          className={`${
            songIndex === 0
              ? "bg-amber-800 text-white"
              : "bg-amber-200 text-gray-800"
          } text-2xl p-4`}
        >
          sol
        </button>
        <button
          onClick={updateSongIndex(1)}
          className={`${
            songIndex === 1
              ? "bg-amber-800 text-white"
              : "bg-amber-200 text-gray-800"
          } text-2xl p-4`}
        >
          lun
        </button>
      </div>
    </div>
  );
};

export default SongSettings;
