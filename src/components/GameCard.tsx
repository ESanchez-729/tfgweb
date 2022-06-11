import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import HelpIcon from '@mui/icons-material/QuestionMarkRounded';

type Props = {
    title : string,
    score : number,
    platforms : string,
    cover : string,
    style : Object,
    imageSize : number
}

const GameCard = ( {title, score, platforms, cover, style, imageSize} : Props) => {

    const getFontSize = () => {
        switch(true) {

            case (title.length > 30):
                return "1.2em"

            case (title.length > 20):
                return "1.5em"

            case (title.length <= 20):
                return  "1.8em"
            
        }
    }

    const getScoreColor = () => {
        switch(true) {
            case (score > 60):
                return "lime"
            case (score > 30):
                return "yellow"
            case (score >= 0):
                return "red"
        }
    }

    const verifyScore = () => {
        if (score === -1) {
            return <HelpIcon></HelpIcon>
        }
        return score
    }

    return (
        <Card sx={style}>
            <CardActionArea>
                
                <div style={{overflow: "hidden"}}>
                    {/* TODO Meter zoom programaticamente */}
                    <CardMedia
                        component="img"
                        height= {imageSize}
                        image= {cover}
                        alt="game image"
                        sx={{
                        transition: "transform .9s",
                        "&:hover": {
                            transform: "scale(1.2)"
                        }
                        }}
                    />
                </div>
                {/*Poner el heigth este tambien programaticamente */}
                <CardContent sx={{height:"20em"}}>
                    <Grid style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Typography gutterBottom variant="h5" component="div" fontSize={getFontSize()}>
                            {title}
                        </Typography>
                        <Avatar
                            sx={{
                                bgcolor: getScoreColor(),
                                width: "1.5em",
                                height: "1.5em"
                            }}
                        >
                        {verifyScore()}
                        </Avatar>
                    </Grid>
                    {/*Cambiar por algo como estado + platforms*/}
                    <Typography variant="body2" color="text.secondary" sx={{mt: "5%"}}>
                        {platforms}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default GameCard;