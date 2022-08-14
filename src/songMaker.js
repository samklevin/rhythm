import _ from "lodash";
import {exampleSong, secondSong} from "./songs";

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

const serializedNotes = (song) => (
    song.map(n => ({ note: n, play: true}))
)


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

const firstTrack = () => {
    const notes = serializedNotes(exampleSong)

    const firstLevel = makeLevel(_.reverse(serializedNotes(exampleSong)), 3)
    const secondLevel = makeLevel(serializedNotes(exampleSong), 5)
    const thirdLevel = makeLevel(_.shuffle(serializedNotes(exampleSong)), 6)
    const fourthLevel = makeLevel(serializedNotes(exampleSong), 6)
    const fifthLevel = invertLevel(_.reverse([...notes]), fourthLevel)
    const sixthLevel = makeLevel(serializedNotes(exampleSong), 9)
    const seventhLevel = invertLevel(_.shuffle(serializedNotes(exampleSong)), sixthLevel)

    let fullSong = [
        ...serializedNotes(exampleSong),
        ...firstLevel,
        ...secondLevel,
        ...thirdLevel,
        ...fourthLevel,
        ...fifthLevel,
        ...sixthLevel,
        ...seventhLevel,
        ..._.reverse(serializedNotes(exampleSong))
    ]

    fullSong = addTimeValues(fullSong).map((n, i) => ({...n, position: i}))
    return fullSong
}

const secondTrack = () => {
    const notes = serializedNotes(secondSong)

    const firstLevel = makeLevel(_.reverse(serializedNotes(secondSong)), 3)
    const secondLevel = makeLevel(serializedNotes(secondSong), 5)
    const thirdLevel = makeLevel(_.shuffle(serializedNotes(secondSong)), 6)
    const fourthLevel = makeLevel(serializedNotes(secondSong), 6)
    const fifthLevel = invertLevel(_.reverse([...notes]), fourthLevel)
    const sixthLevel = makeLevel(serializedNotes(secondSong), 9)
    const seventhLevel = invertLevel(_.shuffle(serializedNotes(secondSong)), sixthLevel)

    let fullSong = [
        ...serializedNotes(secondSong),
        ...firstLevel,
        ...secondLevel,
        ...thirdLevel,
        ...fourthLevel,
        ...fifthLevel,
        ...sixthLevel,
        ...seventhLevel,
        ..._.reverse(serializedNotes(secondSong))
    ]

    fullSong = addTimeValues(fullSong).map((n, i) => ({...n, position: i}))
    return fullSong
}

export const generateSong = (track=0) => {
    const tracks = [
        firstTrack,
        secondTrack
    ]
    return tracks[track]().slice(0, 64)
}