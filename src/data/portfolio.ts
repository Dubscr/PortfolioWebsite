import type { Game, SocialLink, Track, Video } from "../types/portfolio";

/* All the site's words and media live here. */

export const tagline = "I make games, music and videos.";

export const highlights = [
  { href: "#games", value: "150,000+", label: "game downloads" },
  { href: "#music", value: "Age 11", label: "when I started making music" },
  { href: "#videos", value: "2018", label: "when I started on YouTube" },
];

export const gamesIntro =
  "The gameplay loop comes first. A polished game that isn't fun isn't a game I'm interested in.";

const steamShot = (app: number, hash: string) =>
  `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${app}/ss_${hash}.1920x1080.jpg`;

export const murderMystery: Game = {
  title: "Dubscr's Murder Mystery",
  description: "Free multiplayer social deduction. Built with Mirror, with custom maps on Steam Workshop.",
  steamUrl: "https://store.steampowered.com/app/2969250",
  shots: [
    {
      src: steamShot(2969250, "07e42b49a222e59dc2c6ac73bd0c06961cdb584e"),
      alt: "You are the murderer.",
      caption: "Player in-game just got the murderer role at round start.",
    },
    {
      src: steamShot(2969250, "603f48259a3de4d45e2f35b882e31a3a3f6571db"),
      alt: "FNAF Map",
      caption: "3 players scurrying around FNAF pizzeria.",
    },
    {
      src: steamShot(2969250, "0fef198ab6a94c7127414b254e4a70a4b864b5d6"),
      alt: "Player tries to use gambling machine",
      caption: "Player tries to use gambling machine.",
    },
  ],
};

export const ghostGame: Game = {
  title: "Untitled Ghost Game",
  description: "Free multiplayer 2D ghost hunting. Over 150,000 downloads and 2 years of work, networked with Photon.",
  steamUrl: "https://store.steampowered.com/app/2356460",
  shots: [
    {
      src: steamShot(2356460, "246013f43a2cd902baaaf20b2a3ad9cb2db3693f"),
      alt: "Player is listening to music.",
      caption: "Player jamming out to some tunes.",
    },
    {
      src: steamShot(2356460, "9b8a0c5de56c8d4bfdde47869f9fed1f536c2c93"),
      alt: "All of the table items in UGG.",
      caption: "All of the table items in UGG.",
    },
  ],
};

export const musicIntro =
  "Metal, electronic and plenty in between, including soundtracks for my games and my friends'.";

export const tracks: Track[] = [
  {
    id: "jazz",
    title: "Jazz Example",
    label: "jazz?? example",
    note: "Not really jazz. I just thought it was a funny name.",
    src: "/jazzexample.flac",
    color: "#d92463",
  },
  {
    id: "reclaim",
    title: "Reclaim Trailer Music",
    label: "reclaim trailer",
    note: "One of the songs I made for Midey's game Reclaim.",
    src: "/shortertrailer.wav",
    color: "#8d6bf0",
  },
];

export const videosIntro = "Meme videos and Counter-Strike frag movies first, dev logs now.";

export const videos: Video[] = [
  { title: "How I Made a Rally Game: In Depth Analysis", youtubeId: "6PdFTp4bSRs" },
  { title: "Dubscr's Murder Mystery Official Trailer", youtubeId: "l6Wm-GlTjZo" },
];

export const contact = {
  email: "dubscur@gmail.com",
  links: [
    { label: "Steam", url: "https://store.steampowered.com/search/?developer=Dubscr" },
    { label: "YouTube", url: "https://youtube.com/dubscr" },
    { label: "Discord", url: "https://discord.gg/FMKwPxKTVF" },
    { label: "Itch.io", url: "https://dubscr.itch.io" },
    { label: "GitHub", url: "https://github.com/dubscr" },
    { label: "Twitter", url: "https://x.com/DubscrYoutube" },
  ] satisfies SocialLink[],
};
