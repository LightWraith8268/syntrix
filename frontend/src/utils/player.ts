import Plyr from "plyr";

export function createPlayer(element: HTMLVideoElement | HTMLAudioElement, options?: Plyr.Options) {
  return new Plyr(element, {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "pip",
      "airplay",
      "fullscreen",
    ],
    settings: ["captions", "quality", "speed"],
    blankVideo: "https://cdn.plyr.io/static/blank.mp4",
    ...options,
  });
}

export function configureBuffering(player: Plyr, connectionType: "local" | "remote") {
  const targetLatency = connectionType === "remote" ? 10 : 3;
  player.once("canplay", () => {
    (player.media as HTMLVideoElement).preload = "auto";
    (player.media as HTMLVideoElement).setAttribute("data-buffer-target", targetLatency.toString());
  });
}
