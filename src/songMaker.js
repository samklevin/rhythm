import _ from "lodash";
import { lun, sol } from "./songs";

const makeLevel = (notes, numberOfHoles) => {
  const thisLevel = notes.slice();
  const holes = [];
  let iterations = 0;
  while (holes.length < numberOfHoles) {
    const randomHole = _.random(1, notes.length - 1);
    if (!holes.includes(randomHole)) {
      if (holes.includes(randomHole - 1)) {
        if (holes.includes(randomHole - 2)) {
          continue;
        }
        if (holes.includes(randomHole + 1)) {
          continue;
        }
      } else if (holes.includes(randomHole + 1)) {
        if (holes.includes(randomHole + 2)) {
          continue;
        }
      }
      holes.push(randomHole);
      thisLevel[randomHole].play = false;
    }
    iterations++;
    if (iterations > notes.length * 2) {
      break;
    }
  }

  return thisLevel;
};

const serializedNotes = (song) => song.map((n) => ({ note: n, play: true }));

const invertLevel = (notes, startingLevel) => {
  const invertedLevel = [...notes];
  startingLevel.forEach((e, i, a) => {
    if (e.play === false) {
      invertedLevel[a.length - (1 + i)].play = false;
    }
  });
  return invertedLevel;
};

const addTimeValues = (song) =>
  song.map((note, i) => ({
    ...note,
    time: `${Math.floor(i / 16)}:${Math.floor((i % 16) / 4)}:${i % 4}`,
  }));

const makeSong = (song) => {
  const notes = serializedNotes(song);

  const firstLevel = makeLevel(_.reverse(serializedNotes(song)), 3);
  const secondLevel = makeLevel(serializedNotes(song), 5);
  const thirdLevel = makeLevel(_.shuffle(serializedNotes(song)), 6);
  const fourthLevel = makeLevel(serializedNotes(song), 6);
  const fifthLevel = invertLevel(_.reverse([...notes]), fourthLevel);
  const sixthLevel = makeLevel(serializedNotes(song), 9);
  const seventhLevel = invertLevel(
    _.shuffle(serializedNotes(song)),
    sixthLevel
  );

  let fullSong = [
    ...serializedNotes(song),
    ...firstLevel,
    ...secondLevel,
    ...thirdLevel,
    ...fourthLevel,
    ...fifthLevel,
    ...sixthLevel,
    ...seventhLevel,
    ..._.reverse(serializedNotes(song)),
  ];

  fullSong = addTimeValues(fullSong).map((n, i) => ({ ...n, position: i }));
  return fullSong;
};

export const generateSong = (songIndex = 0) => {
  const songs = [sol, lun];
  return makeSong(songs[songIndex]);
};
