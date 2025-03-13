"use client"
// components/VideoPlayer.js
import { useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-panorama";

const VideoPlayer2 = ({ videoSrc }: { videoSrc: string }) => {
  useEffect(() => {
    const player = videojs("videojs-panorama-player", {
      plugins: {
        panorama: {
          clickAndDrag: true,
          autoMobileOrientation: true,
        },
      },
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  return (
    <div>
      <video
        id="videojs-panorama-player"
        className="video-js"
        controls
        preload="auto"
        width="640"
        height="360"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer2;
