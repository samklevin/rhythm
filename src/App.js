import './App.css';
import { Song, Track, Instrument } from 'reactronica'
import React, {useRef, useState} from "react";
import _ from "lodash";
import {exampleSong} from "./songs";

const makeLevel = (notes, numberOfHoles) => {
  const thisLevel = [...notes]
  const holes = []
  while(holes.length < numberOfHoles){
    const randomHole = _.random(1, notes.length - 1)
    if(!holes.includes(randomHole) && !holes.includes(randomHole - 1) && !holes.includes(randomHole + 1)){
      holes.push(randomHole)
      thisLevel[randomHole] = null
    }
  }

  return thisLevel
}

const colorCycle = [
  'bg-red-600',
  'bg-blue-600',
  'bg-fuchsia-600',
  'bg-lime-600'
]

const generateSong = () => {
  const notes = exampleSong;
  const firstLevel = makeLevel(notes, 1)
  const secondLevel = makeLevel(notes, 3)
  const thirdLevel = makeLevel(notes, 6)

  const fullSong = [...notes, ...firstLevel, ...secondLevel, ...thirdLevel]

  return fullSong.map((n, i) => ({name: n, position: i}))
}

const songRow = (songSlice, position, isPlaying) => (
    songSlice.map((note, index) => {
      if(note.name){
        return(
            <div
                className={`mx-2 w-12 h-8 rounded ease-in ${colorCycle[index % 4]} ${position - 1 === note.position && isPlaying && 'scale-150'}`}/>
        )
      } else {
        return(
            <div className={`mx-2 w-12 h-8 rounded ease-in `} />
        )
      }
    })
)

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(null)
  const songRef = useRef(generateSong())

  const duration = .2

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
        <div className="flex my-2">
          { songRow(songRef.current.slice(0, 16), position, isPlaying)}
        </div>
        <div className="flex my-2">
          { songRow(songRef.current.slice(16, 32), position, isPlaying)}
        </div>
        <div className="flex my-2">
          { songRow(songRef.current.slice(32, 48), position, isPlaying)}
        </div>
        <div className="flex my-2">
          { songRow(songRef.current.slice(48, 64), position, isPlaying)}
        </div>
        <Song isPlaying={isPlaying} bpm={240} volume={0} isMuted={false}>
          <Track
              steps={songRef.current.map((n, i, a) => ({ ...n, duration: duration, velocity: 1}))}
              onStepPlay={(step) => {
                setPosition((lastPosition) => {
                  const newPosition = lastPosition + 1
                  if(newPosition >= songRef.current.length){
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
