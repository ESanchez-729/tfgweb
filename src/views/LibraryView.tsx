import { SyntheticEvent, useEffect, useState } from "react";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import { observer } from "mobx-react";
import ChipSelectorStatusTest from "../components/ChipSelectorStatusTest";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tab, Tabs, Typography } from "@mui/material";
import StatusEnum from "../models/enums/StatusEnum";
import { wait } from "@testing-library/user-event/dist/utils";
import ProfileSB from "../models/ProfileSB";
import LibrarySB from "../models/LibrarySB";
import { Link } from "react-router-dom";

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

const tabMenuOptions = [
  {name:"All", reference: -1}, 
  {name:"Playing", reference: 2} , 
  {name:"Completed", reference: 3}, 
  {name:"On Hold", reference: 4}, 
  {name:"Dropped", reference: 1}, 
  {name:"Plan To Play", reference: 0}];

const LibraryView = () => {

    const [currentData, setData] = useState<item[]>();
    const [currentUName, setUName] = useState("");
    const [currentGameQ, setGameQ] = useState(0);
    const [value, setValue] = useState(0);
    const queryParams = new URLSearchParams(window.location.search);
    const vm = ProfileViewmodel.getInstance()
  
    useEffect(() => {

        wait(1000).then(() => {
            console.log("start")
            console.log(queryParams.get('uid'))
            select().then(response => setData(response || []))
            getCurrentUsername().then(response => setUName(response || ""))
        })
        
    }, [queryParams.get('uid')]);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const select = async () => {
      
      let {data} = await vm.getDB
      .from<item>('library')
      .select('status, game(game_id, name, cover)').eq('user_id', queryParams.get('uid') || "")

      setGameQ(data?.length || 0)

      console.log(data)
      return data

    }

    const selectWithStatus = async (reference : number) => {
      
      let {data} = await vm.getDB
      .from<item>('library')
      .select('status, game(game_id, name, cover)')
      .eq('user_id', queryParams.get('uid') || "")
      .eq('status', StatusEnum[reference])

      setGameQ(data?.length || 0)

      console.log(data)
      setData(data || [])

    }

    const getCurrentUsername = async () => {
      let {data} = await vm.getDB
            .from<ProfileSB>('profile')
            .select().eq('user_id', queryParams.get('uid') || "").single()
    
            console.log(data)
            return data!.username!.toString()
    }

    const updateGameStatus = async (statusNumber : number, gameID : number) => {
      console.log(StatusEnum[statusNumber])

      const {data, error} =  await vm.getDB
        .from<LibrarySB>('library')
        .select()
        .eq('user_id', queryParams.get('uid') || "")
        .eq('game_id', gameID)

      console.log( error || "no error")
      console.log(data || "no data")

      if(data !== null && data !== undefined) {

        let newData = data
        newData[0].status = StatusEnum[statusNumber]

        await vm.getDB
          .from('library')
          .upsert(data)
      }

    }

    const deleteGame = async (gameID: number) => {
      await vm.getDB
        .from<LibrarySB>('library')
        .delete()
        .eq('user_id', queryParams.get('uid') || "")
        .eq('game_id', gameID)

      select().then(response => setData(response || []))
      getCurrentUsername().then(response => setUName(response || ""))

    }
  
    return (
      <Box>
        <Typography fontSize={"2em"} sx={{mb: "1%"}}>{currentUName + " Games"}</Typography>
        <Typography fontSize={"1.5em"} sx={{mb: "5%"}}>{"Size: " + currentGameQ}</Typography>
        <Tabs sx={{maxWidth: "5px", display: "contents", ".css-jpln7h-MuiTabs-scroller": {width: "50%", "@media only screen and (max-width: 1000px)": {width: "100%"}}}}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="statusSelection">
          {tabMenuOptions.map((tab, i) => {

              return (

                  <Tab label={tab.name} key={i} onClick={() => {
                    if(i === 0) {
                      select().then(response => setData(response || []))
                    } else {
                      selectWithStatus(tab.reference)
                    }
                  }}
                    sx={{"@media only screen and (max-width: 500px)": {fontSize:"50%", padding: 0, minWidth: 0}}}></Tab>
              )
          }
          )}

        </Tabs>
        <TableContainer component={Paper} sx={{mt: "3%"}}>
          <Table sx={{
              minWidth: 650,
              "@media only screen and (min-width: 992px)": {
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }
              }} aria-label="simple table" >
            <TableBody>
              {currentData?.map((item:any, i: number) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right" key={"cover " + item.name}>
                    <Link to={"/game?id=" + item.game.game_id}>
                      <img alt="game cover" src={item.game.cover} style={{width: "6em", height: "9em"}}/>
                    </Link>
                  </TableCell>
                  <TableCell align="left" key={"title " + item.name}>
                    <Link to={"/game?id=" + item.game.game_id} style={{textDecoration: 'none'}}>
                      <Typography sx={{color: "black", marginLeft: "1em", fontSize: "150%"}}>{item.game.name}</Typography>
                    </Link>
                  </TableCell>
                  <TableCell align="right" key={"status " + item.name}>
                    <ChipSelectorStatusTest 
                      currentStatus={StatusEnum[item.status as keyof typeof StatusEnum]}
                      readOnlyStatus={queryParams.get('uid') !== vm.getCurrentUserId}
                      onChangeStatus={(n: number) => {updateGameStatus(n, item.game.game_id);}}/>
                  </TableCell>
                  {(queryParams.get('uid') === vm.getCurrentUserId)?
                    <TableCell align="left" key={"delete " + i}>
                      <Button variant="contained" color="error" sx={{backgroundColor: '#a02725'}} onClick={() => {deleteGame(item.game.game_id)}}>Delete</Button>
                    </TableCell> : null}
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  export default observer(LibraryView);