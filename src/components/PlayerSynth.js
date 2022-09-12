import React, { useEffect, useRef } from "react";
import * as Tone from "tone";
import { shiftUpTwoOctaves } from "../musicUtils";

const PlayerSynth = ({ lockedAt, setLockedAt, setHits, songRef, tone }) => {
  useEffect(() => {
    document.addEventListener("keydown", userKeyDown);

    return () => {
      document.removeEventListener("keydown", userKeyDown);
    };
  });

  const synthRef = useRef()

  useEffect(() => {
    if(!synthRef.current){
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
  }, [songRef.current])

  const playWrongNote = (now) => {
    synthRef.current.triggerAttack("A3", now);
    synthRef.current.triggerAttack("Bb3", now);
    synthRef.current.triggerAttack("B3", now);
    synthRef.current.triggerRelease(["A3", "Bb3", "B3"], now + 0.1);
  };

  const playHit = (now, note) => {
    const nextNote = tone === 0 ? shiftUpTwoOctaves(note) : note;
    synthRef.current.triggerAttackRelease(nextNote, "16n", now);
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
