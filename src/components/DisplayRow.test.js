import DisplayRow from "./DisplayRow";
import {generateSong} from "../songMaker";
import {render} from "@testing-library/react";

describe('displayRow', () => {
    it('applies appropriate cell width based on resolution', () => {
        const song = generateSong(8)
        const { getByTestId } = render(<DisplayRow songSlice={song[0:8]} hits={[]}  resolution={8})
    })
})