import { Box, Button, Rating, Typography } from "@mui/material"
import StarIcon from '@mui/icons-material/Star';
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import { observer } from "mobx-react";
import ProfileSB from "../models/ProfileSB";
import { useEffect, useState } from "react";
import LibrarySB from "../models/LibrarySB";
import NewReviewDialog from "./NewReviewDialog";

type Props = {
    userID : string,
    rating : number,
    review : string,
    deleteFunction : Function,
    updateFunction : Function
}

const ReviewCard = ({userID, rating, review, deleteFunction, updateFunction} : Props) => {

    const vm = ProfileViewmodel.getInstance()
    const [username, setUsername] = useState("")
    const queryParams = new URLSearchParams(window.location.search);

    const getUserName = () => {
        vm.getDB.from<ProfileSB>("profile")
            .select()
            .eq('user_id', userID)
            .then((response) => {
                if(response.data !== null && response.data !== undefined) {
                    setUsername(response.data[0].username!.toString() || "")
                }
            })
    }

    useEffect(() => {
        getUserName()
    }, [])

    return (
        <Box sx={{display: "flex", flexDirection: "column", border: "2px solid black", padding: "1%", mt: "2%", width: "32em" }}>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",  borderBottom: "2px solid black" }}>
                <Typography>{username}</Typography>
                <Rating
                    value={rating}
                    precision={0.5}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    readOnly={true}
                />
            </Box>
            <Typography sx={{mt: "2%", textAlign:"left"}}>{review}</Typography>
            {(vm.getCurrentUserId === userID)?
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-around", mt: "2em"}}>
                    <Button sx={{backgroundColor: '#a02725', color: "white"}} onClick={() => {deleteFunction()}}>Delete</Button>
                    <NewReviewDialog editRating={rating} editText={review} createFunction={updateFunction} buttonName={"Edit"} />
                </Box> 
            : null}
        </Box>
    )

}

export default observer(ReviewCard)