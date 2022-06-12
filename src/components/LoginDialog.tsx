import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { MenuItem, TextField } from "@mui/material";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import CookieManager from "../util/CookieManager";

type Props = {
  buttonName : string
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "rgb(33, 33, 33)",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "space-evenly",
  borderRadius: "2em"
};

const txtInputStyle = {
  mt: "15%",
  "& .MuiFormLabel-root": {
    color: "white"
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  "& .MuiOutlinedInput-root": {
    input: { color: "white" },
    "& fieldset": {
      borderColor: "white"
    },
    "&.Mui-focused fieldset": {
      borderColor: "white"
    },
    "&:hover fieldset": {
      borderColor: "white"
    }
  }
};

export default function LoginDialog({buttonName} : Props) {

  const [open, setOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerEmail, setRegisterEmail] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("")

  const vm = ProfileViewmodel.getInstance()

  const submitLogin = async () => {
      const { session, error } = await vm.getDB.auth.signIn({
          email: loginEmail,
          password: loginPassword,
        })

        if (session !== undefined && session !== null) {

          CookieManager.setCookie("SBAccessToken", session!.access_token, 10)//10 horas
          CookieManager.setCookie("SBRefreshToken", session!.refresh_token!, 4320)//180 dias
          vm.requestLoggedUser()

        } else if (error !== undefined) {
            console.log(error)
        }

        setOpen(false)

  }

  const submitRegister = async () => {
    if (verifyRegisterData()) {
      const {user, session, error } = await vm.getDB.auth.signUp({
        email: registerEmail,
        password: registerPassword,
      })

      if (session !== undefined && session !== null && user !== undefined && user !== null) {

        const { data, error } = await vm.getDB
          .from('profile')
          .insert([
            { user_id: user.id, username: registerUsername,
              avatar_url: "https://avatars.cloudflare.steamstatic.com/724bb41a602d6540c0cf83d52f503bb74262bb17_full.jpg",
              description: "", country: 0, related_accounts: [] }
          ])

          if(error !== undefined && error !== null) {
            console.log(error)
          } else if (data !== null && data !== undefined) {

            const { session, error } = await vm.getDB.auth.signIn({
              email: registerEmail,
              password: registerPassword,
            })
      
            if (session !== undefined && session !== null) {
      
              CookieManager.setCookie("SBAccessToken", session!.access_token, 10)//10 horas
              CookieManager.setCookie("SBRefreshToken", session!.refresh_token!, 4320)//180 dias
              vm.requestLoggedUser()
      
            } else if (error !== undefined) {
                console.log(error)
            }
      
            setOpen(false)
          }

      } else if (error !== undefined) {
        console.log(error)
      }

    }
  }

  const verifyRegisterData = () : boolean => {
    return (registerPassword === registerPasswordConfirm &&
      registerEmail.includes('@') &&
      registerEmail.includes('.') &&
      registerUsername.trim() !== "" &&
      registerUsername.length < 16 &&
      registerPassword.length > 6)
  }

  return (
    <div style={{display: "flex"}}>
      <MenuItem
        onClick={() => {
          setOpen(true);
        }}
      >
        <Typography textAlign="center">
          {buttonName}
        </Typography>
      </MenuItem>
      <Modal
        keepMounted
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Box>
            <Typography sx={{fontSize: "200%"}}>
              Log In
            </Typography>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <br/>
              <TextField
                sx={txtInputStyle}
                label="Email"
                variant="outlined"
                autoComplete="off"
                name="loginEmail"
                onChange={(e) => {
                    setLoginEmail(e.currentTarget.value)
                }}
              />
              <TextField
                sx={txtInputStyle}
                label="Password"
                type="password"
                variant="outlined"
                autoComplete="off"
                name="loginPassword"
                onChange={(e) => {
                    setLoginPassword(e.currentTarget.value)
                }}
              />
              <Button
                type="submit"
                variant="contained"
                onClick={(e) => {
                    e.preventDefault()
                    console.log("login")
                    submitLogin()
                }}
                sx={{ mt: "25%" }}
              >
                ENTER
              </Button>
            </Box>
          </Box>
          <Divider
            variant="middle"
            sx={{ background: "white", width: "1px" }}
          />
          <Box>
            <Typography  sx={{fontSize: "200%"}}>
              Sign In
            </Typography>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <TextField
                sx={txtInputStyle}
                label="Email"
                variant="outlined"
                autoComplete="off"
                onChange={(e) => {
                    setRegisterEmail(e.currentTarget.value)
                }}
              />
              <TextField
                sx={txtInputStyle}
                label="Username"
                variant="outlined"
                autoComplete="off"
                onChange={(e) => {
                    setRegisterUsername(e.currentTarget.value)
                }}
              />
              <TextField
                sx={txtInputStyle}
                label="Password"
                type="password"
                variant="outlined"
                autoComplete="off"
                onChange={(e) => {
                    setRegisterPassword(e.currentTarget.value)
                }}
              />
              <TextField
                sx={txtInputStyle}
                label="Confirm Password"
                type="password"
                variant="outlined"
                autoComplete="off"
                onChange={(e) => {
                    setRegisterPasswordConfirm(e.currentTarget.value)
                }}
              />
              <Button
                type="submit"
                variant="contained"
                onClick={(e) => {
                    e.preventDefault()
                    submitRegister()
                }}
                sx={{ mt: "15%" }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
