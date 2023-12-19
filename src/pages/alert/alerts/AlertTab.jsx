import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import AlertTable from "./AlertTable";



export default function AlertTab({ status, shipperId }) {
    const [tabValue, setTabValue] = useState(0);
    const [tabLabel, setTabLabel] = useState("");
    const [returnedTabs, setReturnedTabs] = useState([]);

    const returnTabFunction = () => {
        switch (true) {
            case (status === "Hold"):
                {
                    setTabLabel("hold");
                    return [
                        {
                            label: "All",
                            value: "hold"
                        },
                        {
                            label: "Not-Started",
                            value: "hold_not_started"
                        },
                        {
                            label: "Short",
                            value: "hold_short"
                        },
                        {
                            label: "Long",
                            value: "hold_long"
                        },
                        {
                            label: "Ontime",
                            value: "hold_ontime"
                        }
                    ];
                }
            case (status === "Departure"):
                {
                    setTabLabel("departure");
                    return [
                        {
                            label: "All",
                            value: "departure"
                        },
                        {
                            label: "Not-Started",
                            value: "departure_not_started"
                        },
                        {
                            label: "Short",
                            value: "departure_short"
                        },
                        {
                            label: "Long",
                            value: "departure_long"
                        },
                        {
                            label: "Ontime",
                            value: "departure_ontime"
                        }
                    ];
                }
            case status === "Delay":
                {
                    setTabLabel("delay");
                    return [
                        {
                            label: "All",
                            value: "delay"
                        },
                        {
                            label: "Short",
                            value: "delay_short"
                        },
                        {
                            label: "Long",
                            value: "delay_long"
                        }
                    ];
                }
            case (status === "SOS"):
                {
                    setTabLabel("sos");
                    return [
                        {
                            label: "All",
                            value: "sos"
                        }
                    ];
                }
            case (status === "E-way"):
                {
                    setTabLabel("e_way");
                    return [
                        {
                            label: "All",
                            value: "e_way"
                        }
                    ];
                }
            case (status === "Gate-In"):
                {
                    setTabLabel("gate_in");
                    return [
                        {
                            label: "All",
                            value: "gate_in"
                        }
                    ];
                }
            case (status === "Deviation"):
                {
                    setTabLabel("deviation");
                    return [
                        {
                            label: "All",
                            value: "deviation"
                        },
                        {
                            label: "Short",
                            value: "deviation_short"
                        },
                        {
                            label: "Long",
                            value: "deviation_long"
                        },
                        {
                            label: "Ontime",
                            value: "deviation_ontime"
                        },
                    ];
                }
            case (status === "Arrival"):
                {
                    setTabLabel("arrival");
                    return [
                        {
                            label: "All",
                            value: "arrival"
                        },
                        {
                            label: "Short",
                            value: "arrival_short"
                        },
                        {
                            label: "Long",
                            value: "arrival_long"
                        },
                        {
                            label: "Ontime",
                            value: "arrival_ontime"
                        },
                    ];
                }
            case status === "Gate-Out":
                {
                    setTabLabel("gate_out");
                    return [
                        {
                            label: "All",
                            value: "gate_out"
                        },
                        {
                            label: "Not-Started",
                            value: "gate_out_not_started"
                        },
                        {
                            label: "Short",
                            value: "gate_out_short"
                        },
                        {
                            label: "Long",
                            value: "gate_out_long"
                        },
                    ];
                }
            default:
                return [];
        }
    }

    useEffect(() => {
        const tabs = returnTabFunction();
        setReturnedTabs(tabs);
        setTabValue(0);
    }, [status])

    const handleTabChange = (event, newValue) => {
        const selectedTabLabel = returnedTabs[newValue].value;
        setTabLabel(selectedTabLabel);
        setTabValue(newValue);
    };

    return (
        <>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Bid Tabs"
                sx={{
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#0080FF",
                    },
                    bgcolor:"#fff",
                    border:"1px solid #DADADA"
                }}
            >
                {
                    returnedTabs.map((ele, index) => {
                        return (
                            <Tab
                                label={ele.label}
                                key={ele.value}
                                sx={{
                                    borderRadius: "5px 5px 0 0",
                                    color: "black",
                                    backgroundColor: tabValue === index ? "#0080FF" : "transparent",
                                }}
                            />
                        )
                    })
                }
            </Tabs>
            {
                returnedTabs.map((ele, ind) => tabValue === ind && <AlertTable key={ele.label} tabType={tabLabel} shipperId={shipperId} />)
            }
        </>
    );
}
