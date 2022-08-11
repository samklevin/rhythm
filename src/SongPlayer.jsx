import React from "react";
import * as Tone from 'tone'

export const SongPlayer = ({ song, updatePosition, setIsPlaying }) => {
    const synth = new Tone.Synth().toDestination();
    synth.volume.value = -12
    song.forEach((n, i, a) => {
        Tone.Transport.schedule(() => {
            updatePosition(n.time)
        }, n.time)
        if(i === a.length - 1){
            setIsPlaying(false)
        }
    })
    new Tone.Part((
        (time, value) => {
            if(value.play){
                synth.triggerAttackRelease(value.note, '16n', time)
            }
        }
    ), song).start(0)
}