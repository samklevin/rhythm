import {Instrument, Song, Track} from "reactronica";
import React from "react";

export const SongPlayer = ({ isPlaying, song, updatePosition }) => (
    <Song isPlaying={isPlaying} bpm={300} volume={0} isMuted={false}>
        <Track
            steps={song.map((n, i, a) => ({ ...n, duration: .15, velocity: 1}))}
            onStepPlay={updatePosition}
        >
            <Instrument type='synth'/>
        </Track>
    </Song>
)