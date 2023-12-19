import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import Tooltip from '@mui/material/Tooltip';


export default function TestComponent() {
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <div style={{position:"absolute", top:"10px", right:"30px"}}>
                <Tooltip title="Select Language">
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <GTranslateIcon sx={{ width: 32, height: 32, color:"blue" }} />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={() => { changeLanguage("en"); handleClose() }}>English</MenuItem>
                    <MenuItem onClick={() => { changeLanguage("hi"); handleClose() }}>Hindi</MenuItem>
                </Menu>
            </div>
            <div>
                <h2>{t("Welcome to React")}</h2>
            </div>
            <div>
                <Trans>
                    My Name
                </Trans>
                <br />
                <Trans i18nKey="welcome">trans</Trans>
                <br />
            </div>
        </div>
    );
}
