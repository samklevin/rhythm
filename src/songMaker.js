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

const restsByResolutionAndDifficulty = {
  8: {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
  },
  16: {
    0: 2,
    1: 4,
    2: 6,
    3: 9,
  },
};

const repeatProbabilityByDifficulty = {
  0: 0.6,
  1: 0.4,
  2: 0.3,
  3: 0.1,
};

const MAX_LEVEL_REPEATS = 2;

export const makeSong = (song, difficulty, levelCount = 7) => {
  const restCount = restsByResolutionAndDifficulty[song.length][difficulty];
  const shouldRepeat = repeatProbabilityByDifficulty[difficulty];
  let repeatCount = MAX_LEVEL_REPEATS;

  const newOrRepeat = (lastLevel, nextLevel) => {
    if (_.random() < shouldRepeat && repeatCount < MAX_LEVEL_REPEATS) {
      repeatCount += 1;
      return lastLevel;
    }
    repeatCount = 0;
    return nextLevel;
  };

  const notes = serializedNotes(song);

  let playableLevels = [];
  let previousLevel = [];

  const nextTheme = () => {
    const randomSeed = _.random();
    if (randomSeed < 0.33) {
      return serializedNotes(song);
    } else if (randomSeed < 0.66) {
      return _.reverse(serializedNotes(song));
    } else {
      return _.shuffle(serializedNotes(song));
    }
  };

  const nextLevel = () => {
    const next = insertRests(nextTheme(notes), restCount);
    previousLevel = next;
    return newOrRepeat(previousLevel, next);
  };

  while (playableLevels.length < levelCount) {
    playableLevels.push(nextLevel());
  }

  console.log(playableLevels);

  let fullSong = [
    serializedNotes(song),
    playableLevels,
    _.reverse(serializedNotes(song)),
  ];

  fullSong = _.flattenDeep(fullSong);
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

export const generateSong = (
  resolution = 16,
  difficulty = 0,
  levelCount = 7
) => {
  return makeSong(getTheme(resolution), difficulty, levelCount);
};
