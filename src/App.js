import './App.css';
import {Song, Track, Instrument, Effect} from 'reactronica'
import React, {useEffect, useRef, useState} from "react";
import _ from "lodash";
import {exampleSong} from "./songs";
import {SongPlayer} from "./SongPlayer";

const makeLevel = (notes, numberOfHoles) => {
  const thisLevel = [...notes]
  const holes = []
  let iterations = 0
  while(holes.length < numberOfHoles){
    const randomHole = _.random(1, notes.length - 1)
    if(!holes.includes(randomHole)){
      if(holes.includes(randomHole - 1)){
        if(holes.includes(randomHole - 2)){ continue }
        if(holes.includes(randomHole + 1)){ continue }
      } else if(holes.includes(randomHole + 1)){
        if(holes.includes(randomHole + 2)){ continue }
      }
      holes.push(randomHole)
      thisLevel[randomHole] = null
    }
    iterations++
    if(iterations > notes.length * 2){ break }
  }

  return thisLevel
}

const colorCycle = [
  'bg-red-600',
  'bg-blue-600',
  'bg-fuchsia-600',
  'bg-lime-600'
]

const invertLevel = (notes, startingLevel) => {
  const invertedLevel = [...notes]
  startingLevel.forEach((e, i, a) => {
    if(!e){
      invertedLevel[a.length - (1 + i)] = null
    }
  })
  return invertedLevel
}

const generateSong = () => {
  const notes = exampleSong;
  const shuffledNotes = _.shuffle([...notes])

  const firstLevel = makeLevel(_.reverse([...notes]), 3)
  const secondLevel = makeLevel(notes, 3)
  const thirdLevel = makeLevel(shuffledNotes, 5)
  const fourthLevel = makeLevel(notes, 6)
  const fifthLevel = invertLevel(_.reverse([...notes]), fourthLevel)
  const sixthLevel = makeLevel(notes, 9)
  const seventhLevel = invertLevel(shuffledNotes, sixthLevel)

  const fullSong = [
      ...notes,
      ...firstLevel,
      ...secondLevel,
      ...thirdLevel,
      ...fourthLevel,
      ...fifthLevel,
      ...sixthLevel,
      ...seventhLevel
  ]

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
  const [userNotes, setUserNotes] = useState([])
  const songRef = useRef(generateSong())

  const duration = .12

  const startPlaying = () => {
    setPosition(0)
    setIsPlaying(true)
  }

  const updatePosition = () => {
    setPosition((lastPosition) => {
      const newPosition = lastPosition + 1
      if(newPosition >= songRef.current.length){
        setTimeout(() => setIsPlaying(false), duration * 1000)
        return newPosition
      } else {
        return newPosition
      }
    })
  }

  useEffect(() => {

    document.addEventListener('keydown', userKeyDown);
    document.addEventListener('keyup', userKeyUp);

    return () => {
      document.removeEventListener('keydown', userKeyDown);
      document.removeEventListener('keyup', userKeyUp);
    }
  })

  const userKeyDown = (event) => {
    if(event.keyCode === 74 && isPlaying){
      const currentNote = exampleSong[position % 16]
      setUserNotes([{name: currentNote, duration, velocity: 1}])
    }
    if(event.keyCode === 75){
      setUserNotes([{name: 'D4'}])
    }
  }

  const userKeyUp = () => {
    setUserNotes([])
  }

  return (
    <div className="App">
      <header className="App-header">
      <h1>Rhythm Game</h1>
        <div className="my-10">
          <button className="bg-fuchsia-700 text-white text-2xl p-4 translate-y-0 disabled:bg-fuchsia-200 disabled:cursor-not-allowed" onClick={startPlaying} disabled={isPlaying}>Play</button>
        </div>
        {
          [...Array(Math.floor(songRef.current.length / 16))].map((_, i) => (
              <div className="flex my-2">
                { songRow(songRef.current.slice(i * 16, (i+1)*16), position, isPlaying)}
              </div>
          ))
        }
        <SongPlayer isPlaying={isPlaying} updatePosition={updatePosition} song={songRef.current} />
        <Song>
          <Track>
            <Instrument type="synth" notes={userNotes} />
          </Track>
        </Song>
      </header>
    </div>
  );
}


export default App;
