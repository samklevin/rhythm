import React from "react";
import { generateSong } from "../songMaker";

const SongSettings = ({
  isPlaying,
  difficulty,
  setDifficulty,
  resolution,
  setResolution,
  startPlaying,
  songRef,
}) => {
  const updateDifficulty = (difficulty) => () => {
    setDifficulty(difficulty);
    songRef.current = generateSong(resolution, difficulty);
  };

  const updateResolution = (resolution) => () => {
    setResolution(resolution);
    songRef.current = generateSong(resolution, difficulty);
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
          onClick={updateDifficulty(0)}
          className={`${
            difficulty === 0
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          easy
        </button>
        <button
          onClick={updateDifficulty(1)}
          className={`${
            difficulty === 1
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          medium
        </button>
        <button
          onClick={updateDifficulty(2)}
          className={`${
            difficulty === 2
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          hard
        </button>
        <button
          onClick={updateDifficulty(3)}
          className={`${
            difficulty === 3
              ? "bg-blue-900 text-white"
              : "bg-blue-200 text-gray-500"
          } text-2xl p-4 `}
        >
          really hard
        </button>
      </div>
      <div className="w-1/3 flex justify-center space-x-2">
        <button
          onClick={updateResolution(8)}
          className={`${
            resolution === 8
              ? "bg-amber-800 text-white"
              : "bg-amber-200 text-gray-800"
          } text-2xl p-4`}
        >
          easy
        </button>
        <button
          onClick={updateResolution(16)}
          className={`${
            resolution === 16
              ? "bg-amber-800 text-white"
              : "bg-amber-200 text-gray-800"
          } text-2xl p-4`}
        >
          hard
        </button>
      </div>
    </div>
  );
};

export default SongSettings;
