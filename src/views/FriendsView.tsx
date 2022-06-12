import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import ProfileSB from "../models/ProfileSB";
import { wait } from "@testing-library/user-event/dist/utils";
import ProfileViewModel from "../viewmodels/ProfileViewmodel"
import { observer } from "mobx-react";
import UserCard from "../components/UserCard";

const SearchUsersView = () => {

    const [currentUsers, setUsers] = useState<ProfileSB[]>()
    const [currentUName, setUName] = useState("");
    const queryParams = new URLSearchParams(window.location.search);
    const vm = ProfileViewModel.getInstance()

    useEffect(() => {

        wait(1000).then(() => {
            getFriendList().then(response => getFriendsData(response || []))
            getCurrentUsername().then(response => setUName(response || ""))
        })
        
    }, []);

    const getFriendList = async () => {

        let currentUser = queryParams.get('uid') || ""

        let {data} = await vm.getDB
            .from('friendlist')
            .select()
            .or('user.eq.' + currentUser + ',friend.eq.' + currentUser)

        return data?.filter(friend => friend.accepted === true).map((friend) => (friend.user === currentUser) ? friend.friend : friend.user)

    }

    const getFriendsData = async (friends : Array<string>) => {

        let fl : ProfileSB[] = []

        friends.forEach(async (element) => {
            let {data} = await vm.getDB
                .from<ProfileSB>('profile')
                .select()
                .eq("user_id", element).single()

            fl.push(data!)

        })

        wait(1000).then(() => {
            setUsers(fl)
        })
        
    }
    
    
    const getCurrentUsername = async () => {
        let {data} = await vm.getDB
              .from<ProfileSB>('profile')
              .select().eq('user_id', queryParams.get('uid') || "").single()
      
              return data!.username!.toString()
      }

    return (
        <Box>
            <Typography fontSize={"2em"} sx={{mb: "5%"}}>{currentUName + " Friends"}</Typography>
            <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                {currentUsers?.map((user: ProfileSB, i) => {
                    return (
                        <UserCard userData={user} key={i}
                                style={{maxWidth: "25em", minWidth: "25em", margin: "1%", border: "1px solid black"}}/>
                    )
                })}
            </Box>
        </Box>
    )

}

export default observer(SearchUsersView); 