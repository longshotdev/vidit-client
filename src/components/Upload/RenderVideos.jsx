import React from 'react';
import {
	Paper,
	List,
	ListItem
} from '@material-ui/core'
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
export default RenderVideos;