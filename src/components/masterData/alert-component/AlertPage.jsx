// import Alert from '@mui/material/Alert';
import React, { useState, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertPage = ({ alertType, message, closePopup }) => {
    const position = useRef({
        vertical: 'top',
        horizontal: 'right',
    });
    const { vertical, horizontal } = position.current;
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        closePopup();
    };

    return (
        <>
            {alertType === "error" ?
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical, horizontal }}
                >
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
                : alertType === "warning" ?
                    <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical, horizontal }}
                    >
                        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                    : alertType === "success" ?
                        <Snackbar
                            open={open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            anchorOrigin={{ vertical, horizontal }}
                        >
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                {message}
                            </Alert>
                        </Snackbar>
                        : ""
            }
        </>
    )
}

export default AlertPage