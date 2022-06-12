import { Avatar, Box, Button, Chip, Link, Rating, Typography } from "@mui/material";
import StatusEnum from "../models/enums/StatusEnum";
import ChipSelectorStatusTest from "./ChipSelectorStatusTest";
import StarIcon from '@mui/icons-material/Star';
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import { useEffect, useState } from "react";
import { wait } from "@testing-library/user-event/dist/utils/misc/wait";
import DetailedGame from "../models/DetailedGame";
import Carousel from 'react-material-ui-carousel'
import {Link as RouterLink} from 'react-router-dom'
import { observer } from "mobx-react-lite";
import LibrarySB from "../models/LibrarySB";
import LoginDialog from "./LoginDialog";
import GameSB from "../models/GameSB";

const GameView = () => {

    const [gameData, setGameData] = useState<DetailedGame>()
    const [userLibraryStatus, setUserLibraryStatus] = useState<StatusEnum | string>("")
    const [selectedStatus, setSelectedStatus] = useState<StatusEnum>(StatusEnum.PLAN_TO_PLAY)
    const queryParams = new URLSearchParams(window.location.search);
    const vm = ProfileViewmodel.getInstance()

    useEffect(() => {
        wait(500).then(() => {
            console.log(queryParams.get('id'))
            loadData()
            loadStatus()
        })
    }, [queryParams.get('id')])

    const loadData = async () => {
        await vm.getDB.functions.invoke('IGDBGetGameData', { body: JSON.stringify({"game_id": queryParams.get('id')})})
            .then((response) => {setGameData(response.data[0]); console.log(gameData)}).catch((error) => {console.log(error)})
    }

    const loadStatus = async () => {
        
        if(vm.loggedIn) {

            await vm.getDB
            .from<LibrarySB>('library')
            .select()
            .eq('user_id', vm.getCurrentUserId || "")
            .eq('game_id', queryParams.get('id') || "")
            .then((response) => {
                if(response.data !== undefined && response.data !== null) {
                    setUserLibraryStatus(StatusEnum[response.data[0].status as keyof typeof StatusEnum])
                } else {
                    console.log(response.error)
                    setUserLibraryStatus("")
                }
            })

        } else {
            setUserLibraryStatus("")
        }

    }

    const deleteGame = async () => {
        await vm.getDB
          .from<LibrarySB>('library')
          .delete()
          .eq('user_id', vm.getCurrentUserId || "")
          .eq('game_id', queryParams.get('id') || "")

        setUserLibraryStatus("")
  
    }

    const addGame = async () => {

        let {data} = await vm.getDB.from<GameSB>("game")
            .select()
            .eq("game_id" ,queryParams.get('id') || "")
        
        if(data) {
            if(data.length === 0) {
                await vm.getDB.from<GameSB>("game")
                    .upsert({
                        game_id: Number(queryParams.get('id')!),
                        name: gameData?.name || "",
                        cover: getBigCover(gameData?.cover.url || ""),
                        platforms: getPlatforms(gameData?.platforms || [""]),
                        total_rating: Math.round(gameData?.total_rating || -1)})
            }

            await vm.getDB.from<LibrarySB>("library")
                    .upsert({
                        user_id: vm.getCurrentUserId || "",
                        game_id: Number(queryParams.get('id')!),
                        status: StatusEnum[selectedStatus],
                        score: -1,
                        recommended: false,
                        review: ""
                    })

            loadStatus()

        }
  
    }

    const getBigCover = (smallCover : string) => {
        
        if (smallCover === null || smallCover === undefined || smallCover === "") {

            return "https://cdn.discordapp.com/attachments/787425567154634844/965678908789899264/ColorDeFondoAAAAAAAAAAAAAAA.png"

        } else {

            let imageId = smallCover.substring(smallCover.lastIndexOf('/') + 1, smallCover.length );
            return "https://images.igdb.com/igdb/image/upload/t_cover_big/" + imageId
        }

    }

    const getOriginalImage = (smallCover : string) => {
        
        if (smallCover === null || smallCover === undefined || smallCover === "") {

            return "https://cdn.discordapp.com/attachments/787425567154634844/965678908789899264/ColorDeFondoAAAAAAAAAAAAAAA.png"

        } else {

            let imageId = smallCover.substring(smallCover.lastIndexOf('/') + 1, smallCover.length );
            return "https://images.igdb.com/igdb/image/upload/t_original/" + imageId
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
            return "?"
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

    const getCategory = (catNumber?: number): string => {

        let temp : number
        if(catNumber === undefined || catNumber === null) {
            temp = 13
        } else {
            temp = catNumber
        }

        let catCodes = [
        "Juego Base", "DLC", "Expansión",
        "Bundle",  "Expansión",  "Modificación",
        "Episodio", "Temporada", "Remake", 
        "Remaster", "Expansión", "Port",
        "Derivación", ""]
        
        return catCodes[temp]

    }

    const getWebsite = (webNumber?: number): string => {

        let temp : number
        if(webNumber === undefined || webNumber === null) {
            temp = 13
        } else {
            temp = webNumber
        }

        let webCodes = [
        "", "https://www.igdb.com/icons/official-site.svg", "https://www.igdb.com/icons/wikia.svg",
        "https://www.igdb.com/icons/wikipedia.svg", "https://www.igdb.com/icons/facebook.svg", "https://www.igdb.com/icons/twitter.svg",
        "https://www.igdb.com/icons/twitch.svg", "https://www.igdb.com/icons/ios-iphone.svg", "https://www.igdb.com/icons/instagram.svg",
        "https://www.igdb.com/icons/youtube.svg","https://www.igdb.com/icons/ios-ipad.svg", "https://www.igdb.com/icons/play-store.svg",
          "https://www.igdb.com/icons/itch.svg","https://www.igdb.com/icons/steam.svg", "https://www.igdb.com/icons/reddit.svg",
        "https://www.igdb.com/icons/epic.svg", "https://www.igdb.com/icons/gog.svg", "https://www.igdb.com/icons/discord.svg"]
        
        return webCodes[temp]

    }

    const updateGameStatus = async (statusNumber : number) => {
        console.log(StatusEnum[statusNumber])
  
        const {data, error} =  await vm.getDB
          .from<LibrarySB>('library')
          .select()
          .eq('user_id', vm.getCurrentUserId || "")
          .eq('game_id', Number(queryParams.get('id')))
  
        console.log( error || "no error")
        console.log(data || "no data")
  
        if(data !== null && data !== undefined) {

          let newData = data
          console.log(data)
          console.log(newData)
          newData[0].status = StatusEnum[statusNumber]
  
          await vm.getDB
            .from<LibrarySB>('library')
            .upsert(data)
        }
  
      }

    return (
        <Box sx={{display: "flex", flexDirection: "column", marginTop: "-5%", alignItems: "center"}}>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{ display: "flex", flexDirection: "column", padding: "1em", maxWidth: "55vh", mr: "5%", ml: "-2%"}}>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <img src={getBigCover(gameData?.cover.url || "")} 
                            style={{ margin: "1%", width:"15em", height:"21em"}}/>

                        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", width: "20em"}}>
                            <Typography variant="h4">{gameData?.name || "?"}</Typography>
                            <Typography variant="h5" color="lightgray">{getCategory(gameData?.category)}</Typography>

                            {(gameData?.platforms) ? 
                                <Typography sx={{width: "20em", mb: "1%", pb:"1%"}}>{getPlatforms(gameData?.platforms || [""])}</Typography>
                            : null}

                            {(gameData?.genres) ? 
                                <>
                                    {gameData?.genres.map((genre, i: number) => {
                                        return (
                                            <Typography sx={{width: "10em"}} key={i}>{genre.name}</Typography>
                                        )
                                    })}
                                </>
                            : null}
                            
                            <Avatar sx={{bgcolor: getScoreColor(), width: "2em", height: "2em"}}>{getRoundedRating(gameData?.total_rating || -1)}</Avatar>
                        </Box>
                    </Box>
                    <Box  sx={{display: "flex", flexDirection: "row", mt: "3%", justifyContent: "flex-start", ml: "-0.5em"}}>
                        
                        {(userLibraryStatus !== "") ?
                            <ChipSelectorStatusTest currentStatus={userLibraryStatus as StatusEnum} readOnlyStatus={false} onChangeStatus={(n: number) => {updateGameStatus(n);}}/>
                        : <ChipSelectorStatusTest currentStatus={selectedStatus} readOnlyStatus={false} onChangeStatus={(statusNumber : number) => {setSelectedStatus(statusNumber)}}/>}
                        
                        {(userLibraryStatus !== "") ?
                            <Chip label="Remove" 
                                sx={{fontWeight: "bold", mt: "1.3em", ml: "-10%", minWidth: "8em", minHeight: "2em", mb: "2%", backgroundColor: '#a02725', color: "white" }}
                                onClick={deleteGame}></Chip>
                        :  (vm.loggedIn)? <Chip label="Add" 
                                sx={{fontWeight: "bold", mt: "1.3em", ml: "-10%", minWidth: "8em", minHeight: "2em", mb: "2%", backgroundColor: '#2196f3', color: "white" }}
                                onClick={addGame}></Chip>
                        :    <Button sx={{fontWeight: "bold", backgroundColor: '#2196f3', ml: "-10%", color: "white", height: "2.5em", width:"10em", borderRadius: "16px", mt: "1.3em", fontSize: "80%",
                                "&.MuiButtonBase-root:hover": {
                                    bgcolor: "#2196f3"
                                } }}
                                ><LoginDialog buttonName={"ADD"}/></Button>
                        }
                        
                        {(gameData?.websites)?
                            <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap",  width:"18em", ml: "4.3em"}}>
                                {gameData?.websites.map((web) => {
                                    return (
                                        <Link href={web.url}>
                                            <img src={getWebsite(web.category)} style={{flex: "0 0 10%", margin: "0.2em", height: "2em"}}/>
                                        </Link>     
                                    )
                                })}
                            </Box>
                        : null}
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", minWidth: "31%"}}>
                        <Box sx={{display: "flex", flexDirection: "row", mt: "5%", ml: "5%"}}>
                            <b>Release date:</b> &nbsp;&nbsp;{unixToDate(gameData?.first_release_date)}
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", mt: "5%", ml: "5%", alignItems: "flex-start"}}>
                            <b>Companies: </b> <p style={{textAlign: "left", marginTop: "-0.1em"}}>{getCompanies()}</p>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>

                    <Typography sx={{fontSize: "2em"}}>Reviews</Typography>
                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <Box sx={{display: "flex", flexDirection: "column", border: "2px solid black", padding: "1%", mt: "2%" }}>
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
                    </Box>
                </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "5%"}}>
                    <Typography sx={{fontSize: "2em", mt: "2%", mb: "1%"}}>Summary</Typography>
                    <Typography variant="body1" sx={{maxWidth: "50em", textAlign: "justify"}}>{gameData?.summary || "No se ha proporcionado informacion."}</Typography>
                    {(gameData?.artworks) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em", mt: "3%", mb: "1%"}}>Artworks</Typography>
                            <Carousel sx={{minWidth: "800px"}}>
                                {gameData?.artworks.map((artwork) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%", height: "540px"}}>
                                            <img
                                                src={getOriginalImage(artwork.url || "")}
                                                style={{width: "800px", height: "500px"}}/>
                                        </Box>
                                    )
                                })}
                            </Carousel>
                        </div> : null}

                    {(gameData?.screenshots) ? 
                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <Typography sx={{fontSize: "2em", mt: "3%", mb: "1%"}}>Screenshots</Typography>
                            <Carousel sx={{minWidth: "800px"}}>
                                {gameData?.screenshots.map((screenshot) => {
                                    return (
                                        <Box sx={{display: "flex", flexDirection: "column", margin: "1%", height: "540px"}}>
                                            <img
                                                src={getOriginalImage(screenshot.url || "")}
                                                style={{width: "800px", height: "500px"}}/>
                                        </Box>
                                    )
                                })}
                            </Carousel>
                        </div> : null}

                    <Box sx={{display: "flex", flexDirection: "row", width: "880px", ml: "0"}}>
                        {(gameData?.similar_games) ? 
                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginRight: "10%"}}>
                                <Typography sx={{fontSize: "2em", mb: "5%", mt: "10%"}}>Similar Games</Typography>
                                <Carousel sx={{minWidth: "200px"}}>
                                    {gameData?.similar_games.map((sg) => {
                                        return (
                                            <RouterLink to={"/game?id=" + sg.id} style={{textDecoration: "none", color: "black"}} onClick={() => {loadData()}}>
                                                <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                                    <img
                                                        src={getBigCover(sg.cover.url || "")}
                                                        style={{width: "200px", height: "320px"}}/>
                                                    <Typography sx={{fontSize: "1.2em", mt: "5%", height: "120px"}}>{sg.name}</Typography>
                                                </Box>
                                            </RouterLink>
                                            
                                        )
                                    })}
                                </Carousel>
                            </div> : null}

                        {(gameData?.dlcs) ? 
                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginRight: "11%"}}>
                                <Typography sx={{fontSize: "2em", mb: "5%", mt: "10%"}}>DLC</Typography>
                                <Carousel sx={{minWidth: "200px"}}>
                                    {gameData?.dlcs.map((dlc) => {
                                        return (
                                            <RouterLink to={"/game?id=" + dlc.id} style={{textDecoration: "none", color: "black"}} onClick={() => {loadData()}}>
                                                <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                                    <img
                                                        src={getBigCover(dlc.cover?.url || "")}
                                                        style={{width: "200px", height: "320px"}}/>
                                                    <Typography sx={{fontSize: "1.2em", mt: "5%", height: "120px"}}>{dlc.name}</Typography>
                                                </Box>
                                            </RouterLink>
                                        )
                                    })}
                                </Carousel>
                            </div> : null}
                        
                        {(gameData?.expansions) ? 
                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                <Typography sx={{fontSize: "2em", mb: "5%", mt: "10%"}}>Expansiones</Typography>
                                <Carousel sx={{minWidth: "200px"}}>
                                    {gameData?.expansions.map((expansion) => {
                                        return (
                                            <RouterLink to={"/game?id=" + expansion.id} style={{textDecoration: "none", color: "black"}} onClick={() => {loadData()}}>
                                                <Box sx={{display: "flex", flexDirection: "column", margin: "1%"}}>
                                                    <img
                                                        src={getBigCover(expansion.cover?.url || "")}
                                                        style={{width: "200px", height: "320px"}}/>
                                                    <Typography sx={{fontSize: "1.2em", mt: "5%", height: "120px"}}>{expansion.name}</Typography>
                                                </Box>
                                            </RouterLink>
                                        )
                                    })}
                                </Carousel>
                            </div> : null}
                    </Box>
                </Box>
            </Box>
        </Box>
    )

}

export default observer(GameView);