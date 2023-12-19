import { Box, Typography, styled } from '@mui/material';

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

export default function TopContainerChart({ label, count, subTitle }) {
  return (
    <Wrapper component="div" display="flex" justifyContent="space-between">
      <Typography
        sx={{
          fontSize: '18px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '28px',
          letterSpacing: '-0.72px',
        }}
        component="h4"
      >
        {label}
      </Typography>
      <Typography component="h4" sx={{ color: '#969CA6', fontSize: '14px' }}>
        {subTitle}
        <Typography
          component="span"
          sx={{
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '28px',
            letterSpacing: '-0.72px',
            color: '#1D2129',
          }}
        >
          &nbsp;{count}
        </Typography>{' '}
      </Typography>
    </Wrapper>
  );
}
