import './App.css';
import React, {useEffect, useRef, useState} from "react";
import _ from "lodash";
import {exampleSong} from "./songs";
import * as Tone from 'tone'

const makeLevel = (notes, numberOfHoles) => {
  const thisLevel = notes.slice()
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
      thisLevel[randomHole].play = false
    }
    iterations++
    if(iterations > notes.length * 2){ break }
  }

  return thisLevel
}

const shiftUpTwoOctaves = (note) => (
    note.replace(/\d/, (octave) => (
        Number(octave) + 2
    ))
)

const colorCycle = [
  'bg-red-600',
  'bg-blue-600',
  'bg-fuchsia-600',
  'bg-lime-600'
]

const invertLevel = (notes, startingLevel) => {
  const invertedLevel = [...notes]
  startingLevel.forEach((e, i, a) => {
    if(e.play === false){
      invertedLevel[a.length - (1 + i)].play = false
    }
  })
  return invertedLevel
}

const addTimeValues = (song) => (
    song.map((note, i) => ({
      ...note,
      time: `${ Math.floor(i / 16)}:${ Math.floor((i % 16) / 4)}:${ i % 4 }`
    })
    )
)

const serializedNotes = () => (
    exampleSong.map(n => ({ note: n, play: true}))
)


const generateSong = () => {
  const notes = serializedNotes()

  const firstLevel = makeLevel(_.reverse(serializedNotes()), 3)
  const secondLevel = makeLevel(serializedNotes(), 5)
  const thirdLevel = makeLevel(_.shuffle(serializedNotes()), 6)
  const fourthLevel = makeLevel(serializedNotes(), 6)
  const fifthLevel = invertLevel(_.reverse([...notes]), fourthLevel)
  const sixthLevel = makeLevel(serializedNotes(), 9)
  const seventhLevel = invertLevel(_.shuffle(serializedNotes()), sixthLevel)

  let fullSong = [
      ...serializedNotes(),
      ...firstLevel,
      ...secondLevel,
      ...thirdLevel,
      ...fourthLevel,
      ...fifthLevel,
      ...sixthLevel,
      ...seventhLevel,
      ..._.reverse(serializedNotes())
  ]

  fullSong = addTimeValues(fullSong).map((n, i) => ({...n, position: i}))
  return fullSong

}

const songRow = (songSlice, position, isPlaying, hits) => (
    songSlice.map((note, index) => {
      if(note.play){
        return(
            <div
                key={`note-${ note.position }`}
                className={`mx-2 w-12 h-8 rounded ease-in ${colorCycle[index % 4]} ${note.time === Tone.Transport.position.split('.')[0] && isPlaying && 'scale-150'}`}/>
        )
      } else if(hits.includes(note.time)) {
        return(
            <div key={`note-${ note.position }`}
                 className='mx-2 w-12 h-8 rounded ease-in bg-white animate-pulse' />
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
  const [hits, setHits] = useState([])
  const songRef = useRef(generateSong())

  const startPlaying = async () => {
    setPosition(0)
    setIsPlaying(true)
    await Tone.start()
    Tone.Transport.bpm.value = 68;
    Tone.Transport.start()
  }

  const updatePosition = (time) => {
    setPosition(time)
  }

  useEffect(() => {
    const songSynth = new Tone.Synth().toDestination();
    songSynth.volume.value = -12
    songRef.current.forEach((n, i, a) => {
      Tone.Transport.schedule(() => {
        updatePosition(n.time)
      }, n.time)
      if(i === a.length - 1){
        setIsPlaying(false)
      }
    })
    new Tone.Part((
        (time, value) => {
          if(value.play){
            songSynth.triggerAttackRelease(value.note, '16n', time)
          }
        }
    ), songRef.current).start(0)
  }, [songRef.current.length])

  useEffect(() => {

    document.addEventListener('keydown', userKeyDown);

    return () => {
      document.removeEventListener('keydown', userKeyDown);
    }
  })

  const playerSynth = new Tone.Synth().toDestination()

  const userKeyDown = (event) => {
    if(event.keyCode === 74 && isPlaying){
      const currentPosition = Tone.Transport.position.split('.')
      const position = currentPosition[0]
      const remainder = currentPosition[1]
      const currentNote = songRef.current.find(n => n.time === position)
      if(!currentNote.play && remainder < 800){
        playerSynth.triggerAttackRelease(shiftUpTwoOctaves(currentNote.note), '16n', Tone.context.currentTime)
        setHits((prevHits) => [...prevHits, position])
      }
    }
    if(event.keyCode === 75){
      playerSynth.triggerAttackRelease("D5", '8n', Tone.context.currentTime);
    }

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
                { songRow(songRef.current.slice(i * 16, (i+1)*16), position, isPlaying, hits)}
              </div>
          ))
        }
      </header>
    </div>
  );
}


export default App;
