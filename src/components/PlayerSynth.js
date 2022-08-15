import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import { shiftUpTwoOctaves } from "../musicUtils";

const PlayerSynth = ({ lockedAt, setLockedAt, setHits, songRef }) => {
  useEffect(() => {
    document.addEventListener("keydown", userKeyDown);

    return () => {
      document.removeEventListener("keydown", userKeyDown);
    };
  });

  const playerSynth = new Tone.PolySynth(Tone.Synth).toDestination();

  const userKeyDown = (event) => {
    if (lockedAt) {
      return;
    }
    if (event.keyCode === 32) {
      const currentPosition = Tone.Transport.position.split(".");
      const position = currentPosition[0];
      const remainder = currentPosition[1];
      const currentNote = songRef.current.find((n) => n.time === position);
      const now = Tone.context.currentTime;
      if (!currentNote.play && remainder < 800) {
        playerSynth.triggerAttackRelease(
          shiftUpTwoOctaves(currentNote.note),
          "16n",
          now
        );
        setHits((prevHits) => [...prevHits, position]);
        setLockedAt(null);
      } else {
        setLockedAt(now);
        playerSynth.triggerAttack("A3", now);
        playerSynth.triggerAttack("Bb3", now);
        playerSynth.triggerAttack("B3", now);
        playerSynth.triggerRelease(["A3", "Bb3", "B3"], now + 0.1);
      }
    }
  };

  return <></>;
};

export default PlayerSynth;
