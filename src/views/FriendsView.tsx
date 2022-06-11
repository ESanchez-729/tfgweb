import { Box, InputAdornment, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import ProfileSB from "../models/ProfileSB";
import { wait } from "@testing-library/user-event/dist/utils";
import ProfileViewModel from "../viewmodels/ProfileViewmodel"
import { observer } from "mobx-react";
import UserCard from "../components/UserCard";

type MiniProfile = {

    user_id : string,
    library :string[],
    username: string,
    avatar_url: string,

}

const SearchUsersView = () => {

    const [currentUsers, setUsers] = useState<MiniProfile[]>()
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

        let fl : MiniProfile[] = []

        friends.forEach(async (element) => {
            let {data} = await vm.getDB
                .from<MiniProfile>('profile')
                .select('user_id, username, avatar_url, library(user_id)')
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
        <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            <Typography fontSize={"2em"} sx={{mb: "5%"}}>{currentUName + " Friends"}</Typography>
            {currentUsers?.map((user, i) => {
                return (
                    <UserCard userPfp={user.avatar_url} userName={user.username} userGames={user.library.length} key={i}
                            style={{maxWidth: "25em", minWidth: "25em", margin: "1%", border: "1px solid black"}}/>
                )
            })}
        </Box>
    )

}

export default observer(SearchUsersView); 