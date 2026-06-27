import type { PortfolioNodeData } from "../types/portfolio";

export const portfolioNodes: PortfolioNodeData[] = [
  {
    id: "root",
    type: "category",
    title: "Dubscr's Portfolio",
    description: "You are on the main node.",
    color: "#7dd3fc",
    icon: "network",
    content: {
      kind: "text",
      body: "This website is organized as a node graph. Click nodes to learn more about me! 😁",
    },
  },
  {
    id: "games",
    parent: "root",
    type: "category",
    title: "Games",
    description: "My philosophy on games.",
    color: "#EFDE0C",
    icon: "spark",
    content:{
      kind: "text",
      body: "Gameplay loops always come first. A polished game with a gameplay loop that isn't fun, isn't a game!",
    }
  },
    {
    id: "dmm",
    parent: "games",
    type: "gallery",
    title: "Dubscr's Murder Mystery",
    description: "Dubscr's Murder Mystery is a free multiplayer social deduction game. It uses mirror as its framework, and steam workshop for custom maps.",
    color: "#7C47FF",
    icon: "spark",
    content: {
      kind: "gallery",
      images: [{src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2969250/ss_07e42b49a222e59dc2c6ac73bd0c06961cdb584e.1920x1080.jpg", alt: "You are the murderer.", caption: "Player in-game just got the murderer role at round start."},{src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2969250/ss_603f48259a3de4d45e2f35b882e31a3a3f6571db.1920x1080.jpg", alt: "FNAF Map", caption: "3 Players scurrying around FNAF pizzeria."}, {src:"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2969250/ss_0fef198ab6a94c7127414b254e4a70a4b864b5d6.1920x1080.jpg", alt: "Player tries to use gambling machine", caption: "Player tries to use gambling machine"}]
    }
  },
  {
    id: "ugg",
    parent: "games",
    type: "gallery",
    title: "Untitled Ghost Game",
    description: "Free multiplayer 2D ghost hunting game that you can play with friends.",
    color: "#7C47FF",
    icon: "spark",
    content: {
      kind: "gallery",
      images: [{src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2356460/ss_246013f43a2cd902baaaf20b2a3ad9cb2db3693f.1920x1080.jpg", alt: "Player is listening to music.", caption: "Player jamming out to some tunes."},{src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2356460/ss_9b8a0c5de56c8d4bfdde47869f9fed1f536c2c93.1920x1080.jpg", alt: "All of the table items in UGG.", caption: "All of the table items in UGG."}]
    }
  },
  {
    id: "music",
    parent: "root",
    type: "category",
    title: "Music",
    description: "Some backstory about me being a musician.",
    color: "#0080ff",
    icon: "play",
    content: {
      kind: "text",
      body: "I have been a musician since I was 11 years old. I make metal, electronic, and extremely varying genres of music. I've made soundtracks for my friends' games, as well as my own.",
    },
  },
  {
    id: "electronic",
    parent: "music",
    type: "soundcloud",
    title: "Jazz Example",
    description: "This isn't really jazz, just thought it was a funny name. It is more of an electronic song than anything.",
    color: "#fb923c",
    icon: "sound",
    content: { kind: "embed", url: "..\\..\\public\\jazz example.flac" },
  },
  {
    id: "metal",
    parent: "music",
    type: "soundcloud",
    title: "Reclaim Trailer Music",
    description: "This was one of the songs I made for Midey's game 'Reclaim.'",
    color: "#fb923c",
    icon: "sound",
    content: { kind: "embed", url: "..\\..\\public\\shorter trailer.wav" },
  },
  {
    id: "youtube",
    parent: "root",
    type: "youtube",
    title: "Videos",
    description: "Brief explanation of my past on YouTube.",
    color: "#47FF65",
    icon: "youtube",
    content: {
      kind: "text",
      body: "I started making youtube videos in 2018, originally doing meme videos and counter-strike frag movies. Through this, I've learned how to edit good quality videos of all different types. Once I really started getting into game development, I had started making dev logs."
    }
  },
    {
    id: "rally",
    parent: "youtube",
    type: "youtube",
    title: "How I Made a Rally Game: In Depth Analysis",
    description: "I made a video documenting my experience in trying to make a rally racing game.",
    color: "#ef4444",
    icon: "youtube",
    content: {
      kind: "embed",
      url: "https://youtu.be/6PdFTp4bSRs"
    }
  },
      {
    id: "dmmtrailer",
    parent: "youtube",
    type: "youtube",
    title: "Dubscr's Murder Mystery Official Trailer",
    description: "This is the trailer for my game on steam 'Dubscr's Murder Mystery.'",
    color: "#ef4444",
    icon: "youtube",
    content: {
      kind: "embed",
      url: "https://youtu.be/l6Wm-GlTjZo"
    }
  },

  /*
  {
    id: "achievement",
    parent: "root",
    type: "achievement",
    title: "Builder Bias",
    description: "A compact metric node for outcomes and emphasis.",
    color: "#bef264",
    icon: "award",
    content: { kind: "achievement", metric: "1 object", detail: "Add a project by appending one typed node to the data file." },
  },
  */
  {
    id: "socials",
    parent: "root",
    type: "contact",
    title: "Socials",
    description: "Links and email for getting in touch.",
    color: "#fb7185",
    icon: "contact",
    content: {
      kind: "contact",
      email: "dubscur@gmail.com",
      links: [
        { label: "GitHub", url: "https://github.com/dubscr" },
        { label: "Itch.io", url: "https://dubscr.itch.io" },
        { label: "YouTube", url: "https://youtube.com/dubscr" },
        { label: "Twitter", url: "https://x.com/DubscrYoutube" }
      ],
    },
  },
];
