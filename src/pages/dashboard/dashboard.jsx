// import { useTranslation } from "react-i18next";
import StatusBar from "./status/StatusBar";
import { Container } from "@mui/material";
import Actions from "./actions/actions";
import LoadAndBidContainer from "./load-and-bids/LoadAndBidContainer";
import TransporterAnalysis from "./transporter-analysis/TransporterAnalysis";
// import CancelAndBestPriceSection from "./cancel-best-price-section/CancelAndBestPriceSection";

const Dashboard = () => {
  // const { t } = useTranslation();
  return (
    <Container>
      {/* <h1>{t("dashboard")}</h1> */}
      <StatusBar />
      <Actions />
      <LoadAndBidContainer />
      <TransporterAnalysis />
      {/* <CancelAndBestPriceSection /> */}
    </Container>
  );
};

export default Dashboard;
