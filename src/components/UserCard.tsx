import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

type Props = {
    userPfp: string,
    userName: string,
    userGames: number,
    style: Object
}

export default function UserCard({userPfp, userName, userGames, style} : Props) {

    const gamesColor = () => {
        switch(true) {

            case (userGames >= 20):
                return "gold"

            case (userGames >= 15):
                return "silver"

            case (userGames >= 10):
                return  "#CD7F32"

            case (userGames < 10):
                return  "black"
            
        }
    }

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
                    image={userPfp}
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
                    {userName}
                </Typography>
                <Typography variant="body1" color={gamesColor()} sx={{fontWeight: 700}}>
                    Games: {userGames}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}