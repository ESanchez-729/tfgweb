import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import beluga from "../resources/images/beluga.jpg";
import {Link} from 'react-router-dom';
import { useState, MouseEvent, useEffect } from 'react';
import ProfileViewmodel from '../viewmodels/ProfileViewmodel';
import { Drawer, List, ListItem, ListItemText, Button, Card, CardContent, CardMedia } from '@mui/material';
import LoginDialog from './LoginDialog';
import { observer } from 'mobx-react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NewNotificationIcon from '@mui/icons-material/NotificationImportant';
import EditProfileDialog from './EditProfileDialog';

const pages = ['Search Games', 'Search Users', 'Library', 'Friends'];
const links = ['/search_games', '/search_users', '/library', '/friends'];

const NavBar = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [country, setCountry] = useState("")

  const vm = ProfileViewmodel.getInstance()

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  var settings : string[] = []
  var settingsLinks : string[] = []

  if (vm.isLoggedIn) {
    settings = ['Profile', 'Log Out'];
    settingsLinks = ['/profile', '/logout'];
  } else {
    settings = ['Log In'];
    settingsLinks = ['/login'];
  }

  useEffect(() => {
    loadCountry()
  }, [])

  const loadCountry = () => {
      vm.getDB.from("countries")
          .select('name')
          .eq('id', vm.getCurrentCompleteUser.country || 0).then((response) => {
              if(response !== null && response !== undefined) {
                  setCountry(response.data![0].name)
              }
          })
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Orbitron',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MY VIDEOGAME COLLECTION
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
           {pages.map((page, index) => {
              if( (links[index] === "/library" || links[index] === "/friends") && !vm.isLoggedIn){
                return (
                  <LoginDialog buttonName={page} key={index}/>
                )
              } else if(links[index] === "/library" || links[index] === "/friends") {
                return (
                  <Link to={links[index] + "?uid=" + vm.getCurrentUserId} key={index} style={{textDecoration: "none", color: "white"}}>
                    <ListItem button>
                      <ListItemText primary={page} />
                    </ListItem>
                  </Link>
                )
              } else {
                return (
                  <Link to={links[index]} key={index} style={{textDecoration: "none", color: "white"}}>
                    <ListItem button>
                      <ListItemText primary={page} />
                    </ListItem>
                  </Link>
                )
              }
            })}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => { setDrawerOpen(true) }}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => { setDrawerOpen(false) }}
            >
              <Box
                role="presentation"
                onClick={() => { setDrawerOpen(false) }}
                onKeyDown={() => { setDrawerOpen(false) }}
              >
                <List>
                  {pages.map((page, index) => {
                    if( (links[index] === "/library" || links[index] === "/friends") && !vm.isLoggedIn){
                      return (
                        <LoginDialog buttonName={page} key={index}/>
                      )
                    } else if(links[index] === "/library" || links[index] === "/friends") {
                      return (
                        <Link to={links[index] + "?uid=" + vm.getCurrentUserId} key={index} style={{textDecoration: "none", color: "black"}}>
                          <ListItem button>
                            <ListItemText primary={page} />
                          </ListItem>
                        </Link>
                      )
                    } else {
                      return (
                        <Link to={links[index]} key={index} style={{textDecoration: "none", color: "black"}}>
                          <ListItem button>
                            <ListItemText primary={page}/>
                          </ListItem>
                        </Link>
                      )
                    }
                  })}
                </List>
              </Box>
            </Drawer>
          </Box>

          <SportsEsportsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h4"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Orbitron',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MyVC
          </Typography>

          <Box sx={{ flexGrow: 0}}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Pfp" src={vm.getCurrentProfilePic || beluga} sx={{border: "3px solid #ffffff" }}/>
            </IconButton>
            <Menu
              sx={{
                mt: '40px', "& .MuiPaper-root": {
                  backgroundColor: "#404445",
                  color: 'white',
                  border: '1px solid #03d7fc',
                  width: "min-content"
                }
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, i) => {
                if(settingsLinks[i] === "/login") {
                  return (
                    <LoginDialog buttonName={setting} key={i}/>
                  )
                } else if(settingsLinks[i] === "/profile" && vm.loggedIn) {
                  return (
                      <Box sx={{display: "flex", flexDirection: "column", m: "1em", width: "100%", mr: "5em"}}>
                        <Box sx={{display: "flex", flexDirection: "row"}}>
                          <img
                            src={vm.getCurrentCompleteUser.avatar_url}
                            alt="user pfp"
                            style={{ 
                                width: "8em", height: "8em",
                            }}
                            className="pfpUserImage"
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems:"flex-start",
                                    ml: "0.5em"
                                }}
                                >
                                <Typography gutterBottom variant="h5" component="div" sx={{fontFamily: 'Helvetica', color: "white", fontWeight: "bold"}}>
                                    {vm.getCurrentCompleteUser.username}
                                </Typography>
                                {(country !== ' ')? 
                                    <Typography variant="body1">
                                        <b>Country:</b> {country}
                                    </Typography>
                                : null}
                                {/*<Avatar sx={{ml: "50%", mt: "7%", backgroundColor: "transparent"}}>
                                  {(true)? <NotificationsIcon sx={{color: "lightgray", transform: "scale(1.3)"}}/> : <NewNotificationIcon sx={{color: "gold", transform: "scale(1.3)"}}/>}
                              </Avatar>*/}
                            </Box>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", m: "1px", mt: "2px", height: "13.2em", justifyContent: "space-between"}}>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                              {(vm.getCurrentCompleteUser.description !== "") ? 
                                  <Typography variant="body1" textAlign={"left"} mt={"3%"} sx={{ display: "inline"}}>
                                      <b>Description:</b> <br/>{vm.getCurrentCompleteUser.description!}
                                  </Typography>
                              : null}
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "column-reverse", mt: "0.8em"}}>
                              <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                                <EditProfileDialog/>
                                <Button sx={{backgroundColor: '#a02725', color: "white"}} onClick={() => {vm.deleteLoggedUser()}}>Log Out</Button>
                              </Box> 
                            </Box>
                        </Box>
                    </Box>
                  )
                }
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default observer(NavBar);