import {
  FiAward,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiImage,
  FiLayers,
  FiLink,
  FiMail,
  FiMap,
  FiMessageCircle,
  FiMusic,
  FiPlayCircle,
  FiStar,
  FiYoutube,
} from "react-icons/fi";
import type { IconType } from "react-icons";

const registry: Record<string, IconType> = {
  award: FiAward,
  code: FiCode,
  contact: FiMail,
  external: FiExternalLink,
  github: FiGithub,
  image: FiImage,
  layers: FiLayers,
  link: FiLink,
  markdown: FiBookOpen,
  network: FiCpu,
  play: FiPlayCircle,
  quote: FiMessageCircle,
  resume: FiFileText,
  sound: FiMusic,
  spark: FiStar,
  timeline: FiMap,
  youtube: FiYoutube,
};

export function getIcon(name?: string): IconType | undefined {
  return name ? registry[name] : undefined;
}
