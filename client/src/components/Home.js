import SearchIcon from '@mui/icons-material/Search';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';

function Home() {
    return (
        <Box>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <Toolbar />
                <Paper sx={{ display: 'flex', borderRadius: 5, m: '8px 0 8px 0' }}>
                    <IconButton sx={{ pl: 1 }} size='small' aria-label="search">
                        <SearchIcon fontSize='small' />
                    </IconButton>
                    <InputBase
                        placeholder="Search..."
                        inputProps={{ 'aria-label': 'search' }}
                        fullWidth
                    />
                </Paper>
            </Box>
        </Box>
    )
}

export default Home;