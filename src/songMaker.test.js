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
    describe("rests based on difficulty, resolution and level count", () => {
      it("returns 7 rests for difficulty 0, resolution 8 and default levelCount", () => {
        const song = makeSong({ resolution: 8, difficulty: 0 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(7);
      });

      it("returns 14 rests for difficulty 1, resolution 8 and default levelCount", () => {
        const song = makeSong({ resolution: 8, difficulty: 1 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(14);
      });
      it("returns 21 rests for difficulty 2, resolution 8 and default levelCount", () => {
        const song = makeSong({ resolution: 8, difficulty: 2 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(21);
      });
      it("returns 28 rests for difficulty 3, resolution 8 and default levelCount", () => {
        const song = makeSong({ resolution: 8, difficulty: 3 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(28);
      });

      it("returns 14 rests for difficulty 0, resolution 16and default levelCount ", () => {
        const song = makeSong({ resolution: 16, difficulty: 0 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(14);
      });

      it("returns 28 rests for difficulty 1, resolution 16and default levelCount ", () => {
        const song = makeSong({ resolution: 16, difficulty: 1 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(28);
      });
      it("returns 42 rests for difficulty 2, resolution 16and default levelCount ", () => {
        const song = makeSong({ resolution: 16, difficulty: 2 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBe(42);
      });
      it("returns 56 rests for difficulty 3, resolution 16and default levelCount ", () => {
        const song = makeSong({ resolution: 16, difficulty: 3 });
        const results = song.filter((n) => !n.play);
        expect(results.length).toBeGreaterThanOrEqual(56);
      });
    });

    describe("levelCount", () => {
      it("returns 9 levels total with default level count", () => {
        const song = makeSong({ theme: mercury, difficulty: 0 });
        expect(song.length).toBe(8 * 9);
      });

      it("returns 7 levels total with level count 5", () => {
        const song = makeSong({ theme: mercury, difficulty: 0, levelCount: 5 });
        expect(song.length).toBe(8 * 7);
      });

      it("returns 11 levels total with level count 9", () => {
        const song = makeSong({ theme: mercury, difficulty: 0, levelCount: 9 });
        expect(song.length).toBe(8 * 11);
      });
    });
  });
});
