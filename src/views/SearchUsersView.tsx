import { Box, InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import ProfileViewModel from "../viewmodels/ProfileViewmodel"
import UserCard from "../components/UserCard";
import ProfileSB from "../models/ProfileSB";


const SearchUsersView = () => {

    const [currentUsers, setUsers] = useState<ProfileSB[]>()
    const vm = ProfileViewModel.getInstance()

    const searchSubmit = (e : any) => {
        if(e.keyCode === 13){
            search(e.target.value).then(response => setUsers(response || []))
        }
    }

    const search = async (usrnm: string) => {

        let {data} = await vm.getDB
            .from<ProfileSB>('profile')
            .select()
            .ilike('username', "%" + usrnm + "%")
    
        console.log(data)
        return data

    }

    return (
        <>
            <Box mt={"1rem"} mb={"1rem"} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField 
                InputProps={{ endAdornment: (<InputAdornment position="end"><SearchIcon /></InputAdornment>) }}
                label="Search users..."
                size="small"
                sx={{ width: '30%', "label": { fontStyle: 'italic' } }}
                onKeyDown={searchSubmit}></TextField>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "2%"}}>
                {currentUsers?.map((user: ProfileSB, i) => {
                    return (
                        <UserCard userData={user} key={i}
                            style={{maxWidth: "25em", minWidth: "25em", margin: "1%", border: "1px solid black"}}/>
                    )
                })}
            </Box>
        </>
    )

}

export default SearchUsersView 