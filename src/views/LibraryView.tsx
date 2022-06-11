import { useEffect, useState } from "react";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import { observer } from "mobx-react";
import ChipSelectorStatusTest from "../components/ChipSelectorStatusTest";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import StatusEnum from "../models/enums/StatusEnum";
import { wait } from "@testing-library/user-event/dist/utils";
import ProfileSB from "../models/ProfileSB";

type game = {

  user_id : string,
  game_id : number,
  name: string,
  cover: string

}

type item = {

    user_id : string,
    status : string,
    game : game
  
  }

const LibraryView = () => {

    const [currentData, setData] = useState<item[]>();
    const [currentUName, setUName] = useState("");
    const queryParams = new URLSearchParams(window.location.search);
    const vm = ProfileViewmodel.getInstance()
  
    useEffect(() => {

        wait(1000).then(() => {
            console.log("start")
            console.log(queryParams.get('uid'))
            select().then(response => setData(response || []))
            getCurrentUsername().then(response => setUName(response || ""))
        })
        
    }, []);

    const select = async () => {
      
      if(vm.isLoggedIn) {
            let {data} = await vm.getDB
            .from<item>('library')
            .select('status, game(game_id, name, cover)').eq('user_id', queryParams.get('uid') || "")
    
            console.log(data)
            return data

       } 

    }

    const getCurrentUsername = async () => {
      let {data} = await vm.getDB
            .from<ProfileSB>('profile')
            .select().eq('user_id', queryParams.get('uid') || "").single()
    
            console.log(data)
            return data!.username!.toString()
    }
  
    return (
      <Box>
        <Typography fontSize={"2em"} sx={{mb: "5%"}}>{currentUName + " Games"}</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {currentData?.map((item:any, i: number) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left" key={"cover " + item.name}><img alt="game cover" src={item.game.cover} style={{width: "6em", height: "9em"}}/></TableCell>
                  <TableCell align="left" key={"title " + item.name}><Typography sx={{color: "black", marginLeft: "1em", fontSize: 16}}>{item.game.name}</Typography></TableCell>
                  <TableCell align="right" key={"status " + item.name}>
                    <ChipSelectorStatusTest currentStatus={StatusEnum[item.status as keyof typeof StatusEnum]} readOnlyStatus={queryParams.get('uid') !== vm.getCurrentUserId}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  export default observer(LibraryView);