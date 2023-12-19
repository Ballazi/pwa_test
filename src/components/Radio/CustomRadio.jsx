import { Box, FormControlLabel, Radio, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

export default function CustomRadio({
  onChange,
  id,
  name,
  controlState, // Pass the controlState as a prop
}) {
  // Modify handleClick to call the parent's onChange function with the radio's value

  function handleClick() {
    onChange(id);
  }

  const handleRadioButtonClick = (e) => {
    console.log('hi', e.target.value);
    onChange(id);
  };

  return (
    <Box
      sx={{
        border: '1px solid #BDCCD3',
        borderRadius: '6px',
        padding: '10px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
        {console.log('control', controlState)}
        <FormControlLabel
          value={id} // Use the radio's id as the value
          control={
            <Radio
              checked={controlState === id}
              onClick={handleRadioButtonClick}
            />
          } // Check the radio based on controlState
          sx={{ mr: -1 }}
        />
      </Box>
      <Typography
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          color: '#454C50',
          fontSize: '14px',
        }}
      >
        {name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          my: 1,
        }}
      >
        <InfoOutlined />
      </Box>
    </Box>
  );
}
