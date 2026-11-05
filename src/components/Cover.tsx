import { highlights, tagline } from "../data/portfolio";
import { useDrag } from "../lib/useDrag";
import { Ghost, TOTAL_GHOSTS } from "./Ghosts";

export function Cover() {
  const burstRef = useDrag<HTMLAnchorElement>();

  return (
    <section className="cover" id="top">
      <div className="wrap">
        <div className="cover__mast">
          <Ghost id="cover" className="ghost--mast" />
          <h1 className="masthead">
            <span className="visually-hidden">Dubscr's Super Awesome Website</span>
            <span aria-hidden="true">DUBSCR</span>
          </h1>
        </div>

        <div className="cover__row">
          <p className="tagline">{tagline}</p>
          <ul className="highlights">
            {highlights.map((item) => (
              <li key={item.href}>
                <a href={item.href}>
                  <b>{item.value}</b> {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="scrawl cover__hint">psst, {TOTAL_GHOSTS} ghosts are hiding on this page</p>
          <a ref={burstRef} className="burst" href="#games">
            <span>
              <b>Free!</b>
              both games
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
