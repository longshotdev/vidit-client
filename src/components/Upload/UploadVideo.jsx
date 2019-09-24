import React from 'react';
import { LinearProgress, Button, Input } from "@material-ui/core";
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
export default UploadVideo;