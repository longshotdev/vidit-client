import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  makeStyles,
  Typography,
  Paper,
  Modal,
  Fade,
  Backdrop,
  Button,
  List,
  ListItem,
  Input,
  LinearProgress,
  Box
} from "@material-ui/core";
import ReactPlayer from "react-player";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";
import Copyright from "../../components/Copyright";
import SplashScreen from "../../components/SplashScreen";

function trunc(text, n) {
  return text.length > n ? text.substr(0, n - 1) + "…" : text;
}

const videoConfig = {
  file: {
    attributes: {
      controlsList: "nodownload"
    }
  }
};
const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  button: {
    margin: theme.spacing(1)
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default ({ ...props }) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Page />
    </SnackbarProvider>
  );
};

const Page = ({ ...props }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    async function getVideos() {
      let data = await fetch("http://localhost:4000/videos", { method: "GET" });
      let fuckedup = await data.json();
      setVideos(fuckedup);
    }
    getVideos();
  }, []);

  const [videoState, setVideoState] = useState("Ready.");
  const [getVideos, setVideos] = useState();
  const [getID, setID] = useState(1);
  const [Video, setVideo] = useState(
    `http://localhost:4000/videos/play/${getID}`
  );
  // Upload Files
  const [uploadInput, setUploadInput] = useState();
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState("false");
  const [isModalOpen, setModalOpen] = useState(false);
  let playVideo = id => {
    setID(id);
    setVideo(`http://localhost:4000/videos/play/${id}`);
  };
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  let cancel;
  let handleUpload = event => {
    event.preventDefault();
    let CancelToken = axios.CancelToken;
    const data = new FormData();
    data.append("file", uploadInput.files[0]);
    data.append("filename", uploadInput.files[0].name);
    axios
      .post("http://localhost:4000/video/upload", data, {
        onUploadProgress: Event => {
          setProgress((Event.loaded / Event.total) * 100);
          setIsDownloading("true");
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
      .then(response => {
        setIsDownloading("false");
        console.log("Finished");
        enqueueSnackbar("Uploaded Video! Refresh your page!", "success");
        setProgress(0);
      });
    // fetch("http://localhost:4000/video/upload", {
    //   method: "POST",
    //   body: data
    // }).then(response => {
    //   response.json().then(body => {});
    // });
  };
  if (!getVideos) {
    return <SplashScreen />;
  } else
    return (
      <Container component="main">
        <CssBaseline />
        <Paper className={classes.paper}>
          <VideoPlayer
            getVideos={getVideos}
            getID={getID}
            handleOpen={handleOpen}
            classes={classes}
            videoState={videoState}
            Video={Video}
            setVideoState={setVideoState}
          />
          <UploadVideo
            handleUpload={handleUpload}
            progress={progress}
            setUploadInput={setUploadInput}
            cancel={cancel}
            isDownloading={isDownloading}
          />
        </Paper>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isModalOpen}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={isModalOpen}>
            <RenderVideos
              className={classes.modalPaper}
              videos={getVideos}
              onClick={id => playVideo(id)}
            />
          </Fade>
        </Modal>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
};
const VideoPlayer = ({ ...props }) => {
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
      ></ReactPlayer>
    </div>
  );
};
const UploadVideo = ({ ...props }) => {
  let { handleUpload, progress, setUploadInput, cancel, isDownloading } = props;
  return (
    <div>
      <h2>Upload Video</h2>
      <form
        id="uploadForm"
        onSubmit={e => handleUpload(e)}
        encType="multipart/form-data"
      >
        <LinearProgress
          variant="determinate"
          value={Math.round(progress, 2)}
          title={`${Math.round(progress, 2)}%`}
        />
        <input
          type="file"
          name="video"
          ref={ref => {
            setUploadInput(ref);
          }}
          accept="video/*"
        />
        <Button variant="outlined" type="submit">
          Upload!
        </Button>
        <Input
          type="button"
          value="Cancel"
          onClick={() => cancel()}
          disabled={isDownloading}
        />
      </form>
    </div>
  );
};
function RenderVideos({ ...props }) {
  let { videos, onClick } = props;
  return (
    <Paper style={{ maxHeight: 200, overflow: "auto" }}>
      <List component="nav">
        {videos.map((c, i) => {
          return (
            <ListItem key={i} onClick={() => onClick(i)}>
              {c.title}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
