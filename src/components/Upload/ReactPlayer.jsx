import React from "react";
import { Typography, Button} from '@material-ui/core';
import ReactPlayer from "react-player";


function trunc(text, n) {
  return text.length > n ? text.substr(0, n - 1) + "…" : text;
} // add to library to use;

const videoConfig = {
  file: {
    attributes: {
      controlsList: "nodownload"
    }
  }
};

function Component({...props}) {
	  let {
    getVideos,
    getID,
    handleOpen,
    classes,
    videoState,
    Video,
    setVideoState
  } = props;
  return (
    <div className="VideoPlayer">
      <Typography
        align="center"
        component="h1"
        variant="h5"
        title={getVideos[getID].title}
      >
        Playing: {trunc(getVideos[getID].title, 20)} | Status:{" "}
        <code>{videoState}</code>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className={classes.button}
        >
          Select Video
        </Button>
      </Typography>
      <ReactPlayer
        url={Video}
        type="video/mp4"
        playing
        controls
        light
        config={videoConfig}
        onReady={() => setVideoState("Ready")}
        onPause={() => setVideoState("Paused")}
        onBuffer={() => setVideoState("Buffering...")}
        preload
      ></ReactPlayer>
    </div>
  );
}

export default Component;