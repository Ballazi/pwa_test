import { makeStyles } from '@mui/styles';




const useStyles = makeStyles({
    outerContainer : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: "5px",
        marginBottom:"-8px"
    },
    container2: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: "5px",
        marginTop:"-8px"
    },
    circle: {
        width: 5,
        height: 5,
        borderRadius: '50%',
    },
    startCircle: {
        backgroundColor: 'green',
    },
    endCircle: {
        backgroundColor: 'red',
    },
    varticalLine : {
        height:"20px",
        width:"1px",
        border:"1px solid black",
        marginLeft:"2px"
    }
});

const StepIconComponent = ({startPlace, endPlace }) => {
    const classes = useStyles();

    return (
        <div className={classes.outerContainer}>
            <div className={classes.container}>
                <span className={`${classes.circle} ${classes.startCircle}`}>
                </span>
                <span >{startPlace}</span>
            </div>
            <div className={classes.varticalLine}></div>
            <div className={classes.container2}>
                <span className={`${classes.circle} ${classes.endCircle}`}>
                </span>
                <span >{endPlace}</span>
            </div>
        </div>
    );
};

export default StepIconComponent