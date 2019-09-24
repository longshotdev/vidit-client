import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  makeStyles,
  Paper,
  Modal,
  Fade,
  Backdrop,
  Box
} from "@material-ui/core";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";
import Copyright from "../../components/Copyright";
import SplashScreen from "../../components/SplashScreen";
import VideoPlayer from "../../components/Upload/ReactPlayer";
import UploadVideo from "../../components/Upload/UploadVideo";
import RenderVideos from "../../components/Upload/RenderVideos";
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
    width: "100%", // Fix IE 11 issue. i know who uses IE 11 lmao
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


const Page = ({ ...props }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    async function getVideos() {
      try {
      let data = await fetch("http://localhost:4000/videos", { method: "GET" });
      let lol = await data.json();
      setVideos(lol);
    } catch(e) {
      console.log("ERROR:")
      setTimeout(() => getVideos(), 4000)
      console.error(e);
    }
    }
    getVideos();
  }, []);

  const [videoState, setVideoState] = useState("Loading");
  const [getVideos, setVideos] = useState();
  const [getID, setID] = useState(1);
  const [Video, setVideo] = useState(
    `http://localhost:4000/videos/play/${getID}`
  );
  // Upload Files
  const [uploadInput, setUploadInput] = useState();
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState("false"); // it doesnt work with Booleans 
  const [isModalOpen, setModalOpen] = useState(false);         // apparently and react doesnt 
                                                               // like it either smh 
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
    if(!uploadInput.files[0]) return enqueueSnackbar("Select a Valid Video!", { variant: "error"});
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
        enqueueSnackbar("Uploaded Video! Refresh your page!", { variant: "sucess"});
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


export default ({ ...props }) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Page />
    </SnackbarProvider>
  );
};