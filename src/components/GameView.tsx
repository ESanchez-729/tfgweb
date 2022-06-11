import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import StatusEnum from "../models/enums/StatusEnum";
import ChipSelectorStatusTest from "./ChipSelectorStatusTest";

const GameView = () => {

    return (
        <Box sx={{display: "flex", flexDirection: "row",  marginLeft: "1%", marginTop: "-5%"}}>
            <Box sx={{border: "2px solid black", display: "flex", flexDirection: "column", padding: "1em", maxWidth: "55vh"}}>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <img src="https://cdn.discordapp.com/attachments/607276288155058186/985019256615886928/unknown.png" 
                        style={{border: "2px solid black", margin: "1%", width:"15em", height:"21em"}}/>

                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", width: "20em"}}>
                        <Typography sx={{width: "10em"}}>Platforms Platforms Platforms Platforms Platforms Platforms Platforms Platforms</Typography>
                        <Typography sx={{width: "10em"}}>Genre Genre Genre Genre Genre Genre Genre Genre Genre Genre Genre</Typography>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/PEGI_18.svg/425px-PEGI_18.svg.png"
                            style={{width:"5em", height:"5em"}}/>
                    </Box>
                </Box>
                <Box  sx={{display: "flex", flexDirection: "row", mt: "3%", justifyContent: "space-evenly"}}>
                    <ChipSelectorStatusTest currentStatus={StatusEnum.PLAYING} readOnlyStatus={false}/>
                    <Chip label="Remove from library" sx={{fontWeight: "bold", mt: "1.3em"}}></Chip>
                </Box>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "2%"}}>
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Typography variant="h3">Game Name </Typography>
                    <Typography variant="h4" color="lightgray">&nbsp; - Remake</Typography>
                </Box>
                <Typography variant="body1" sx={{maxWidth: "50em"}}>Game description description description description description description description description
                    description description description description description description description description description description
                    description description description description description description description description description description</Typography>
                {/**Map */}
                <Typography variant="h5" sx={{ mt: "10%", mb: "1%"}}>Websites</Typography>
                <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", ml: "-1em"}}>
                    <Button variant="contained" color="error" sx={{m: "1em", flex: "0 0 33%"}}>Youtube</Button>
                    <Button variant="contained" color="primary" sx={{m: "1em", flex: "0 0 33%"}}>Twitter</Button>
                    <Button variant="contained" color="secondary" sx={{m: "1em", flex: "0 0 33%"}}>Twitch</Button>
                </Box>
            </Box>
        </Box>
    )

    /**
        artwork + screenshots
        dlcs + expansiones
        release_dates
        franchise
        involved_companies
        similar_games
     */

}

export default GameView;