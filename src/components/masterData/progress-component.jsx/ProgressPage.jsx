import CircularProgress from '@mui/material/CircularProgress';


const ProgressPage = () => {
    return (
        <div style={{width:"100%", height:"80vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
            <CircularProgress color="inherit" />
        </div>
    )
}

export default ProgressPage