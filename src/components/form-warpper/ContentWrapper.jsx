import { Box, styled } from '@mui/material';
const ContentWrapperBox = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 66px)',
  overflowY: 'auto',
  padding: '16px',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 122px)',
  },
}));

export default function ContentWrapper({ children }) {
  return <ContentWrapperBox>{children}</ContentWrapperBox>;
}
