import React, { useEffect, useState, useRef, useMemo } from "react";
import { VideoPlayer } from "./components";
const WebTorrent = require("webtorrent");

const App = () => {
  const client = useMemo(() => new WebTorrent(), []);
  const subtitleRef = useRef(null);
  const [magnetURI, setMagnetURI] = useState(
    "magnet:?xt=urn:btih:0653C32F1CD717E5723793F4E422731E581CAB87&amp;dn=The+Hobbit%3A+An+Unexpected+Journey+%282012%29+%5B1080p%5D+%5BYTS.MX%5D&amp;tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&amp;tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337"
  );
  const [config, setConfig] = useState({
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    responsive: true,
    fluid: true,
    width: "100%",
    controlBar: {
      pictureInPictureToggle: false,
    },
    sources: [],
  });
  const [videoName, setVideoName] = useState("");

  const selectVideo = ({ target }) => {
    if (!target.files.length) return;
    const videoURL = URL.createObjectURL(target.files[0]);
    setConfig((config) => ({
      ...config,
      sources: [
        {
          src: videoURL,
          type: target.files[0].type,
        },
      ],
    }));
    setVideoName(target.files[0].name);
  };

  // const startDownload = () => {
  //   client.add(magnetURI, function (torrent) {
  //     // Got torrent metadata!
  //     console.log("Client is downloading:", torrent.infoHash);

  //     torrent.files.forEach(function (file) {
  //       // Display the file by appending it to the DOM. Supports video, audio, images, and
  //       // more. Specify a container element (CSS selector or reference to DOM node).
  //       console.log(file);
  //     });
  //   });
  //   client.on("error", function (err) {
  //     console.log(err);
  //   });
  //   client.on("torrent", function (torrent) {
  //     console.log("torrent");
  //   });
  // };

  useEffect(() => {
    console.log(client.progress);
    return () => {
      client.destroy();
    };
  }, [client]);

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="w-full flex justify-center items-center bg-gray-800 border-b border-gray-900 px-2 h-7">
          <span className="text-gray-300 text-sm py-1">
            {videoName ? videoName : ""}
          </span>
        </div>
        <div className="flex flex-col flex-grow bg-gray-800 pt-1">
          <div className="flex gap-1 ml-1">
            <label className="bg-gray-500 flex items-center rounded-md shadow-md hover:bg-gray-700">
              <span className="px-3 text-white text-sm"> Select a video </span>
              <input
                type="file"
                accept="video/mp4, video/mov"
                className="hidden"
                onChange={selectVideo}
              />
            </label>
            <label className="bg-gray-500 flex items-center rounded-md shadow-md hover:bg-gray-700">
              <span className="px-3 text-white text-sm"> Add a subtitle </span>
              <input
                type="file"
                accept=".vtt,.srt"
                className="hidden"
                ref={subtitleRef}
              />
            </label>
            {/* <input
              type="text"
              className="rounded-md shadow-md bg-gray-500 px-2 text-white"
              onChange={(e) => setMagnetURI(e.target.value)}
            />
            <label className="bg-gray-500 flex items-center rounded-md shadow-md hover:bg-gray-700">
              <button
                className="px-3 text-white text-sm"
                onClick={startDownload}
              >
                Add a torrent
              </button>
            </label> */}
          </div>
          <div className="flex flex-col justify-center flex-grow">
            {config.sources.length && (
              <VideoPlayer options={config} subtitleRef={subtitleRef} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
