import _ from "lodash";
import { lun, sol } from "./songs";

const holeWithinTwoPlaces = (holes, randomHole) => {
  if (holes.includes(randomHole - 1)) {
    if (holes.includes(randomHole - 2)) {
      return true;
    }
    if (holes.includes(randomHole + 1)) {
      return true;
    }
  } else if (holes.includes(randomHole + 1)) {
    if (holes.includes(randomHole + 2)) {
      return true;
    }
  }
  return false;
};

const insertRests = (notes, numberOfHoles) => {
  const thisLevel = notes.slice();
  const holes = [];
  let iterations = 0;
  while (holes.length < numberOfHoles) {
    const randomHole = _.random(1, notes.length - 1);
    if (!holes.includes(randomHole)) {
      if (holeWithinTwoPlaces(holes, randomHole)) {
        continue;
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

const reverseLevel = (notes, startingLevel) => {
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

  const firstLevel = insertRests(_.reverse(serializedNotes(song)), 3);
  const secondLevel = insertRests(serializedNotes(song), 5);
  const thirdLevel = insertRests(_.shuffle(serializedNotes(song)), 6);
  const fourthLevel = insertRests(serializedNotes(song), 6);
  const fifthLevel = reverseLevel(_.reverse([...notes]), fourthLevel);
  const sixthLevel = insertRests(serializedNotes(song), 9);
  const seventhLevel = reverseLevel(
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
