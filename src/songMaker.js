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

export const getTheme = (resolution) => {
  const songsAtResolution = SONGS.filter((s) => s.length === resolution);
  if (!songsAtResolution.length) {
    throw `resolution ${resolution} is not supported`;
  }
  return _.shuffle(songsAtResolution)[0];
};

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

const repeatRests = (prevLevel, nextLevel) => {
  prevLevel.forEach((e, i) => {
    nextLevel[i].play = e.play;
  });
  return nextLevel;
};

const nextTheme = (theme) => {
  const randomSeed = _.random();
  if (randomSeed < 0.33) {
    return serializedNotes(theme);
  } else if (randomSeed < 0.66) {
    return _.reverse(serializedNotes(theme));
  } else {
    return _.shuffle(serializedNotes(theme));
  }
};

export const makeSong = ({
  resolution = 8,
  difficulty = 0,
  levelCount = 7,
}) => {
  const theme = getTheme(resolution);
  const restCount = restsByResolutionAndDifficulty[theme.length][difficulty];
  const shouldRepeat = repeatProbabilityByDifficulty[difficulty];

  let repeatCount = MAX_LEVEL_REPEATS;

  const nextLevel = () => {
    if (_.random() < shouldRepeat && repeatCount < MAX_LEVEL_REPEATS) {
      repeatCount += 1;
      return repeatRests(previousLevel, nextTheme(theme));
    }
    repeatCount = 0;
    const next = insertRests(nextTheme(theme), restCount);
    previousLevel = next;
    return next;
  };

  let playableLevels = [];
  let previousLevel = [];

  while (playableLevels.length < levelCount) {
    playableLevels.push(nextLevel());
  }

  let fullSong = [
    serializedNotes(theme),
    playableLevels,
    _.reverse(serializedNotes(theme)),
  ];

  fullSong = _.flattenDeep(fullSong);
  fullSong = addTimeValues(fullSong).map((n, i) => ({ ...n, position: i }));
  return fullSong;
};
