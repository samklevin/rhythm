import './App.css';
import {Song, Track, Instrument, Effect} from 'reactronica'
import React, {useEffect, useRef, useState} from "react";
import _ from "lodash";
import {exampleSong} from "./songs";
import {SongPlayer} from "./SongPlayer";
import * as Tone from 'tone'

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

const addTimeValues = (song) => (
    song.map((note, i) => ({
      note,
      time: `${ Math.floor(i / 16)}:${ Math.floor((i % 16) / 4)}:${ i % 4 }`
    })
    )
)

const generateSong = () => {
  const notes = exampleSong;
  const shuffledNotes = _.shuffle([...notes])

  const firstLevel = makeLevel(_.reverse([...notes]), 3)
  const secondLevel = makeLevel(notes, 5)
  const thirdLevel = makeLevel(shuffledNotes, 6)
  const fourthLevel = makeLevel(notes, 6)
  const fifthLevel = invertLevel(_.reverse([...notes]), fourthLevel)
  const sixthLevel = makeLevel(notes, 9)
  const seventhLevel = invertLevel(shuffledNotes, sixthLevel)

  let fullSong = [
      ...notes,
      ...firstLevel,
      ...secondLevel,
      ...thirdLevel,
      ...fourthLevel,
      ...fifthLevel,
      ...sixthLevel,
      ...seventhLevel,
      ..._.reverse([...notes])
  ]

  fullSong = addTimeValues(fullSong).map((n, i) => ({...n, position: i}))
  return fullSong

}

const songRow = (songSlice, position, isPlaying) => (
    songSlice.map((note, index) => {
      if(note.note){
        return(
            <div
                key={`note-${ note.position }`}
                className={`mx-2 w-12 h-8 rounded ease-in ${colorCycle[index % 4]} ${note.time === Tone.Transport.position.split('.')[0] && isPlaying && 'scale-150'}`}/>
        )
      } else {
        return(
            <div
                key={`note-${note.position}`} className={`mx-2 w-12 h-8 rounded ease-in `} />
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

  const startPlaying = async () => {
    setPosition(0)
    setIsPlaying(true)
    await Tone.start()
    Tone.Transport.bpm.value = 60;
    Tone.Transport.start()
  }

  const updatePosition = () => {
    setPosition(() => {
      const newPosition = Tone.Transport.position.split('.')[0]
      if(newPosition === songRef.current.slice(-1)[0].time){
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
              <div key={`row-${ i }`} className="flex my-2">
                { songRow(songRef.current.slice(i * 16, (i+1)*16), position, isPlaying)}
              </div>
          ))
        }
        <SongPlayer song={songRef.current} updatePosition={updatePosition} />
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
