import DisplayRow from "./DisplayRow";
import { makeSong } from "../songMaker";
import { render } from "@testing-library/react";
import * as Tone from "tone";

describe("displayRow", () => {
  it("applies appropriate cell width based on resolution", async () => {
    const song = makeSong({ resolution: 8, difficulty: 0, levelCount: 7 });
    const { getByTestId } = render(
      <DisplayRow songSlice={song.slice(0, 8)} hits={[]} resolution={8} />
    );

    expect(getByTestId("cell-1")).toHaveClass("w-20");
  });
});
