import { Cover } from "./components/Cover";
import { Games } from "./components/Games";
import { GhostProvider } from "./components/Ghosts";
import { Header } from "./components/Header";
import { Music } from "./components/Music";
import { Socials } from "./components/Socials";
import { Videos } from "./components/Videos";

export default function App() {
  return (
    <GhostProvider>
      <Header />
      <main>
        <Cover />
        <Games />
        <Music />
        <Videos />
        <Socials />
      </main>
    </GhostProvider>
  );
}
