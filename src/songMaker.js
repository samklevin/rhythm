import _ from "lodash";
import { lun, mars, mercury, sol, venus } from "./songs";

const SONGS = [lun, sol, mercury, venus, mars];

const restWithinTwoPlaces = (rests, randomRest) => {
  if (rests.includes(randomRest - 1)) {
    if (rests.includes(randomRest - 2)) {
      return true;
    }
    if (rests.includes(randomRest + 1)) {
      return true;
    }
  } else if (rests.includes(randomRest + 1)) {
    if (rests.includes(randomRest + 2)) {
      return true;
    }
  }
  return false;
};

const insertRests = (notes, numberOfRests) => {
  const thisLevel = notes.slice();
  const rests = [];
  let iterations = 0;
  while (rests.length < numberOfRests) {
    const randomRest = _.random(1, notes.length - 1);
    if (!rests.includes(randomRest)) {
      if (restWithinTwoPlaces(rests, randomRest)) {
        continue;
      }
      rests.push(randomRest);
      thisLevel[randomRest].play = false;
    }
    iterations++;
    if (iterations > notes.length * 2) {
      break;
    }
  }

  return thisLevel;
};

const serializedNotes = (song) => song.map((n) => ({ note: n, play: true }));

const reverseRests = (notes, startingLevel) => {
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

export const makeSong = (song) => {
  const notes = serializedNotes(song);

  const firstLevel = insertRests(_.reverse(serializedNotes(song)), 3);
  const secondLevel = insertRests(serializedNotes(song), 5);
  const thirdLevel = insertRests(_.shuffle(serializedNotes(song)), 6);
  const fourthLevel = insertRests(serializedNotes(song), 6);
  const fifthLevel = reverseRests(_.reverse([...notes]), fourthLevel);
  const sixthLevel = insertRests(serializedNotes(song), 9);
  const seventhLevel = reverseRests(
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

export const getTheme = (resolution) => {
  const songsAtResolution = SONGS.filter((s) => s.length === resolution);
  if (!songsAtResolution.length) {
    throw `resolution ${resolution} is not supported`;
  }
  return _.shuffle(songsAtResolution)[0];
};

export const generateSong = (resolution = 16) => {
  return makeSong(getTheme(resolution));
};
