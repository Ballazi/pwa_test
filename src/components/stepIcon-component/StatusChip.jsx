import { makeStyles } from '@mui/styles';




const useStyles = makeStyles({
    box: {
        padding:"5px",
        lineHeight:"12px",
        box:"border-box",
        borderRadius: "2px",
        textAlign:"center",
        color:"white"
    },
    outerContainer : {
        backgroundColor:"#f0e00a",
    },
    outerContainer2 : {
        backgroundColor:"green",
    },
    container: {
        backgroundColor:"#06249c",
    },
    bidsContainer : {
        backgroundColor:"#37c4c0",
    },
    loadTypeContainer: {
        backgroundColor:"#aaadad",
    }
});

const StatusChip = ({ bidStatus, SPOT, bids, loadType }) => {
    const classes = useStyles();

    return (
        <div className={`${classes.box} ${bidStatus === "Live" ? classes.outerContainer : classes.outerContainer2} ${SPOT ? classes.container : ''} ${bids ? classes.bidsContainer : ''} ${loadType ? classes.loadTypeContainer : ''}`}>
            {bidStatus ? bidStatus : SPOT ? 'SPOT' : bids ? bids : loadType ? loadType : ""}
        </div>
    );
};

export default StatusChip