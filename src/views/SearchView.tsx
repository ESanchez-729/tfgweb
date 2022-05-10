import { Box, InputAdornment, Tab, Tabs, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import {useState} from 'react';


const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const SearchView = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    return (

        <Box>
            <Box mt={"1rem"} mb={"1rem"} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField InputProps={{ endAdornment: (<InputAdornment position="end"><SearchIcon /></InputAdornment>) }} label="Search games..." size="small" sx={{ width: '30%', "label": { fontStyle: 'italic' } }}></TextField>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignSelf: "center", alignContent: "center", alignItems: "center"}}>
                <Tabs sx={{maxWidth: "50em"}}
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example">

                    {alphabet.map((tab, i) => {

                        return (

                            <Tab label={tab}></Tab>
                        )
                    }
                    )}

                </Tabs>

            </Box>
        </Box>
    )

}

export default SearchView 