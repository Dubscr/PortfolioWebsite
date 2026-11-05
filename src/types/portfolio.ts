export interface Shot {
  src: string;
  alt: string;
  caption?: string;
}

export interface Game {
  title: string;
  description: string;
  steamUrl: string;
  shots: Shot[];
}

export interface Track {
  id: string;
  title: string;
  /** Short text written on the cassette label. */
  label: string;
  note: string;
  /** File in /public. Must stay on this site so the visualizer can read it. */
  src: string;
  color: string;
}

export interface Video {
  title: string;
  youtubeId: string;
}

export interface SocialLink {
  label: string;
  url: string;
}
