import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Divider } from '@mui/material';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';
import { useTheme } from '../../utils/Provider/ThemeContext';
import NotificationSnackbar from '../../utils/NotificationSnackbar';
import api from '../../utils/config';

const EditProfileModal = ({ isEditing, userData, address,  handleCancel }) => {
const themeMaster = useTheme();
  const [editData, setEditData] = useState(userData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log('Field Name:', name, 'New Value:', value);
    if (name.startsWith('address_')) {
     
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSave = async () => {
    const updatedUserData = {
      ...editData,
      IsThumb2:'',
      passwd:"",
      saltVc:""
    };

    const payload = { ...updatedUserData};
    try {
      const response = await api.post('ECommRegistration/AddUpdateECommRegitration',payload);
      console.log(response)
      if (response.data.isSuccess === true) {
        setEditData(updatedUserData); 
        window.location.reload();
        setSnackbarSeverity('success');
        setSnackbarMessage(response.data.mesg);
        handleCancel();
      } else {
        //console.error("Failed to update profile image.");
        setSnackbarMessage(response.data.mesg);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error while updating profile image:", error);
    } finally {
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <div>
    <Dialog width='lg' open={isEditing} onClose={handleCancel}>
      <DialogTitle style={{backgroundColor: themeMaster.theme.navbarBackgroundColor, color:themeMaster?.theme?.navbarTextColor}}>Edit Profile</DialogTitle>
      <DialogContent style={{padding:"5px", marginBottom:"5px"}}>
      {/* <form> */}
        <Grid item xs={12} container spacing={2} >
          {/* User Info */}
          <Divider color={grey} />
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="First Name"
              variant="outlined"
              name="firstname"
              value={editData.firstname || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Middle Name"
              variant="outlined"
              name="middlename"
              value={editData.middlename || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Last Name"
              variant="outlined"
              name="lastname"
              value={editData.lastname || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Email"
              variant="outlined"
              name="email2"
              value={editData.email2 || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Phone"
              variant="outlined"
              name="phone2"
              inputProps={{ maxLength: 10 }}
              value={editData.phone2 || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Date of Birth"
              type="date"
              variant="outlined"
              name="dob"
              value={editData.dob ? dayjs(editData.dob).format('YYYY-MM-DD') : ''}
              onChange={handleChange}
              InputLabelProps={{shrink : true}}
            />
          </Grid>

          {/* Address Info */}
          <br/>
          <hr/>
          <Divider color='blue'/>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Local Address"
              variant="outlined"
              name="localAddress"
              value={editData.localAddress || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Local Pincode"
              variant="outlined"
              name="localPincode"
              value={editData.localPincode || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Permanent Address"
              variant="outlined"
              name="permanentAddress"
              value={editData.permanentAddress || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size='small'
              label="Permanent Pincode"
              variant="outlined"
              name="permanentPincode"
              value={editData.permanentPincode || ''}
              onChange={handleChange}
            />
          </Grid>
          
        </Grid>
      </DialogContent>
      <DialogActions sx={{backgroundColor:"#f3f3f3"}}>
        <Button onClick={handleCancel} variant="contained" color="error">
          Cancel
        </Button>
        <Button onClick={() => handleSave(editData)} variant="contained" color="success">
          Save
        </Button>
      </DialogActions>
      {/* </form> */}
    </Dialog>

    <NotificationSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

    </div>
  );
};

export default EditProfileModal;