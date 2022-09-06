import { getTheme } from "./songMaker";

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
});
