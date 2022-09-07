import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { makeSong } from "./songMaker";
import SongSynth from "./components/SongSynth";
import PlayerSynth from "./components/PlayerSynth";
import { sixteenthDuration } from "./musicUtils";
import SongSettings from "./components/SongSettings";
import SongDisplay from "./components/SongDisplay";

const difficultyToTempo = {
  0: 56,
  1: 62,
  2: 68,
  3: 74,
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transportTime, setTransportTime] = useState(null);
  const [hits, setHits] = useState([]);
  const [difficulty, setDifficulty] = useState(0);
  const [resolution, setResolution] = useState(8);
  const [levelCount, setLevelCount] = useState(7);
  const [tone, setTone] = useState(0);
  const [viewingResults, setViewingResults] = useState(false);
  const [lockedAt, setLockedAt] = useState();
  const songRef = useRef(makeSong(resolution, difficulty));

  const startPlaying = async () => {
    setIsPlaying(true);
    await Tone.start();
    Tone.Transport.bpm.value = difficultyToTempo[difficulty];
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

    if (
      currentSeconds - lockedAtSeconds >
      sixteenthDuration(difficultyToTempo[difficulty])
    ) {
      setLockedAt(null);
    }
  }, [transportTime]);

  const playAgain = () => {
    window.location.reload();
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
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            resolution={resolution}
            setResolution={setResolution}
            levelCount={levelCount}
            setLevelCount={setLevelCount}
            tone={tone}
            setTone={setTone}
            isPlaying={isPlaying}
            startPlaying={startPlaying}
            songRef={songRef}
          />
        )}
        <SongDisplay
          songRef={songRef}
          isPlaying={isPlaying}
          hits={hits}
          resolution={resolution}
        />
      </header>
      <SongSynth
        endSong={endSong}
        setTransportTime={setTransportTime}
        resolution={resolution}
        difficulty={difficulty}
        songRef={songRef}
        levelCount={levelCount}
      />
      {isPlaying && (
        <PlayerSynth
          lockedAt={lockedAt}
          setLockedAt={setLockedAt}
          setHits={setHits}
          songRef={songRef}
          tone={tone}
        />
      )}
    </div>
  );
}

export default App;
