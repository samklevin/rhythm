import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { generateSong } from "./songMaker";
import SongSynth from "./components/SongSynth";
import PlayerSynth from "./components/PlayerSynth";
import { sixteenthDuration } from "./musicUtils";
import SongSettings from "./components/SongSettings";
import SongDisplay from "./components/SongDisplay";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(null);
  const [hits, setHits] = useState([]);
  const [tempo, setTempo] = useState(56);
  const [songIndex, setSongIndex] = useState(0);
  const [viewingResults, setViewingResults] = useState(false);
  const [ghostMode, setGhostMode] = useState(true);
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
    setGhostMode(false);
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

  const playAgain = () => {
    window.location.reload();
    // setHits([]);
    // const newIndex = (songIndex + 1) % 2;
    // setSongIndex(newIndex);
    // songRef.current = generateSong(newIndex);
    // setViewingResults(false);
  };

  return (
    <div className="App bg-slate-900">
      <header className="App-header">
        <h1 className="text-6xl text-white">Rhythm Game</h1>
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
          <SongSettings
            ghostMode={ghostMode}
            setGhostMode={setGhostMode}
            tempo={tempo}
            setTempo={setTempo}
            songIndex={songIndex}
            setSongIndex={setSongIndex}
            songRef={songRef}
            isPlaying={isPlaying}
            startPlaying={startPlaying}
          />
        )}
        <SongDisplay
          ghostMode={ghostMode}
          songRef={songRef}
          isPlaying={isPlaying}
          hits={hits}
        />
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
