import { useEffect, useState } from 'react';
import {
  Checkbox,
  Box,
  Typography,
  Button,
  Grid,
  Radio,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TitleContainer from '../card/TitleContainer';
import RegisterCard from '../card/RegisterCard';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';

export default function License({
  value,
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const [val, setVal] = useState('');
  const [val1, setVal1] = useState('');
  const [serviceOpted, setServiceOpted] = useState([]);
  const [bidtypeOpted, setBidtypeOpted] = useState([]);
  const [selectedPurchaseLicense, setPurchaseLicense] = useState(null);
  const [infoProvider, setInfoProvider] = useState([]);
  const [eta, setEta] = useState('');
  const [epod, setEpod] = useState('');
  const [priceMatching, setPriceMatching] = useState('');
  const [bidMode, setBidMode] = useState('');
  const [rateQutation, setRateQuation] = useState('');
  const [rateCustom, setRateCustom] = useState(false);
  // const [detailsDurBid, setDetailsDurBid] = useState("");
  const [pingDur, setPingDur] = useState('');
  const [customTracking, setCustomTracking] = useState(false);
  const [alertList, setAlertList] = useState([]);
  const [alertReciept, setAlertReciept] = useState([]);
  const [holdalert, setHoldAlert] = useState(true);
  const [departurealert, setDepartureAlert] = useState(false);
  const [autoTripClosure, setautoTripClosure] = useState('');
  const [load, setLoad] = useState('');
  const [lowestRate, setLowestRate] = useState('');

  const prefix = 'License';
  useEffect(() => {
    value([val, val1]);
  }, [val, val1]);

  useEffect(() => {
    if (localStorage.length > 0) {
      const matchingItems = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith(prefix)) {
          const value = localStorage.getItem(key);
          matchingItems.push(value);
        }
      }

      setVal(matchingItems[0]);
      setVal1(matchingItems[1]);
    }
  }, []);
  function handleAlert(val) {
    if (alertList.includes(val)) {
      const lastalert = alertList.splice(alertList.indexOf(val), 1);
      setAlertList([...alertList]);
    } else {
      setAlertList([...alertList, val]);
    }
  }
  function hadleAlertRecipents(val) {
    if (alertReciept.includes(val)) {
      const lastAlertSet = alertReciept.splice(alertReciept.indexOf(val), 1);
      setAlertReciept([...alertReciept]);
    } else {
      setAlertReciept([...alertReciept, val]);
    }
  }
  function handleServiceOpted(val) {
    console.log('values', val);
    if (serviceOpted.includes(val)) {
      const updatedOpt = serviceOpted;
      const updatedService = updatedOpt.splice(updatedOpt.indexOf(val), 1);

      setServiceOpted([...updatedOpt]);
    } else {
      setServiceOpted([...serviceOpted, val]);
    }
  }
  function handleInfoProvider(val) {
    if (infoProvider.includes(val)) {
      const deletedProvider = infoProvider.splice(infoProvider.indexOf(val), 1);
      setInfoProvider([...infoProvider]);
    } else {
      setInfoProvider([...infoProvider, val]);
    }
  }
  function handleBidtypeOpted(val) {
    if (bidtypeOpted.includes(val)) {
      const updatedOpt = bidtypeOpted;
      const updatedService = updatedOpt.splice(updatedOpt.indexOf(val), 1);

      setBidtypeOpted([...updatedOpt]);
    } else {
      setBidtypeOpted([...bidtypeOpted, val]);
    }
  }
  function hadleAlertRecipents(val) {
    if (alertReciept.includes(val)) {
      const lastAlertSet = alertReciept.splice(alertReciept.indexOf(val), 1);
      setAlertReciept([...alertReciept]);
    } else {
      setAlertReciept([...alertReciept, val]);
    }
  }

  const handleLicenseSelect = (region) => {
    setPurchaseLicense(region);
    localStorage.setItem('SelectedRegion', region);
  };
  return (
    <form>
      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Licenses and Services </Typography>
          <Typography style={{ marginBottom: '30px' }} variant="p">
            Review the Licenses and Services selected
          </Typography>
        </TitleContainer>

        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" style={{ marginBottom: '20px' }}>
                Purchase License
              </Typography>
              <Typography variant="p">
                Select single or multiple license you want to purchase
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${selectedPurchaseLicense === 'Transaction' ? 'selected' : ''
                  }`}
                onClick={() => handleLicenseSelect('Transaction')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedPurchaseLicense === 'Transaction'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Transaction</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${selectedPurchaseLicense === 'Profit' ? 'selected' : ''
                  }`}
                onClick={() => handleLicenseSelect('Profit')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedPurchaseLicense === 'Profit'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Profit</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${selectedPurchaseLicense === 'User Based' ? 'selected' : ''
                  }`}
                onClick={() => handleLicenseSelect('User Based')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedPurchaseLicense === 'User Based'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">User Based</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">Service opted</Typography>
                  <Typography variant="p">
                    Select single or multiple service you want
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div
                    className={`radio-option ${serviceOpted.includes('Bidding') ? 'selected' : ''
                      }`}
                    onClick={() => handleServiceOpted('Bidding')}
                  >
                    {console.log('here', serviceOpted)}

                    <div
                      className="checkBoxIcon"
                      onClick={() => handleServiceOpted('Bidding')}
                    >
                      <Checkbox checked={serviceOpted.includes('Bidding')} />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Bidding </Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <div
                    className={`radio-option ${serviceOpted.includes('Tracking') ? 'selected' : ''
                      }`}
                    onClick={() => handleServiceOpted('Tracking')}
                  >
                    <div
                      className="checkBoxIcon"
                      onClick={() => handleServiceOpted('Tracking')}
                    >
                      <Checkbox checked={serviceOpted.includes('Tracking')} />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Tracking</Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">Bid type</Typography>
                  <Typography variant="p" style={{ marginBottom: '20px' }}>
                    Select bid type you want
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div
                    className={`radio-option ${bidtypeOpted.includes('contractual') ? 'selected' : ''
                      }`}
                    onClick={() => handleBidtypeOpted('contractual')}
                  >
                    <div
                      className="checkBoxIcon"
                      onClick={() => handleBidtypeOpted('contractual')}
                    >
                      <Checkbox
                        checked={bidtypeOpted.includes('contractual')}
                      />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Contractual </Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div
                    className={`radio-option ${bidtypeOpted.includes('spot') ? 'selected' : ''
                      }`}
                    onClick={() => handleBidtypeOpted('spot')}
                  >
                    <div
                      className="checkBoxIcon"
                      onClick={() => handleBidtypeOpted('spot')}
                    >
                      <Checkbox checked={bidtypeOpted.includes('spot')} />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Spot</Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">
                Information medium for transporter
              </Typography>
              <Typography variant="p">
                select single or multiple service you want
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${infoProvider.includes('SMS') ? 'selected' : ''
                  }`}
                onClick={() => handleInfoProvider('SMS')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="samllcheckBoxIcon">
                  <Checkbox checked={infoProvider.includes('SMS')} />
                </div>
                <div className="Chekboxtext">
                  <Typography variant="h5">SMS</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${infoProvider.includes('Email') ? 'selected' : ''
                  }`}
                onClick={() => handleInfoProvider('Email')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="samllcheckBoxIcon">
                  <Checkbox checked={infoProvider.includes('Email')} />
                </div>
                <div className="Chekboxtext">
                  <Typography variant="h5">Email</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${infoProvider.includes('Whatsapp') ? 'selected' : ''
                  }`}
                onClick={() => handleInfoProvider('Whatsapp')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="samllcheckBoxIcon">
                  <Checkbox
                    checked={infoProvider.includes('Whatsapp')}
                    onClick={() => handleInfoProvider('Whatsapp')}
                  />
                </div>
                <div className="Chekboxtext">
                  <Typography variant="h5">Whatsapp</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">Estimated time of Arrival</Typography>
              <Typography variant="p">
                Do you need standard ETA for your organization
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${eta === 'Yes' ? 'selected' : ''}`}
                onClick={() => setEta('Yes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="Chekboxtext">
                  <Typography variant="h5">Yes</Typography>
                </div>
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={eta === 'Yes'}
                    sx={
                      {
                        // my: "8px",
                      }
                    }
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${eta === 'No' ? 'selected' : ''}`}
                onClick={() => setEta('No')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="Chekboxtext">
                  <Typography variant="h5">No</Typography>
                </div>
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={eta === 'No'}
                    sx={
                      {
                        // my: "8px",
                      }
                    }
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard>
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">EPOD</Typography>
                  <Typography variant="p">
                    Do you want to enable EPOD for your organization ?
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div
                    className={`checkbox-option ${epod === 'Yes' ? 'selected' : ''
                      }`}
                    onClick={() => setEpod('Yes')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '42px',
                    }}
                  >
                    <div className="Chekboxtext">
                      <Typography variant="h5">Yes</Typography>
                    </div>
                    <div className="radioIcon">
                      <Radio
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<RadioButtonCheckedIcon />}
                        checked={epod === 'Yes'}
                        sx={
                          {
                            // my: "8px",
                          }
                        }
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div
                    className={`checkbox-option ${epod === 'No' ? 'selected' : ''
                      }`}
                    onClick={() => setEpod('No')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '42px',
                    }}
                  >
                    <div className="Chekboxtext">
                      <Typography variant="h5">No</Typography>
                    </div>
                    <div className="radioIcon">
                      <Radio
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<RadioButtonCheckedIcon />}
                        checked={epod === 'No'}
                        sx={
                          {
                            // my: "8px",
                          }
                        }
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <div
                    className={`radio-option ${load === 'LOAD' ? 'selected' : ''
                      }`}
                    onClick={() => setLoad('LOAD')}
                  >
                    <div className="radioIcon">
                      <Radio
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<RadioButtonCheckedIcon />}
                        checked={load === 'LOAD'}
                      />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Load-Wise e-POD</Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div
                    className={`radio-option ${load === 'INVOICE' ? 'selected' : ''
                      }`}
                    onClick={() => setLoad('INVOICE')}
                  >
                    {console.log('here', serviceOpted)}

                    <div className="radioIcon">
                      <Radio
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<RadioButtonCheckedIcon />}
                        checked={load === 'INVOICE'}
                      />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Invoice-wise e-POD</Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <div
                    className={`radio-option ${load === 'ITEM' ? 'selected' : ''
                      }`}
                    onClick={() => setLoad('ITEM')}
                  >
                    <div className="radioIcon">
                      <Radio
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<RadioButtonCheckedIcon />}
                        checked={load === 'ITEM'}
                      />
                    </div>
                    <div className="radiotext">
                      <Typography variant="h5">Item-Wise e-POD</Typography>
                    </div>
                    <div className="radioIcon2">
                      <InfoOutlinedIcon />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Bid settings</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="p" sx={{ marginRight: '10px' }}>
                    Price matching
                  </Typography>
                  <InfoOutlinedIcon />
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`checkbox-option ${priceMatching === 'Yes' ? 'selected' : ''
                          }`}
                        onClick={() => setPriceMatching('Yes')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '42px',
                        }}
                      >
                        <div className="Chekboxtext">
                          <Typography variant="h5">Yes</Typography>
                        </div>
                        <div className="radioIcon">
                          <Radio
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            checked={priceMatching === 'Yes'}
                            sx={
                              {
                                // my: "8px",
                              }
                            }
                          />
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`checkbox-option ${priceMatching === 'No' ? 'selected' : ''
                          }`}
                        onClick={() => setPriceMatching('No')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '42px',
                        }}
                      >
                        <div className="Chekboxtext">
                          <Typography variant="h5">No</Typography>
                        </div>
                        <div className="radioIcon">
                          <Radio
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            checked={priceMatching === 'No'}
                            sx={
                              {
                                // my: "8px",
                              }
                            }
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="p" sx={{ marginRight: '10px' }}>
                    Show current lowest rate to transporter
                  </Typography>
                  <InfoOutlinedIcon />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`checkbox-option ${lowestRate === 'Yes' ? 'selected' : ''
                          }`}
                        onClick={() => setLowestRate('Yes')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '42px',
                        }}
                      >
                        <div className="Chekboxtext">
                          <Typography variant="h5">Yes</Typography>
                        </div>
                        <div className="radioIcon">
                          <Radio
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            checked={lowestRate === 'Yes'}
                            sx={
                              {
                                // my: "8px",
                              }
                            }
                          />
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`checkbox-option ${lowestRate === 'No' ? 'selected' : ''
                          }`}
                        onClick={() => setLowestRate('No')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '42px',
                        }}
                      >
                        <div className="Chekboxtext">
                          <Typography variant="h5">No</Typography>
                        </div>
                        <div className="radioIcon">
                          <Radio
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonCheckedIcon />}
                            checked={lowestRate === 'No'}
                            sx={
                              {
                                // my: "8px",
                              }
                            }
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="p" sx={{ marginRight: '10px' }}>
                Bid mode
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div
                className={`radio-option ${bidMode === 'private' ? 'selected' : ''
                  }`}
                onClick={() => setBidMode('private')}
              >
                {console.log('here', serviceOpted)}

                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={bidMode === 'private'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Private </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div
                className={`radio-option ${bidMode === 'openMarket' ? 'selected' : ''
                  }`}
                onClick={() => setBidMode('openMarket')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={bidMode === 'openMarket'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Open market </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="p"
                sx={{ marginRight: '10px', marginBottom: '20px' }}
              >
                Rate quation type
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${rateQutation === 'PMT' ? 'selected' : ''
                  }`}
                onClick={() => setRateQuation('PMT')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={rateQutation === 'PMT'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">PMT </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${rateQutation === 'FTL' ? 'selected' : ''
                  }`}
                onClick={() => setRateQuation('FTL')}
              >
                {console.log('here', serviceOpted)}

                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={rateQutation === 'FTL'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">FTL</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${rateCustom ? 'selected' : ''}`}
                onClick={() => setRateCustom(!rateCustom)}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={rateCustom}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Custom</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Tracking ping duration</Typography>
              <Typography variant="p">
                select the tracking ping duration you want to go for
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${pingDur === '15min' ? 'selected' : ''
                  }`}
                onClick={() => setPingDur('15min')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="Chekboxtext">
                  <Typography variant="h5">15 min</Typography>
                </div>
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={pingDur === '15min'}
                    sx={
                      {
                        // my: "8px",
                      }
                    }
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${pingDur === '30min' ? 'selected' : ''
                  }`}
                onClick={() => setPingDur('30min')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="Chekboxtext">
                  <Typography variant="h5">30min</Typography>
                </div>
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={pingDur === '30min'}
                    sx={
                      {
                        // my: "8px",
                      }
                    }
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`checkbox-option ${customTracking ? 'selected' : ''
                  }`}
                onClick={() => {
                  setCustomTracking(!customTracking);
                  setPingDur('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                }}
              >
                <div className="Chekboxtext">
                  <Typography variant="h5">Custom</Typography>
                </div>
                <div className="radioIcon">
                  <Radio
                    sx={
                      {
                        // my: "8px",
                      }
                    }
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={customTracking}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Typography variant="h4">Alert settings</Typography>
              <Typography variant="p">
                Select single or multiple alerts you want for your organization
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('Hold alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('Hold alert')}
              >
                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('Hold alert')}
                >
                  <Checkbox checked={alertList.includes('Hold alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h4">Hold alert</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('Departure alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('Departure alert')}
              >
                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('Departure alert')}
                >
                  <Checkbox checked={alertList.includes('Departure alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Departure alert </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('Delay alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('Delay alert')}
              >
                {console.log('here', serviceOpted)}

                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('Delay alert')}
                >
                  <Checkbox checked={alertList.includes('Delay alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Delay alert </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('SOS alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('SOS alert')}
              >
                {console.log('here', serviceOpted)}

                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('SOS alert')}
                >
                  <Checkbox checked={alertList.includes('SOS alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">SOS alert </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('Deviation alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('Deviation alert')}
              >
                {console.log('here', serviceOpted)}

                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('Deviation alert')}
                >
                  <Checkbox checked={alertList.includes('Deviation alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Deviation alert </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('Arrival alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('Arrival alert')}
              >
                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('Arrival alert')}
                >
                  <Checkbox checked={alertList.includes('Arrival alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Arrival alert </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div
                className={`radio-option ${alertList.includes('E-way alert') ? 'selected' : ''
                  }`}
                onClick={() => handleAlert('E-way alert')}
              >
                <div
                  className="checkBoxIcon"
                  onClick={() => handleAlert('E-way alert')}
                >
                  <Checkbox checked={alertList.includes('E-way alert')} />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">E-way bill alert </Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">
                Selected alerts and their settings
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Accordion
                expanded={holdalert}
                onChange={() => setHoldAlert(!holdalert)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ backgroundColor: '#F1F3F4' }}
                >
                  <Typography variant="P">Hold Alert</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="p">Alert Recipents</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div
                        className={`radio-option ${alertReciept.includes('shipper') ? 'selected' : ''
                          }`}
                        onClick={() => hadleAlertRecipents('shipper')}
                      >
                        <div className="checkBoxIcon">
                          <Checkbox
                            checked={alertReciept.includes('shipper')}
                          />
                        </div>
                        <div className="radiotext">
                          <Typography variant="h5">Shipper </Typography>
                        </div>
                        <div className="radioIcon2">
                          <InfoOutlinedIcon />
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div
                        className={`radio-option ${alertReciept.includes('transporter') ? 'selected' : ''
                          }`}
                        onClick={() => hadleAlertRecipents('transporter')}
                      >
                        <div className="checkBoxIcon">
                          <Checkbox
                            checked={alertReciept.includes('transporter')}
                          />
                        </div>
                        <div className="radiotext">
                          <Typography variant="h5">Transporter</Typography>
                        </div>
                        <div className="radioIcon2">
                          <InfoOutlinedIcon />
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div
                        className={`radio-option ${alertReciept.includes('customer') ? 'selected' : ''
                          }`}
                        onClick={() => hadleAlertRecipents('customer')}
                      >
                        <div className="checkBoxIcon">
                          <Checkbox
                            checked={alertReciept.includes('customer')}
                          />
                        </div>
                        <div className="radiotext">
                          <Typography variant="h5">Customer</Typography>
                        </div>
                        <div className="radioIcon2">
                          <InfoOutlinedIcon />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Accordion
                expanded={departurealert}
                onChange={() => setDepartureAlert(!departurealert)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ backgroundColor: '#F1F3F4' }}
                >
                  Departure alert
                </AccordionSummary>
              </Accordion>
            </Grid>
          </Grid>
        </RegisterCard>

        <RegisterCard>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4">Geofencing Settings</Typography>
              <Typography variant="p" sx={{ marginRight: '10px' }}>
                Auto Trip Completion Method
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div
                className={`radio-option ${autoTripClosure === 'radius' ? 'selected' : ''
                  }`}
                onClick={() => setautoTripClosure('radius')}
              >
                {console.log('here', serviceOpted)}

                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={autoTripClosure === 'radius'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">Radius wise</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div
                className={`radio-option ${autoTripClosure === 'POD' ? 'selected' : ''
                  }`}
                onClick={() => setautoTripClosure('POD')}
              >
                {console.log('here', serviceOpted)}

                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={autoTripClosure === 'POD'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h5">POD wise</Typography>
                </div>
                <div className="radioIcon2">
                  <InfoOutlinedIcon />
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>
      </ContentWrapper>
      <FooterWrapper>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep !== stepsContent.length - 1 ? (
          <Button
            variant="contained"
            type="submit"
            onClick={() => handleNext()}
            disabled={currentStep === stepsContent.length - 1}
          >
            Save and Continue
          </Button>
        ) : (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </FooterWrapper>
    </form>
  );
}
