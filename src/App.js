import './App.css';
import { Song, Track, Instrument } from 'reactronica'
import React, {useState} from "react";

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(null)

  const duration = .2

  const notes = [
    'C2', 'E2', 'G2', 'C3',
    'D2', 'F2', 'A2', 'D3',
    'F2', 'G2', 'B2', 'F3',
    'G2', 'B2', 'C3', 'E3'
  ]

  const colorCycle = [
      'bg-red-600',
      'bg-blue-600',
      'bg-fuchsia-600',
      'bg-lime-600'
  ]

  const startPlaying = () => {
    setPosition(0)
    setIsPlaying(true)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Będzie Synth Game</h1>
        <div className="my-10">
          <button className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0" onClick={startPlaying}>Play</button>
        </div>
        <div className="flex">
          { notes.map((note, index) => (
              <div className={`mx-2 w-12 h-8 rounded ease-in ${ colorCycle[index % 4]} ${ position - 1 === index && isPlaying && 'scale-150' }`} />
          ))}
        </div>
        <Song isPlaying={isPlaying} bpm={240} volume={0} isMuted={false}>
          <Track
              steps={notes.map((n, i, a) => ({ name: n, duration: duration, velocity: 1}))}
              onStepPlay={(step) => {
                setPosition((lastPosition) => {
                  const newPosition = lastPosition + 1
                  if(newPosition >= notes.length){
                    setTimeout(() => setIsPlaying(false), duration * 1000)
                    return newPosition
                  } else {
                    return newPosition
                  }
                })
              }}
          >
            <Instrument type='synth'/>
          </Track>
        </Song>
      </header>
    </div>
  );
}


export default App;
