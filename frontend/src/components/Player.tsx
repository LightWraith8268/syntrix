import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Plyr from "plyr";
import { createPlayer, configureBuffering } from "../utils/player";
import { detectConnectionType } from "../utils/network";
import type { Media, StreamInfo } from "../types";

interface Props {
  open: boolean;
  media?: Media | null;
  stream?: StreamInfo | null;
  onClose?: () => void;
}

export function Player({ open, media, stream, onClose }: Props) {
  const playerRef = useRef<Plyr | null>(null);
  const elementRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!open || !element || !stream) {
      return;
    }

    const plyr = createPlayer(element, {
      title: media?.title,
    });
    configureBuffering(plyr, detectConnectionType());
    playerRef.current = plyr;

    plyr.source = {
      type: "video",
      title: media?.title,
      sources: [
        {
          src: stream.url,
          type: stream.contentType ?? "video/mp4",
        },
      ],
    };

    return () => {
      plyr.destroy();
      playerRef.current = null;
    };
  }, [media?.title, open, stream]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-5xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <video ref={elementRef} className="aspect-video w-full rounded-2xl" controls />
            <button
              type="button"
              onClick={onClose}
              className="absolute -right-4 -top-4 rounded-full bg-accent px-4 py-2 font-semibold text-white shadow-lg"
            >
              Close
            </button>
            {media ? (
              <div className="mt-4 space-y-2 rounded-2xl bg-black/60 p-6">
                <h3 className="text-2xl font-semibold">{media.title}</h3>
                <p className="text-sm text-white/70">{media.metadata?.description}</p>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
