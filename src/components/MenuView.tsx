import { Typography } from "@mui/material";
import { Box, width } from "@mui/system";
import logo from "../resources/images/app_icon-playstore-modified.png"

const MenuView = () => {

 return (   
<Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>

    <img src={logo} style={{width: "10%"}}/>
    <Typography variant="h2" sx={{fontFamily: 'Orbitron', fontWeight: 700, mt: "2%"}}>Welcome to:</Typography>
    <Typography variant="h1" sx={{fontFamily: 'Orbitron', fontWeight: 700}}>My Videogame Collection</Typography>
    <Typography variant="h4" sx={{fontFamily: 'Orbitron', fontWeight: 700, mt: "5%"}}>Work in Progress</Typography>


</Box>

)};
export default MenuView