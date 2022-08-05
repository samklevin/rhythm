import {Effect, Instrument, Song, Track} from "reactronica";
import React from "react";
import {exampleBassLine} from "./songs";
import * as Tone from 'tone'

export const SongPlayer = ({ song, updatePosition }) => {
    const synth = new Tone.Synth().toDestination();
    song.forEach((n, i) => {
        Tone.Transport.schedule(() => {
            updatePosition()
        }, n.time)
    })
    new Tone.Part((
        (time, value) => {
            synth.triggerAttackRelease(value.note, '8n', time)
        }
    ), song).start(0)
}