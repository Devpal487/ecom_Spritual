import * as React from 'react';
import logo from './logo.png';
import ClearIcon from '@mui/icons-material/Clear';
import GridViewIcon from '@mui/icons-material/GridView';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import BusinessIcon from '@mui/icons-material/BusinessCenterOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from "react-router-dom";



const drawerWidth = 350;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
  }),
);

const LeftDrawer=()=> {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate(); 

  const handleHome = (e) => {
    e.preventDefault(); 
    navigate('/');
  };


  return (
    <Box>
        <button
            // color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start">
            <MenuIcon sx={{color :"white"}}/>
        </button>
      <Drawer
        sx={{
          // width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
      
        <div className='flex items-center justify-between p-2  bg-[#433487] '>
          <div>
            <img className='h-10 ml-2 ' alt='logo' src={logo} onClick={handleHome}/>
          </div>
          <div >
            <IconButton onClick={handleDrawerClose} >
            {theme.direction === 'ltr' ? <ClearIcon className='text-[#bf8b7d]' /> : <ClearIcon  className='text-[#bf8b7d]'/>}
            </IconButton>
          </div>
        </div>

        <Divider />
        <List className='bg-gradient-to-r from-purple-300 to-purple-50 text-purple-500'>
         {['Browse Categories'].map((text, index) => (
           <ListItem key={text} disablePadding>
            <ListItemButton>
               <ListItemIcon>
                <GridViewIcon className='text-purple-500'/>
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
             <ArrowForwardIosIcon />
           </ListItem>
         ))}
       </List>

       <List>
         {['Stores', 'Bulk Orders'].map((text, index) => (
           <ListItem key={text} disablePadding>
             <ListItemButton>
               <ListItemIcon>
                 {index % 2 === 0 ? <BusinessIcon /> : <DescriptionIcon />}
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>

       <List className='bg-gradient-to-r from-orange-100 to-orange-50/10 text-[#bf8b7d]'>
         {['Offers'].map((text, index) => (
           <ListItem key={text} disablePadding>
             <ListItemButton>
               <ListItemIcon>
                <LocalOfferOutlinedIcon className='text-[#bf8b7d]' />
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
             <ArrowForwardIosIcon/>
           </ListItem>
         ))}
       </List>

       <List>
         {['Refer & Earn', 'Gift Cards', 'My Account', 'Help', 'Contact Us'].map((text, index) => (
           <ListItem key={text} disablePadding>
             <ListItemButton>
               <ListItemIcon>
                  {<PersonAddAltOutlinedIcon />}
                  <CardGiftcardOutlinedIcon />

               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>
       <Divider />
       <List>
         {['Design', 'Buying Guide', 'Faqs', 'Blog', 'Awards', 'Press', 'Investor Relations'].map((text, index) => (
           <ListItem key={text} disablePadding>
             <ListItemButton>
               <ListItemIcon>
                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>
       {/* <Divider /> */}
       <List>
         {[<button type="button" className='bg-black text-white py-2 w-full'>Log in</button>].map((text, index) => (
           <ListItem key={text} disablePadding>
             <ListItemButton>
               <ListItemIcon>
                 {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>
        <Main open={open}/>
      </Drawer>
    </Box>
  );
}

export default LeftDrawer;