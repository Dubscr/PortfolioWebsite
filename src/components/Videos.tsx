import { useState } from "react";
import { videos, videosIntro } from "../data/portfolio";
import type { Video } from "../types/portfolio";
import { Ghost } from "./Ghosts";

export function Videos() {
  return (
    <section className="section" id="videos">
      <div className="wrap">
        <h2 className="heading">Videos</h2>
        <p className="lede">{videosIntro}</p>
        <div className="tv-grid">
          {videos.map((video, i) => (
            <article key={video.youtubeId}>
              <div className="tv-frame">
                <LazyYouTube video={video} />
                {i === 1 ? <Ghost id="video" className="ghost--tv" /> : null}
              </div>
              <h3 className="title title--small">{video.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Shows a thumbnail, and only loads YouTube's player once someone presses play. */
function LazyYouTube({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`);

  if (playing) {
    return (
      <iframe
        className="tv"
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" className="tv tv--idle" onClick={() => setPlaying(true)} aria-label={`Play video: ${video.title}`}>
      <img
        src={thumb}
        alt=""
        loading="lazy"
        onError={() => setThumb(`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`)}
      />
      <span className="tv__play" aria-hidden="true">
        &#9654;
      </span>
    </button>
  );
}
