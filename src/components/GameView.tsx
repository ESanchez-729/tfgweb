import { Avatar, Box, Button, Chip, Rating, Typography } from "@mui/material";
import StatusEnum from "../models/enums/StatusEnum";
import ChipSelectorStatusTest from "./ChipSelectorStatusTest";
import StarIcon from '@mui/icons-material/Star';
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import { useEffect, useState } from "react";
import { wait } from "@testing-library/user-event/dist/utils/misc/wait";
import DetailedGame from "../models/DetailedGame";

const GameView = () => {

    const [gameData, setGameData] = useState<DetailedGame>()
    const queryParams = new URLSearchParams(window.location.search);
    const vm = ProfileViewmodel.getInstance()

    useEffect(() => {
        wait(500).then(() => {
            console.log(queryParams.get('id'))
            loadData()
        })
    }, [])

    const loadData = async () => {
        await vm.getDB.functions.invoke('IGDBGetGameData', { body: JSON.stringify({"game_id": queryParams.get('id')})})
            .then((response) => {setGameData(response.data[0]); console.log(gameData)}).catch((error) => {console.log(error)})
    }

    const getBigCover = (smallCover : string) => {
        
        if (smallCover === null || smallCover === undefined || smallCover === "") {

            return "https://cdn.discordapp.com/attachments/787425567154634844/965678908789899264/ColorDeFondoAAAAAAAAAAAAAAA.png"

        } else {

            let imageId = smallCover.substring(smallCover.lastIndexOf('/') + 1, smallCover.length );
            return "https://images.igdb.com/igdb/image/upload/t_cover_big/" + imageId
        }

    }

    const getPlatforms = (platforms : any[]) => {

        let finalPlatform = ""

        if (platforms !== null && platforms !== undefined) {

            platforms.forEach((platform) => {

                if (platform.abbreviation === null || platform.abbreviation === undefined) {
                    finalPlatform += `${platform.name}, `
                } else {
                    finalPlatform += `${platform.abbreviation}, `
                }

            })

        } else {

            finalPlatform = ""

        }

        return finalPlatform.slice(0, -2)

    }

    const getScoreColor = () => {
        if(gameData?.total_rating !== undefined) {
            switch(true) {
                case (gameData?.total_rating > 60):
                    return "lime"
                case (gameData?.total_rating > 30):
                    return "yellow"
                case (gameData?.total_rating >= 0):
                    return "red"
            }
        } else {
            return "#bdbdbd"
        }
    }

    const getRoundedRating = (rating: number) => {

        if (rating === null || rating === undefined || rating === -1) {
            return -1
        }

        return Math.round(rating)

    }

    const getCompanies = () => {

        let finalCompanies = ""

        if (gameData?.involved_companies !== null && gameData?.involved_companies !== undefined) {

            gameData.involved_companies.forEach((company) => {

                finalCompanies += `${company.company.name}, `

            })

        } else {

            finalCompanies = "?"

        }

        return finalCompanies.slice(0, -2)

    }

    const unixToDate = (unix? : number) => {

        if (unix !== null && unix !== undefined) {

            var date = new Date(unix * 1000);
            return date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString()

        }

        return "?"
        
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column",  marginLeft: "1%", marginTop: "-5%"}}>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{border: "2px solid black", display: "flex", flexDirection: "column", padding: "1em", maxWidth: "55vh", ustifyContent: "flex-start"}}>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <img src={getBigCover(gameData?.cover.url || "")} 
                            style={{border: "2px solid black", margin: "1%", width:"15em", height:"21em"}}/>

                        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", width: "20em"}}>
                            <Typography sx={{width: "10em", borderBottom: "1px solid black", mb: "1%", pb:"1%"}}>{getPlatforms(gameData?.platforms || [""])}</Typography>
                            {gameData?.genres.map((genre, i: number) => {
                                return (
                                    <Typography sx={{width: "10em", marginTop: "-20%"}} key={i}>{genre.name}</Typography>
                                )
                            })}
                            
                            <Avatar sx={{bgcolor: getScoreColor(), width: "2em", height: "2em"}}>{getRoundedRating(gameData?.total_rating || -1)}</Avatar>
                        </Box>
                    </Box>
                    <Box  sx={{display: "flex", flexDirection: "row", mt: "3%", justifyContent: "space-evenly"}}>
                        <ChipSelectorStatusTest currentStatus={StatusEnum.PLAYING} readOnlyStatus={false} onChangeStatus={(statusNumber : number) => {}}/>
                        <Chip label="Remove from library" sx={{fontWeight: "bold", mt: "1.3em"}}></Chip>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "2%"}}>
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography variant="h3">{gameData?.name || "?"}</Typography>
                        <Typography variant="h4" color="lightgray">&nbsp; - Remake</Typography>
                    </Box>
                    <Typography variant="body1" sx={{maxWidth: "50em"}}>{gameData?.summary || "No se ha proporcionado informacion."}</Typography>
                    {/**Map */}
                    <Typography variant="h5" sx={{ mt: "10%", mb: "1%"}}>Websites</Typography>
                    <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", ml: "-1em"}}>
                        <Button variant="contained" color="error" sx={{m: "1em", flex: "0 0 33%"}}>Youtube</Button>
                        <Button variant="contained" color="primary" sx={{m: "1em", flex: "0 0 33%"}}>Twitter</Button>
                        <Button variant="contained" color="secondary" sx={{m: "1em", flex: "0 0 33%"}}>Twitch</Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{display: "flex", flexDirection: "column", minWidth: "31%"}}>
                    <Box sx={{display: "flex", flexDirection: "row", mt: "5%", ml: "5%"}}>
                        <b>Release date/s:</b> &nbsp;&nbsp;{unixToDate(gameData?.first_release_date)}
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", mt: "5%", ml: "5%", alignItems: "flex-start"}}>
                        <b>Companies: </b> <p style={{textAlign: "left", marginTop: "-0.1em"}}>{getCompanies()}</p>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>

                    {(gameData?.dlcs) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em"}}>DLC (Carrousel)</Typography>
                            <Box sx={{display: "flex", flexDirection: "row", ml: "-1%"}}>
                                {gameData?.dlcs.map((dlc) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                            <img
                                                src={getBigCover(dlc.cover?.url || "")}
                                                style={{width: "10em", height: "12em"}}/>
                                            <Typography>{dlc.name}</Typography>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </div> : null}
                    
                    {(gameData?.expansions) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em"}}>Expansiones (Carrousel)</Typography>
                            <Box sx={{display: "flex", flexDirection: "row", ml: "-1%"}}>
                                {gameData?.expansions.map((expansion) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                            <img
                                                src={getBigCover(expansion.cover?.url || "")}
                                                style={{width: "10em", height: "12em"}}/>
                                            <Typography>{expansion.name}</Typography>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </div> : null}

                    {(gameData?.artworks) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em"}}>Artworks (Carrousel)</Typography>
                            <Box sx={{display: "flex", flexDirection: "row", ml: "-1%"}}>
                                {gameData?.artworks.map((artwork) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                            <img
                                                src={getBigCover(artwork.url || "")}
                                                style={{width: "15em", height: "10em"}}/>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </div> : null}

                    {(gameData?.screenshots) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em"}}>Screenshots (Carrousel)</Typography>
                            <Box sx={{display: "flex", flexDirection: "row", ml: "-1%"}}>
                                {gameData?.screenshots.map((screenshot) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                            <img
                                                src={getBigCover(screenshot.url || "")}
                                                style={{width: "15em", height: "10em"}}/>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </div> : null}

                    {(gameData?.similar_games) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em"}}>Similar Games (Carrousel)</Typography>
                            <Box sx={{display: "flex", flexDirection: "row", ml: "-1%"}}>
                                {gameData?.similar_games.map((sg) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                            <img
                                                src={getBigCover(sg.cover.url || "")}
                                                style={{width: "10em", height: "12em"}}/>
                                            <Typography>{sg.name}</Typography>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </div> : null}

                    <Typography sx={{fontSize: "2em"}}>Reviews</Typography>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <Box sx={{display: "flex", flexDirection: "column", width: "69%", border: "2px solid black", padding: "1%", mt: "2%" }}>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",  borderBottom: "2px solid black" }}>
                                <Typography>Xxx_Pablo_Destroyer_xxX</Typography>
                                {/** https://mui.com/material-ui/react-rating/#hover-feedback */}
                                <Rating
                                    name="hover-feedback"
                                    value={3}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        console.log(newHover)
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                            </Box>
                            <Typography sx={{mt: "2%", textAlign:"left"}}>mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, 
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <Box sx={{display: "flex", flexDirection: "column", width: "69%", border: "2px solid black", padding: "1%", mt: "2%" }}>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",  borderBottom: "2px solid black" }}>
                                <Typography>Xxx_Pablo_Destroyer_xxX</Typography>
                                {/** https://mui.com/material-ui/react-rating/#hover-feedback */}
                                <Rating
                                    name="hover-feedback"
                                    value={3}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        console.log(newHover)
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                            </Box>
                            <Typography sx={{mt: "2%", textAlign:"left"}}>mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, 
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <Box sx={{display: "flex", flexDirection: "column", width: "69%", border: "2px solid black", padding: "1%", mt: "2%" }}>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",  borderBottom: "2px solid black" }}>
                                <Typography>Xxx_Pablo_Destroyer_xxX</Typography>
                                {/** https://mui.com/material-ui/react-rating/#hover-feedback */}
                                <Rating
                                    name="hover-feedback"
                                    value={3}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        console.log(newHover)
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                            </Box>
                            <Typography sx={{mt: "2%", textAlign:"left"}}>mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, 
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <Box sx={{display: "flex", flexDirection: "column", width: "69%", border: "2px solid black", padding: "1%", mt: "2%" }}>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",  borderBottom: "2px solid black" }}>
                                <Typography>Xxx_Pablo_Destroyer_xxX</Typography>
                                {/** https://mui.com/material-ui/react-rating/#hover-feedback */}
                                <Rating
                                    name="hover-feedback"
                                    value={3}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        console.log(newHover)
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                            </Box>
                            <Typography sx={{mt: "2%", textAlign:"left"}}>mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, 
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo,
                                mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo, mu malo.
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-around", mt: "1%"}} >
                                <Button variant="contained" color="error" sx={{borderTop: "2px solid black", backgroundColor: '#a02725'}}>Remove Review</Button>
                                <Button variant="contained" sx={{borderTop: "2px solid black", backgroundColor: "blue"}}>Edit Review</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )

    /**
        dlcs + expansiones
        artwork + screenshots
        similar_games
        reviews
     */

}

export default GameView;