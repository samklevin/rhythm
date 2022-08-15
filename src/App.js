import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { generateSong } from "./songMaker";
import SongSynth from "./components/SongSynth";
import PlayerSynth from "./components/PlayerSynth";
import { sixteenthDuration } from "./musicUtils";

const colorCycle = [
  "bg-red-600",
  "bg-blue-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

const songRow = (songSlice, position, isPlaying, hits) =>
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

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(null);
  const [hits, setHits] = useState([]);
  const [tempo, setTempo] = useState(68);
  const [songIndex, setSongIndex] = useState(0);
  const [viewingResults, setViewingResults] = useState(false);
  const [lockedAt, setLockedAt] = useState();
  const songRef = useRef(generateSong(songIndex));

  const startPlaying = async () => {
    setPosition(0);
    setIsPlaying(true);
    await Tone.start();
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.start();
  };

  const endSong = () => {
    setIsPlaying(false);
    setLockedAt(null);
    Tone.Transport.stop();
    setViewingResults(true);
  };

  useEffect(() => {
    if (!lockedAt) {
      return;
    }
    const currentSeconds = Tone.Transport.getSecondsAtTime(
      Tone.Transport.currentTime
    );
    const lockedAtSeconds = Tone.Transport.getSecondsAtTime(lockedAt);

    if (currentSeconds - lockedAtSeconds > sixteenthDuration(tempo)) {
      setLockedAt(null);
    }
  }, [position]);

  const updateTempo = (tempo) => () => setTempo(tempo);

  const updateSongIndex = (index) => () => {
    setSongIndex(index);
    songRef.current = generateSong(index);
  };

  const playAgain = () => {
    setHits([]);
    const newIndex = (songIndex + 1) % 2;
    setSongIndex(newIndex);
    songRef.current = generateSong(newIndex);
    setViewingResults(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rhythm Game</h1>
        {viewingResults ? (
          <div className="my-10 flex w-full justify-center">
            <button
              className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed"
              onClick={playAgain}
              disabled={isPlaying}
            >
              Play again?
            </button>
          </div>
        ) : (
          <div className="my-10 flex w-full">
            <div className="w-1/3 flex justify-center">
              <button
                className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed"
                onClick={startPlaying}
                disabled={isPlaying}
              >
                Play
              </button>
            </div>
            <div className="w-1/3 flex justify-center space-x-2">
              <button
                onClick={updateTempo(56)}
                className={`${
                  tempo === 56
                    ? "bg-blue-900 text-white"
                    : "bg-blue-300 text-gray-800"
                } text-2xl p-4 `}
              >
                slow
              </button>
              <button
                onClick={updateTempo(68)}
                className={`${
                  tempo === 68
                    ? "bg-blue-900 text-white"
                    : "bg-blue-300 text-gray-800"
                } text-2xl p-4 `}
              >
                medium
              </button>
              <button
                onClick={updateTempo(80)}
                className={`${
                  tempo === 80
                    ? "bg-blue-900 text-white"
                    : "bg-blue-300 text-gray-800"
                } text-2xl p-4 `}
              >
                fast
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
        )}
        {[...Array(Math.floor(songRef.current.length / 16))].map((_, i) => (
          <div key={`row-${i}`} className="flex my-2">
            {songRow(
              songRef.current.slice(i * 16, (i + 1) * 16),
              position,
              isPlaying,
              hits
            )}
          </div>
        ))}
      </header>
      <SongSynth
        endSong={endSong}
        setPosition={setPosition}
        songIndex={songIndex}
        songRef={songRef}
      />
      {isPlaying && (
        <PlayerSynth
          lockedAt={lockedAt}
          setLockedAt={setLockedAt}
          setHits={setHits}
          songRef={songRef}
        />
      )}
    </div>
  );
}

export default App;
