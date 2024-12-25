import React, { useEffect, useState } from 'react';
import { useTheme } from '../../utils/Provider/ThemeContext';
import { AddUpdateMemberPatron, fetchAddress, fetchAddresswithunid } from '../../utils/APIURL';
import userlogo from '../../Asset/Navbar/images/user.png';
import dayjs from 'dayjs';
import { FaEdit } from 'react-icons/fa';
import { MdModeEditOutline } from "react-icons/md";
import EditProfileModal from './EditProfileModal';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from '@mui/material';
import Loading from '../../utils/Loader/Loading';
import api from '../../utils/config';
import NotificationSnackbar from '../../utils/NotificationSnackbar';
import NavBar from '../Navbar';
import { useProfileTheme } from '../../utils/Provider/ProfileProvider';
import axios from 'axios';
import { HOST_URL } from '../../utils/config';
import { Link } from 'react-router-dom';

const YourProfile = () => {
  const themeMaster = useTheme();
  const { profile, setProfile } = useProfileTheme();
  // console.log(profile);
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImages, setProfileImages] = useState(null);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const userID = localStorage.getItem('userid');
  const uid = localStorage.getItem('unqiueId');


  useEffect(() => {
    if (profile != null) {
      setIsLoading(false);
      setUserData(profile || {});
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsImageEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const base64Data = base64String.split(',')[1];
        setProfileImages(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEdit = () => {
    setIsImageEditing(true);
  };

  const handleSaveImage = async () => {
    if (!profileImages) {
      console.error("No new profile image selected.");
      return;
    }
    const updatedUserData = {
      ...userData,
      memberPic: profileImages,
      IsThumb2: '',
      passwd: "",
      saltVc: ""
    };
  
    try {
      const response = await axios.post(`${HOST_URL}ECommRegistration/AddUpdateECommRegitration`, { ...updatedUserData }, { headers: { UniqueId: uid } });
      if (response.data.isSuccess) {
        const res = await fetchAddresswithunid(userID);
        setProfile(res?.data[0]);
        setUserData(updatedUserData);
        setProfileImage(`data:image/jpeg;base64,${profileImages}`); // Update the profile image
        setSnackbarMessage(response.data.mesg);
        setSnackbarSeverity('success');
        setIsImageEditing(false);
      } else {
        setSnackbarMessage(response.data.mesg);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error while updating profile image:", error);
    } finally {
      setIsImageEditing(false);
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    isLoading ? (
      <Loading />
    ) :
      (<div className="min-h-screen" style={{ color: themeMaster.theme.textColor || 'inherit' }}>
        <main className="p-4 sm:p-6 md:p-10 rounded-sm">
          <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-6 sm:flex sm:space-x-6 border-2 border-gray-300">

            <div className="relative flex-shrink-0">

              <MdModeEditOutline className="absolute top-2 left-28 z-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={handleImageEdit} size={20} />

<img
  className="w-24 h-24 md:w-32 md:h-32 rounded-full"
  src={profileImage || `data:image/jpeg;base64,${profile?.memberPic || userlogo}`}
                alt={`${userData?.membName || '--'} `.trim() || '--'}
/>
            </div>

            <div className="mt-4 sm:mt-0 sm:flex-1">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-2xl font-bold">
                  {`${userData.membName || ''}`.trim() || '--'}
                </h2>
                <FaEdit className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={handleEdit} />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm md:text-base">
                  <span className="font-medium">Email:</span> {userData.email2 || 'N/A'}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Phone:</span> {userData.phone2 || '0000000000'}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">D. O. B.:</span> {userData.dob ? dayjs(userData.dob).format('DD-MMM-YYYY') : '--'}
                </p>
                <p className="text-sm md:text-base">
                  <Link to='/change-password' className='cursor-pointer '>
                    <span className="font-medium text-blue-500 underline">Change Password </span> </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-4xl mx-auto rounded-lg shadow-lg p-6 border-2 border-gray-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Address Details</h3>
            <p className="text-sm md:text-base">
              <span className="font-medium">Local Address:</span> {userData.localAddress || '--'} - {userData.localPincode || ''}
            </p>
            <p className="mt-2 text-sm md:text-base">
              <span className="font-medium">Permanent Address:</span> {userData.permanentAddress || '--'} - {userData.permanentPincode || ''}
            </p>
          </div>

          {isEditing && (
            <EditProfileModal
              isEditing={isEditing}
              userData={userData}
              address={address}
              handleCancel={handleCancel}
            />
          )}

          {/* Image Edit Dialog */}
          <Dialog open={isImageEditing} onClose={handleCancel}>
            <DialogTitle style={{ backgroundColor: themeMaster.theme.navbarBackgroundColor, color: themeMaster?.theme?.navbarTextColor }}>Edit Profile Image</DialogTitle>
            <DialogContent style={{ marginTop: "5px" }}>
              {profileImages ? (
                <img
                  src={`data:image/jpeg;base64,${profileImages}`}
                  alt="Preview"
                  className="rounded-full h-36 w-36 object-fit aspect-auto mb-4"
                />
              ) : (
                <img
                  src={`data:image/jpeg;base64,${userData?.memberPic || userlogo}`}
                  alt="Preview"
                  className="rounded-full h-36 w-36 object-fit aspect-auto mb-4"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#f3f3f3" }}>
              <Button onClick={handleCancel} variant="contained" color="error">
                Cancel
              </Button>
              <Button onClick={handleSaveImage} variant="contained" color="success">
                Save
              </Button>
            </DialogActions>
          </Dialog>

        </main>
        <NotificationSnackbar
          open={snackbarOpen}
          handleClose={handleCloseSnackbar}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </div>)

  );
};

export default YourProfile;