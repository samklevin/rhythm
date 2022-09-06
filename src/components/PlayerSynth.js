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

  const playWrongNote = (now) => {
    playerSynth.triggerAttack("A3", now);
    playerSynth.triggerAttack("Bb3", now);
    playerSynth.triggerAttack("B3", now);
    playerSynth.triggerRelease(["A3", "Bb3", "B3"], now + 0.1);
  };

  const playHit = (now, note) => {
    playerSynth.triggerAttackRelease(shiftUpTwoOctaves(note), "16n", now);
  };

  const userKeyDown = (event) => {
    if (lockedAt) {
      return;
    }
    if (event.keyCode === 32) {
      const [transportTime, remainder] = Tone.Transport.position.split(".");
      const currentNote = songRef.current.find((n) => n.time === transportTime);
      const now = Tone.context.currentTime;
      if (!currentNote.play && remainder < 800) {
        playHit(now, currentNote.note);
        setHits((prevHits) => [...prevHits, transportTime]);
        setLockedAt(null);
      } else {
        setLockedAt(now);
        playWrongNote(now);
      }
    }
  };

  return <></>;
};

export default PlayerSynth;
