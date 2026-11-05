import { contact } from "../data/portfolio";
import { GhostTally } from "./Ghosts";

export function Socials() {
  return (
    <section className="section section--hi" id="hi">
      <div className="wrap">
        <h2 className="heading">Say hi</h2>
        <a className="email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <ul className="links">
          {contact.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <footer className="foot">
          <GhostTally />
          <a href="#top">Back to top</a>
        </footer>
      </div>
    </section>
  );
}
