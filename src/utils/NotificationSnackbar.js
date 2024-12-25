import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from './Provider/ThemeContext';

const Transition = (props) => {
    return <Slide {...props} direction="down" />;
};

const NotificationSnackbar = ({ open, handleClose, message, severity }) => {
    const { theme } = useTheme();

    const getBackgroundColor = () => {
        switch (severity) {
            case 'success':
                return theme.primaryColor;
            case 'warning':
                return '#ff9800';
            case 'error':
                return '#f44336';
            default:
                return theme.primaryColor;
        }
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            autoHideDuration={3000}
            message={message}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            }
            sx={{
                '& .MuiSnackbarContent-root': {
                    backgroundColor: getBackgroundColor(),
                    color: 'white',
                },
            }}
        />
    );
};

export default NotificationSnackbar;
