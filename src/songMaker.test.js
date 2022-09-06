import { getTheme, makeSong } from "./songMaker";
import { mercury, sol } from "./songs";

describe("songMaker", () => {
  describe("getTheme", () => {
    it("returns a song equal to resolution 16", () => {
      const theme = getTheme(16);
      expect(theme.length).toBe(16);
    });

    it("returns a song equal to resolution 8", () => {
      const theme = getTheme(8);
      expect(theme.length).toBe(8);
    });

    it("throws an error if resolution is not supported", () => {
      expect(() => {
        getTheme(9);
      }).toThrowError("resolution 9 is not supported");
    });
  });

  describe("makeSong", () => {
    describe("rests based on difficulty and resolution", () => {
      it("returns 7 rests for difficulty 0 and resolution 8", () => {
        const song = makeSong(mercury, 0);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(7);
      });

      it("returns 14 rests for difficulty 1 and resolution 8", () => {
        const song = makeSong(mercury, 1);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(14);
      });
      it("returns 21 rests for difficulty 2 and resolution 8", () => {
        const song = makeSong(mercury, 2);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(21);
      });
      it("returns 28 rests for difficulty 3 and resolution 8", () => {
        const song = makeSong(mercury, 3);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(28);
      });

      it("returns 14 rests for difficulty 0 and resolution 16", () => {
        const song = makeSong(sol, 0);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(14);
      });

      it("returns 28 rests for difficulty 1 and resolution 16", () => {
        const song = makeSong(sol, 1);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(28);
      });
      it("returns 42 rests for difficulty 2 and resolution 16", () => {
        const song = makeSong(sol, 2);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(42);
      });
      it("returns 56 rests for difficulty 3 and resolution 16", () => {
        const song = makeSong(sol, 3);
        const results = song.filter((n) => !n.play);
        expect(results.length).toBeGreaterThanOrEqual(56);
      });
    });
  });
});
