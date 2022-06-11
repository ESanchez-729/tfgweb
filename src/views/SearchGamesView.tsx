import { Box, InputAdornment, Pagination, Tab, Tabs, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import {useEffect, useState, SyntheticEvent, ChangeEvent} from 'react';
import { wait } from "@testing-library/user-event/dist/utils";
import GameCard from "../components/GameCard";
import Tilt from 'react-parallax-tilt';
import GameSB from "../models/GameSB";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const itemsPerPage = 30
const totalSearchedItems = 300

const SearchGamesView = () => {

    const [value, setValue] = useState(-1);
    const [currentData, setCurrentData] = useState<GameSB[]>([]);
    const [totalData, setTotalData] = useState<GameSB[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showPagination, setShowPagination] = useState(false);

    const vm = ProfileViewmodel.getInstance()

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    const searchSubmit = async (e : any) => {
        if(e.keyCode === 13 && e.target.value.trim() !== ""){
            setValue(-1)
            console.clear()
            console.log("submit: " + e.target.value)

            await vm.getDB.functions.invoke('IGDBGamesByName', { body: JSON.stringify({"game_name": e.target.value, "limit": totalSearchedItems})})
                .then((response => {
                    if(response !== null && response !== undefined) {
                    
                        let tempArray : GameSB[] = []
                        response.data.map( (element : any) => {
                            let betterCover : string
                            if(element.cover) {betterCover = getBigCover(element.cover.url)} else {betterCover = getBigCover("")}

                            let platforms : string = getPlatforms(element.platforms)
                            let roundedRating : number = getRoundedRating(element.total_rating)
                            tempArray.push({game_id: element.id, name: element.name, cover: betterCover, platforms: platforms, total_rating: roundedRating})
                        })

                        setTotalData(tempArray)
                        setTotalPages(Math.ceil(tempArray.length / itemsPerPage))
                        setShowPagination(true)
                        let newData = tempArray.slice(0, itemsPerPage)
                        setCurrentData(newData)
                        setCurrentPage(1)

                    }

                }))
            
        }
    }

    const onSelectLetter = async (letter : string) => {

        await vm.getDB.functions.invoke('IGDBGamesByFirstChar', { body: JSON.stringify({"first_char": letter, "limit": totalSearchedItems})})
            .then((response => {
                if(response !== null && response !== undefined) {
                
                    let tempArray : GameSB[] = []
                    response.data.map( (element : any) => {
                        let betterCover : string
                        if(element.cover) {betterCover = getBigCover(element.cover.url)} else {betterCover = getBigCover("")}

                        let platforms : string = getPlatforms(element.platforms)
                        let roundedRating : number = getRoundedRating(element.total_rating)
                        tempArray.push({game_id: element.id, name: element.name, cover: betterCover, platforms: platforms, total_rating: roundedRating})
                    })

                    setTotalData(tempArray)
                    setTotalPages(Math.ceil(tempArray.length / itemsPerPage))
                    setShowPagination(true)
                    let newData = tempArray.slice(0, itemsPerPage)
                    setCurrentData(newData)
                    setCurrentPage(1)

                }

            }))
            
        
    }

    const selectPage = (value: number) => {
        
        let elementNumber = (value - 1 ) * itemsPerPage
        let newData = totalData.slice(elementNumber, elementNumber + itemsPerPage)
        setCurrentData(newData)
        setCurrentPage(value)
         
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

        return finalPlatform

    }

    const getRoundedRating = (rating: number) => {

        if (rating === null || rating === undefined) {
            return -1
        }

        return Math.round(rating)

    }

    useEffect(() => {
        wait(500).then(() => {
            console.clear()
        })
    }, [])

    return (
        <Box>
            <Box mt={"1rem"} mb={"1rem"} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField InputProps={{ endAdornment: (<InputAdornment position="end"><SearchIcon /></InputAdornment>) }}
                    label="Search games..." size="small" sx={{ width: '30%', "label": { fontStyle: 'italic' } }}
                    onKeyDown={searchSubmit}></TextField>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignSelf: "center", alignContent: "center", alignItems: "center"}}>
                <Tabs sx={{maxWidth: "50em"}}
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example">
                    <Tab value={-1} sx={{display: "none"}} key={0}></Tab>
                    {alphabet.map((tab, i) => {

                        return (

                            <Tab label={tab} key={i} onClick={() => {
                                setValue(i + 1);
                                onSelectLetter(tab)
                            }}></Tab>
                        )
                    }
                    )}

                </Tabs>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", alignItems:"center", justifyContent: "center", marginTop: "3%"}}>
                {currentData?.map((item : any, i: number) => {
                    return(
                        <Tilt tiltAxis="y" glareEnable={true} glareMaxOpacity={0.1} tiltReverse={true}>
                            <GameCard 
                                title={item.name}
                                cover={item.cover}
                                platforms={item.platforms}
                                score={item.total_rating}
                                key={item.game_id}
                                style={{
                                width: 200,
                                m: 3,
                                height: "17em",
                                maxHeight: "420px",
                                minHeight: "420px"
                                }}
                                imageSize={250}/>
                        </Tilt>
                    )
                })}
            </Box>
            {showPagination? <Pagination count={totalPages} page={currentPage}
                sx={{".css-wjh20t-MuiPagination-ul": {justifyContent: "center", marginBottom: "2%", marginTop: "1%"}}}
                onChange={(event: ChangeEvent<unknown>, value: number) => {selectPage(value)}} /> : null }
        </Box>
    )

}

export default SearchGamesView 