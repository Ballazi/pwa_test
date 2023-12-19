import { Box, styled } from '@mui/system';

const FooterWrapperBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: 'auto',
  boxShadow: '0px -20px 40px 0px rgb(234 235 235)',
  padding: '15px 16px',
  background: '#fff',
  height: '66px',
}));

export default function FooterWrapper({ children }) {
  return <FooterWrapperBox>{children}</FooterWrapperBox>;
}
