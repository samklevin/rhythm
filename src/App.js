import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { makeSong } from "./songMaker";
import SongSynth from "./components/SongSynth";
import PlayerSynth from "./components/PlayerSynth";
import { sixteenthDuration } from "./musicUtils";
import SongSettings from "./components/SongSettings";
import SongDisplay from "./components/SongDisplay";
import queryString from "query-string";

const difficultyToTempo = {
  0: 50,
  1: 54,
  2: 58,
  3: 62,
};

function App() {
  const urlParams = queryString.parse(window.location.search);
  let level = urlParams.level || 0;

  level = Math.min(Number(level), 7);
  const resolutionFromURL = (Math.floor(level / 4) + 1) * 8;
  const difficultyFromURL = level % 4;

  const [isPlaying, setIsPlaying] = useState(false);
  const [transportTime, setTransportTime] = useState(null);
  const [hits, setHits] = useState([]);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(Number(difficultyFromURL));
  const [resolution, setResolution] = useState(resolutionFromURL);
  const [levelCount, setLevelCount] = useState(7);
  const [tone, setTone] = useState(1);
  const [viewingResults, setViewingResults] = useState(false);
  const [lockedAt, setLockedAt] = useState();
  const songRef = useRef(makeSong({ difficulty, resolution }));

  const startPlaying = async () => {
    setIsPlaying(true);
    await Tone.start();
    Tone.Transport.bpm.value = difficultyToTempo[difficulty] + resolution / 4;
    Tone.Transport.start();
  };

  const endSong = () => {
    setIsPlaying(false);
    setLockedAt(null);
    Tone.Transport.stop();
    setViewingResults(true);
  };

  const getScore = () => {
    const restCount = songRef.current.filter((n) => !n.play);
    const newScore = hits.length / restCount.length;
    setScore(newScore);
  };

  const redirectToNextLevel = () => {
    const currentLevel = urlParams.level || 0;
    const nextLevel = Number(currentLevel) + 1;
    window.location =
      window.location.href.split("?")[0] + `?level=${nextLevel}`;
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

  useEffect(() => {
    getScore();
  }, [viewingResults]);

  const playAgain = () => {
    window.location.reload();
  };

  return (
    <div className="App bg-slate-900">
      <header className="App-header">
        <h1 className="text-6xl text-white">Rhythm Game</h1>
        {viewingResults ? (
          <div className="my-10 flex w-full justify-center space-x-10">
            <button
              className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed"
              onClick={playAgain}
              disabled={isPlaying}
            >
              Play again?
            </button>
            {score > 0.8 && (
              <button
                onClick={redirectToNextLevel}
                className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed"
              >
                Next Level
              </button>
            )}
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
