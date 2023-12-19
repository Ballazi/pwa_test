import { createTheme } from '@mui/material/styles';

const TMSTheme = createTheme({
  typography: {
    fontFamily: 'Switzer',
    h1: {
      fontSize: '48px',
      fontWeight: '700',
    },

    h2: {
      fontSize: '36px',
      fontWeight: '600',
    },

    h3: {
      fontSize: '24px',
      fontWeight: '600',
    },

    h4: {
      fontSize: '18px',
      fontWeight: '600',
    },

    h5: {
      fontSize: '16px',
      fontWeight: '600',
    },

    h6: {
      fontSize: '12px',
      fontWeight: '500',
    },

    h7: {
      fontSize: '10px',
      fontWeight: '500',
    },
    p: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#8A919D',
    },
  },
  palette: {
    primary: {
      main: '#065AD8',
    },
    secondary: {
      main: '#6c757d', // Set your secondary color
    },
    accent: {
      main: '#ffc107', // Set your accent color
    },
    badge: {
      main: '#E5F3FF',
    },
    warning: {
      main: '#ffc107', // Set your warning color
    },
    danger: {
      main: '#dc3545', // Set your danger color
    },
    success: {
      main: '#28a745', // Set your success color
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1240,
      xl: 1920,
    },
  },
  // components: {
  //   MuiOutlinedInput: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: "#fff",
  //         border: "none !important",
  //         padding: "12.5px 14px",
  //         borderRadius: "8px",
  //         "&:before": {
  //           borderBottom: "none !important",
  //         },
  //         "&:hover": {
  //           backgroundColor: "#fff",
  //         },
  //         "&:focus": {
  //           backgroundColor: "#fff",
  //         },
  //       },
  //     },
  //   },
  //   MuiSelect: {
  //     styleOverrides: {
  //       root: {
  //         borderRadius: "8px",
  //       },
  //       select: {
  //         borderRadius: "8px",
  //       },
  //       // icon: {
  //       //   // color: "black",
  //       // },
  //       // iconFilled: {
  //       //   background: "#F1F3F4",
  //       //   position: "absolute",
  //       //   height: "95%",
  //       //   width: "40px",
  //       //   top: 0,
  //       //   right: 0,
  //       //   marginTop: "1px",
  //       //   marginRight: "1px",
  //       //   // marginBottom: "0.5px",
  //       //   borderRadius: "0px 7px 7px 0px",
  //       // },
  //       // iconOpen: {
  //       //   borderRadius: "7px 0px 0px 7px",
  //       // },
  //     },
  //   },
  //   MuiAutocomplete: {
  //     styleOverrides: {
  //       input: {
  //         backgroundColor: "#fff",
  //         border: "none !important",
  //         borderRadius: "8px",
  //         "&:before": {
  //           borderBottom: "none !important",
  //         },
  //         "&:hover": {
  //           backgroundColor: "#fff",
  //         },
  //         "&:focus": {
  //           backgroundColor: "#fff",
  //         },
  //       },
  //       root: {
  //         // "& .MuiSvgIcon-root": {
  //         //   background: "#F1F3F4",
  //         //   position: "absolute",
  //         //   height: "95%",
  //         //   width: "40px",
  //         //   top: 0,
  //         //   right: 0,
  //         //   marginTop: "1px",
  //         //   marginRight: "1px",
  //         //   // marginBottom: "0.5px",
  //         //   borderRadius: "0px 7px 7px 0px",
  //         // },
  //         "& .MuiInputBase-root.MuiFilledInput-root": {
  //           // Styles for the filled input
  //           backgroundColor: "#fff",
  //           border: "1px solid #BDCCD3",
  //           borderRadius: "8px",
  //           "&:before": {
  //             borderBottom: "none !important",
  //           },
  //           "&:hover": {
  //             backgroundColor: "#fff",
  //           },
  //           "&:focus": {
  //             backgroundColor: "#fff",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   MuiFilledInput: {
  //     defaultProps: {
  //       disableUnderline: true,
  //     },
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: "#fff",
  //         borderRadius: "8px",
  //         ":focus": {
  //           backgroundColor: "#fff",
  //         },
  //         ":hover": {
  //           backgroundColor: "#fff",
  //         },
  //         ":before": {
  //           borderBottom: "none !important",
  //         },
  //       },
  //       disabled: {
  //         backgroundColor: "#fff",
  //       },
  //       focused: {
  //         backgroundColor: "#fff",
  //         border: "1px solid #BDCCD3",
  //       },

  //       input: {
  //         backgroundColor: "#fff",
  //         border: "1px solid #BDCCD3",
  //         borderRadius: "8px",
  //         ":focus": {
  //           backgroundColor: "#fff",
  //         },
  //       },
  //       underline: {
  //         ":hover": {
  //           ":before": {
  //             borderBottom: "none !important",
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
});

export default TMSTheme;
