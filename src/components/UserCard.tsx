import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea } from "@mui/material";
import ProfileSB from "../models/ProfileSB";
import { useEffect, useState } from "react";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import { observer } from "mobx-react";
import LibrarySB from "../models/LibrarySB";
import { Link } from "react-router-dom";
import FriendListSB from "../models/FriendListSB";

type Props = {
    userData: ProfileSB,
    style: Object
}

const UserCard = ({userData, style} : Props) =>  {

    const [userGames, setUserGames] = useState(0)
    const [country, setCountry] = useState("")
    const [isAdded, setIsAdded] = useState(false)
    const [isSent, setWasSent] = useState(false)
    const vm = ProfileViewmodel.getInstance()

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

    useEffect(() => {
        loadTotalGames()
        loadCountry()
        isAlreadyAdded()
    }, [userData])

    const loadCountry = () => {
        vm.getDB.from("countries")
            .select('name')
            .eq('id', userData.country!).then((response) => {
                if(response !== null && response !== undefined) {
                    setCountry(response.data![0].name)
                }
            })
    }

    const loadTotalGames = () => {
        vm.getDB.from("library")
            .select()
            .eq('user_id', userData.user_id!).then((response) => {
                if(response !== null && response !== undefined) {
                    setUserGames(response.data!.length)
                }
            })
    }

    const isAlreadyAdded = async () => {

        await vm.getDB.from("friendlist")
            .select().or(`user.eq.${vm.getCurrentUserId},friend.eq.${vm.getCurrentUserId}`)
            .or(`user.eq.${userData.user_id!},friend.eq.${userData.user_id!}`)
            .eq("accepted", true).then((response) => {
                if(response !== null && response !== undefined) {
                    if(response.data?.length === 0) {
                        setIsAdded(false)
                    } else {
                        setIsAdded(true)
                    }
                } else {
                    setIsAdded(false)
                }
            })

        await vm.getDB.from("friendlist")
            .select().eq("user", vm.getCurrentUserId)
            .eq("friend", userData.user_id)
            .eq("accepted", false).then((response) => {
                if(response !== null && response !== undefined) {
                    if(response.data?.length === 0) {
                        setWasSent(false)
                    } else {
                        setWasSent(true)
                    }
                } else {
                    setWasSent(false)
                }
            })

    }

    const addFriend = async () => {

        if(!isAdded && !isSent) {

            const data = await vm.getDB.from<FriendListSB>("friendlist")
                .select()
                .eq("user", userData.user_id! || "")
                .eq("friend", vm.getCurrentUserId || "")
                .eq("accepted", false).then((response) => {
                    return response.data
                })

            if(data !== null && data !== undefined) {
                if (data.length > 0) {
                    await vm.getDB.from<FriendListSB>("friendlist")
                        .upsert({user: data[0].user, friend: data[0].friend, accepted: true})
                } else {
                    await vm.getDB.from<FriendListSB>("friendlist")
                        .upsert({user: vm.getCurrentUserId!, friend: userData.user_id!, accepted: false})
                }

                isAlreadyAdded()
            }
        }
    } 

    const removeFriend = async () => {
        if(isAdded) {

            const data = await vm.getDB.from<FriendListSB>("friendlist")
                .select().or(`user.eq.${vm.getCurrentUserId},friend.eq.${vm.getCurrentUserId}`)
                .or(`user.eq.${userData.user_id!},friend.eq.${userData.user_id!}`)
                .eq("accepted", true).then((response) => {
                    return response.data
                })

            if(data !== null) {
                vm.getDB.from<FriendListSB>("friendlist")
                .delete()
                .eq("user", data[0].user || "")
                .eq("friend", data[0].friend || "")

                isAlreadyAdded()
            }
        }
    }

    return (
        <Card sx={style}>
            <Box sx={{display: "flex", flexDirection: "column", m: "5px", width: "100%"}}>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <div style={{overflow: "hidden"}}>
                        <CardMedia
                        component="img"
                        image={userData.avatar_url}
                        alt="user pfp"
                        sx={{ 
                            width: "10em", height: "10em",
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
                        <Typography variant="body1" color={gamesColor()} sx={{fontWeight: 700}}>
                            Games: {userGames}
                        </Typography>
                        {(country !== ' ')? 
                            <Typography variant="body1" sx={{fontWeight: 700}}>
                                Country: {country}
                            </Typography>
                        : null}
                    </CardContent>
                </Box>
                
                <Box sx={{display: "flex", flexDirection: "row", m: "1px", mt: "2px", height: "100%"}}>
                    {(userData.description !== "") ? 
                        <Typography variant="body1" textAlign={"left"}>
                            <b>Description:</b> <br/>{userData.description!}
                        </Typography>
                    : null}
                </Box>
                <Box sx={{display: "flex", flexDirection: "column-reverse", mt: "0.8em"}}>
                    <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                        <Link to={"/library?uid=" + userData.user_id} style={{textDecoration: "none"}}><Button sx={{backgroundColor: '#1769aa', color: "white"}}>Visit Library</Button></Link>
                        <Link to={"/friends?uid=" + userData.user_id} style={{textDecoration: "none"}}><Button sx={{backgroundColor: '#673ab7', color: "white"}}>Friends</Button></Link>
                        {(isAdded && vm.loggedIn)?
                            <Button sx={{backgroundColor: '#a02725', color: "white"}} onClick={removeFriend}>Delete Friend</Button>
                        : (!isSent && vm.loggedIn)?
                            <Button sx={{backgroundColor: '#357a38', color: "white"}} onClick={addFriend}>Add Friend</Button>
                        : ( vm.loggedIn)?
                            <Button sx={{backgroundColor: 'lightgray', color: "white"}} >Already Sent</Button>
                        : null}
                    </Box> 
                </Box>
            </Box>
        </Card>
    );
}

export default observer(UserCard)