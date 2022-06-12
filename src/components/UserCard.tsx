import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import ProfileSB from "../models/ProfileSB";

type Props = {
    userData: ProfileSB,
    style: Object
}

export default function UserCard({userData, style} : Props) {

    /*const gamesColor = () => {
        switch(true) {

            case (1 >= 20):
                return "gold"

            case (2 >= 15):
                return "silver"

            case (3 >= 10):
                return  "#CD7F32"

            case (4 < 10):
                return  "black"
            
        }
    }*/

    return (
        <Card sx={style}>
            <CardActionArea
                sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                "&:hover": {
                    ".pfpUserImage" :{
                        transition: "transform .9s",
                        transform: "scale(1.3)"
                    }
                }
                }}
            >

                <div style={{overflow: "hidden"}}>
                    <CardMedia
                    component="img"
                    image={userData.avatar_url}
                    alt="user pfp"
                    sx={{ 
                        width: "10em", height: "10em",
                        borderRight: "1px solid black"
                    }}
                    className="pfpUserImage"
                    />
                </div>
                
                <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:"flex-start",
                }}
                >
                <Typography gutterBottom variant="h5" component="div" sx={{fontFamily: 'Helvetica', color: "black", fontWeight: "bold"}}>
                    {userData.username}
                </Typography>
                <Typography variant="body1" color={"black"} sx={{fontWeight: 700}}>
                    Games: {3}
                </Typography>
                <Typography>
                    Country: {userData.country}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}