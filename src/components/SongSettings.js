import React from "react";
import { makeSong } from "../songMaker";

const SongSettings = ({
  isPlaying,
  difficulty,
  setDifficulty,
  resolution,
  setResolution,
  levelCount,
  setLevelCount,
  tone,
  setTone,
  startPlaying,
  songRef,
}) => {
  const updateDifficulty = (difficulty) => () => {
    setDifficulty(difficulty);
    songRef.current = makeSong(resolution, difficulty, levelCount);
  };

  const updateResolution = (resolution) => () => {
    setResolution(resolution);
    songRef.current = makeSong(resolution, difficulty, levelCount);
  };

  const updateLevelCount = (levelCount) => () => {
    setLevelCount(levelCount);
    songRef.current = makeSong(resolution, difficulty, levelCount);
  };

  return (
    <div className="my-10 flex w-full">
      <div className="w-1/4 flex justify-center">
        {!isPlaying && (
          <button
            className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed"
            onClick={startPlaying}
          >
            Play
          </button>
        )}
      </div>
      <div className="w-1/4 flex justify-center space-x-2">
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
      <div className="w-1/4 flex justify-center space-x-2">
        <button
          onClick={updateResolution(8)}
          className={`${
            resolution === 8
              ? "bg-amber-800 text-white"
              : "bg-amber-200 text-gray-800"
          } text-2xl p-4`}
        >
          lil
        </button>
        <button
          onClick={updateResolution(16)}
          className={`${
            resolution === 16
              ? "bg-amber-800 text-white"
              : "bg-amber-200 text-gray-800"
          } text-2xl p-4`}
        >
          big
        </button>
      </div>

      <div className="w-1/4">
        <div className="flex justify-center items-center my-2">
          <div
            onClick={updateLevelCount(5)}
            className={`px-2 h-10 mx-1 cursor-pointer ${
              levelCount === 5
                ? "bg-green-800 text-white"
                : "bg-green-100 text-green-800"
            }`}
          >
            5
          </div>
          <div
            onClick={updateLevelCount(7)}
            className={`px-2 h-10 mx-1 cursor-pointer ${
              levelCount === 7
                ? "bg-green-800 text-white"
                : "bg-green-100 text-green-800"
            }`}
          >
            7
          </div>
          <div
            onClick={updateLevelCount(9)}
            className={`px-2 h-10 mx-1 cursor-pointer ${
              levelCount === 9
                ? "bg-green-800 text-white"
                : "bg-green-100 text-green-800"
            }`}
          >
            9
          </div>
        </div>
        <div className="flex justify-center my-2">
          <div
            onClick={() => setTone(0)}
            className={`px-2 mx-1 h-10 cursor-pointer ${
              tone === 0
                ? "bg-fuchsia-800 text-white"
                : "bg-fuchsia-100 text-fuchsia-800"
            }`}
          >
            bell
          </div>
          <div
            onClick={() => setTone(1)}
            className={`px-2 mx-1 h-10 cursor-pointer ${
              tone === 1
                ? "bg-fuchsia-800 text-white"
                : "bg-fuchsia-100 text-fuchsia-800"
            }`}
          >
            no bell
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongSettings;
