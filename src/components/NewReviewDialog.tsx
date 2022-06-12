import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MenuItem, TextField, Rating } from "@mui/material";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import StarIcon from '@mui/icons-material/Star';
import { observer } from "mobx-react";
import LibrarySB from "../models/LibrarySB";

type Props = {
  editRating : number,
  editText : string,
  createFunction : Function,
  buttonName: string
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "rgb(33, 33, 33)",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "flex-start",
  borderRadius: "2em"
};

const NewReviewDialog = ({editRating, editText, createFunction, buttonName} : Props) => {

  const [open, setOpen] = useState(false);

  const [reviewText, setReviewText] = useState("")
  const [value, setValue] = useState<number | null>(editRating);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    setValue(editRating)
    setReviewText(editText)
  }, [open])

  return (
    <div style={{display: "flex"}}>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        {buttonName}
      </Button>
      <Modal
        keepMounted
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Box sx={{display: "flex", flexDirection: "column", minWidth: "100%"}}>
            <Typography sx={{fontSize: "200%"}}>
              Game Review
            </Typography>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "row", alignItems: "center", mt: "1em" }}
              >
                <Typography sx={{fontSize: "150%"}}>
                  Rating:
                </Typography>
                <Rating
                  name="hover-feedback"
                  value={value}
                  precision={1}
                  sx={{ml: "3em"}}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
            </Box>
              <Typography sx={{fontSize: "150%"}}>
                
              </Typography>
              <TextField
                multiline
                rows={15}
                maxRows={15}
                value={reviewText}
                variant="filled"
                sx={{minWidth: "100%", mt: "2em",
                ".css-1gzyby-MuiInputBase-root-MuiFilledInput-root": {
                  transition: "none",
                  backgroundColor: "black",
                  color: "white"}}}
                inputProps={{maxlength: 500}}
                onChange={(e: any) => {setReviewText(e.target.value)}}
              />
              <Button
                type="submit"
                variant="contained"
                onClick={(e) => {
                    e.preventDefault()
                    createFunction(value, reviewText)
                    setOpen(false)
                }}
                sx={{ mt: "15%", width: "40%" }}
              >
                Post
              </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default observer(NewReviewDialog)