import React, { useEffect, useRef } from "react";
import * as Tone from "tone";

const SongSynth = ({
  endSong,
  setTransportTime,
  difficulty,
  resolution,
  songRef,
}) => {
  const synthRef = useRef();

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.dispose();
      Tone.Transport.cancel();
    }
    const scheduleCallback = (n, i, a) => {
      Tone.Transport.schedule(() => {
        setTransportTime(n.time);
        if (i === a.length - 1) {
          endSong();
        }
      }, n.time);
    };

    const songSynth = new Tone.Synth().toDestination();
    synthRef.current = songSynth;
    songSynth.volume.value = -12;
    songRef.current.forEach((n, i, a) => {
      scheduleCallback(n, i, a);
    });
    new Tone.Part((time, value) => {
      if (value.play) {
        songSynth.triggerAttackRelease(value.note, "16n", time);
      }
    }, songRef.current).start(0);
  }, [resolution, difficulty]);

  return <></>;
};

export default SongSynth;
