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
  const [transportTime, setTransportTime] = useState(null);
  const [hits, setHits] = useState([]);
  const [tempo, setTempo] = useState(56);
  const [resolution, setResolution] = useState(8);
  const [viewingResults, setViewingResults] = useState(false);
  const [lockedAt, setLockedAt] = useState();
  const songRef = useRef(generateSong(resolution));

  const startPlaying = async () => {
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
            tempo={tempo}
            setTempo={setTempo}
            resolution={resolution}
            setResolution={setResolution}
            songRef={songRef}
            isPlaying={isPlaying}
            startPlaying={startPlaying}
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
