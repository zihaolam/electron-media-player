import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./index.css";
import "videojs-hotkeys";
import { convertSrtToVtt } from "../../utils";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const { options, subtitleRef } = props;
  const player = React.useRef(null);

  const VideoHtml = (props) => (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        id="video-js-component"
      />
    </div>
  );

  React.useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      player.current = videojs(videoElement, options, function () {
        this.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
        });
      });
    }
    focusOnVideo();
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [options]);

  React.useEffect(() => {
    const subtitleInput = subtitleRef.current;
    async function subtitleChange(e) {
      if (!e.target.files.length) return;
      var subtitleURL;
      if (e.target.files[0].type !== "text/vtt")
        subtitleURL = await convertSrtToVtt(e.target.files[0]);
      else subtitleURL = URL.createObjectURL(e.target.files[0]);
      player.current.addRemoteTextTrack(
        {
          srcLang: "en",
          kind: "captions",
          mode: "showing",
          label: "English",
          src: subtitleURL,
        },
        false
      );
      focusOnVideo();
    }
    subtitleInput.addEventListener("change", subtitleChange);
    return () => subtitleInput.removeEventListener("change", subtitleChange);
  }, [subtitleRef]);

  const focusOnVideo = () => {
    videoRef.current.focus();
  };

  return <VideoHtml />;
};
export default VideoJS;
