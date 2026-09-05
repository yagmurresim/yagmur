export type ProgramTone = {
  wash: string;
  accent: string;
};

export const PROGRAM_TONES: Record<string, ProgramTone> = {
  "resim-kursu": {
    wash: "#f4ebe6",
    accent: "#8a3d52",
  },
  "piyano-kursu": {
    wash: "#f3ead8",
    accent: "#7a5a38",
  },
  "keman-kursu": {
    wash: "#f4e6d4",
    accent: "#9a5a32",
  },
  "gitar-kursu": {
    wash: "#eee8ec",
    accent: "#5c3a68",
  },
};

export function toneFor(slug: string): ProgramTone {
  return (
    PROGRAM_TONES[slug] ?? {
      wash: "#f7f3ea",
      accent: "#3b164c",
    }
  );
}
