import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import ProfileViewmodel from "../viewmodels/ProfileViewmodel";
import CookieManager from "../util/CookieManager";
import { observer } from "mobx-react";
import ProfileSB from "../models/ProfileSB";

type SimpleCountry = {
  id: number,
  name: string
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

const EditProfileDialog = () => {

  const [open, setOpen] = useState(false);
  const vm = ProfileViewmodel.getInstance()

  const [country, setCountry] = useState("")
  const [newUsername, setNewUsername] = useState(vm.getCurrentCompleteUser.username)
  const [newDescription, setNewDescription] = useState(vm.getCurrentCompleteUser.description)
  const [newPfp, setNewPfp] = useState(vm.getCurrentCompleteUser.avatar_url)
  const [allCountries, setAllCountries] = useState<SimpleCountry[]>([])
  const [allCountryNames, setAllCountryNames] = useState<string[]>([])
  const [newCountry, setNewCountry] = useState(country)

  useEffect(() => {
    loadCountry()
    loadCountries()
    setNewUsername(vm.getCurrentCompleteUser.username)
    setNewDescription(vm.getCurrentCompleteUser.description)
    setNewPfp(vm.getCurrentCompleteUser.avatar_url)
    setNewCountry(country)
  }, [open])

  const loadCountry = () => {
    vm.getDB.from("countries")
        .select('name')
        .eq('id', vm.getCurrentCompleteUser.country || 0).then((response) => {
            if(response !== null && response !== undefined) {
                setCountry(response.data![0].name)
            }
        })
  }

  const loadCountries = () => {
    vm.getDB.from<SimpleCountry>("countries")
        .select('id, name')
        .then((response) => {
            if(response !== null && response !== undefined) {
                setAllCountries(response.data || [])
                setAllCountryNames(allCountries.map(x => x.name))
            }
        })
  }

  const getCountryIdByName = (cname : string) => {
    const result = allCountries.filter(item => item.name === cname)
    if (result.length > 0) {
      return result[0].id
    }
    return ""
  }

  const isImage = () => {
    if (newPfp?.includes(".jpeg") || newPfp?.includes(".jpg") || newPfp?.includes(".png")) {
      return true
    } else {
      return false
    }
  }

  const submit = async () => {
    if (newCountry !== null &&
        newUsername?.trim() !== "" &&
        newPfp?.trim() !== "" &&
        newPfp?.includes(".") &&
        isImage()) {

          await vm.getDB.from<ProfileSB>("profile")
            .upsert({user_id: vm.getCurrentUserId, related_accounts: [],
                    username: newUsername, avatar_url: newPfp,
                    description: newDescription, country: getCountryIdByName(newCountry) || 0})

        }
  }

  return (
    <div style={{display: "flex"}}>
        <Button variant="contained" onClick={() => {setOpen(true);}}>
          EDIT PROFILE
        </Button>
      <Modal
        keepMounted
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Box sx={{display: "flex", flexDirection: "column", minWidth: "100%"}}>
            <Typography sx={{fontSize: "200%"}}>
              Edit Profile
            </Typography>
                <Typography sx={{fontSize: "150%", mt: "1em"}}>
                  Username:
                </Typography>
                <TextField variant="outlined" value={newUsername}
                  sx={{minWidth: "100%",
                  ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                    color: "white"}
                  }}
                  onChange={(e) => {setNewUsername(e.target.value);}}
                  inputProps={{maxLength: 15}}
                ></TextField>
              <Typography sx={{fontSize: "150%", mt: "1em"}}>
                Profile Picture URL
              </Typography>
              <TextField variant="outlined" value={newPfp}
                  sx={{minWidth: "100%",
                  ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                    color: "white"}
                  }}
                  onChange={(e) => {setNewPfp(e.target.value)}}
              ></TextField>
              <Typography sx={{fontSize: "150%", mt: "1em"}}>
                Description:
              </Typography>
              <TextField
                multiline
                rows={10}
                value={newDescription}
                variant="outlined"
                sx={{minWidth: "100%",
                ".css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": {
                  color: "white"
                }
                }}
                onChange={(e) => {setNewDescription(e.target.value)}}
                inputProps={{maxLength: 75}}
              />
              <Typography sx={{fontSize: "150%", mt: "1em"}}>
                Country:
              </Typography>
              <Autocomplete
                disablePortal
                options={allCountryNames}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="" />}
                onChange={(event, values) => {setNewCountry(values || "")}}
              />
              <Button
                type="submit"
                variant="contained"
                onClick={(e) => {
                    e.preventDefault()
                    submit()
                    setOpen(false)
                }}
                sx={{ mt: "5%", width: "40%" }}
              >
                Post
              </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default observer(EditProfileDialog)