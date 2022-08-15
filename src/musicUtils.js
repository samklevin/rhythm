export const shiftUpTwoOctaves = (note) =>
  note.replace(/\d/, (octave) => Number(octave) + 2);

export const sixteenthDuration = (bpm) => bpm / (60 * 4);
