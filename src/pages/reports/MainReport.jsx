import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
// import jpgicon from '../../../public/JPG_svg.svg';
import pdficon from '../../../public/PDF_svg.svg';
import jpgicon from '../../../public/JPG_svg.svg';
import pngicon from '../../../public/PNG_svg.svg';


import { DataGrid, GridToolbarContainer, GridToolbarExport, GridPagination } from '@mui/x-data-grid'
import FilterComponent from "../../components/masterData/filter-component/FilterComponent";

import { ColumnsData, viewReportColumns } from "../../api/reports/report";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar-slice";

function CustomPagination(props) {
  return (
    <>

      <GridToolbarContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',

          // padding: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '25px',
            padding: '8px'
          }}>
            <GridToolbarExport />

          </div>
          <div>
            <GridPagination{...props} />
          </div>
        </div>
      </GridToolbarContainer>
    </>
  );
}

function MainReport() {

  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState([])

  const dispatch = useDispatch()

  const fetchColumns = () => {
    setIsLoading(true)
    return viewReportColumns()
      .then((data) => {
        console.log("lalalalala", data)
        if (data.success === true) {
          const updatedColumns = data.data.map((column) =>
            column.column_name
          )
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          )
          setLeft(updatedColumns)
        }
        else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          )
          setLeft([])
        }
      })
      .catch((error) => {
        console.error("error", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchColumns();
  }, []);






  const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1);
  };

  const not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1);
  };

  const union = (a, b) => {
    return [...a, ...not(b, a)];
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };



  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));

    // Create table data based on the right side items
    const newTableData = rightChecked.map((value) => {
      return {
        id: value, // Customize the ID field as needed
        name: `${value}`,
      };
    });
    const nameArray = newTableData.map(item => item.name);


    setTableData(newTableData);
    console.log(nameArray)

    reportColumnsData(newTableData.map((item) => item.name));

  };
  const [rows, setRows] = useState([]);
  const reportColumnsData = (nameArray) => {
    setIsLoading(true)
    const payload = {
      "columns":
        nameArray

      // "filter_data": {
      //   "shipper_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //   "region_cluster_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //   "branch_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      // }
    };

    return ColumnsData(payload) // Modify this function to fetch rows
      .then((data) => {
        if (data.success === true) {

          const rowValue = data.data
            .filter((item) => Object.values(item).some((value) => value !== null))
            .map((item, index) => {
              return {
                id: index + 1, // Customize the ID field as needed
                ...item, // Map other fields as needed
              };
            });
          dispatch(
            openSnackbar({ type: 'success', message: data.clientMessage })
          )
          setRows(rowValue);

        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  const rowReturnFunction = (data) => {



  };
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [filteredRows, setFilteredRows] = useState([]);
  const filterRows = () => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const filtered = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowerSearchQuery)
      )
    );
    setFilteredRows(filtered);
  };

  // Update filtered rows when the search query changes
  useEffect(() => {
    filterRows();
  }, [searchQuery, rows]);
  return (
    <div>
      {/* <Grid container spacing={2}>
        {console.log("errors", errors)}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FilterComponent />
        </Grid>
      </Grid> */}

      <Card style={{ marginTop: "20px", padding: "10px" }}>
        <div className="customCardheader">
          <Typography variant="h4"> Generate Report</Typography>
        </div>
        <Grid container spacing={1}>
          <Grid item md={5} sm={5} xs={5}>
            <Card>
              <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                  <Checkbox
                    onClick={handleToggleAll(left)}
                    checked={
                      numberOfChecked(left) === left.length && left.length !== 0
                    }
                    indeterminate={
                      numberOfChecked(left) !== left.length &&
                      numberOfChecked(left) !== 0
                    }
                    disabled={left.length === 0}
                    inputProps={{
                      "aria-label": "all items selected",
                    }}
                  />
                }
                title="Choices"
                subheader={`${numberOfChecked(left)}/${left.length} selected`}
              />
              <Divider />
              <List
                sx={{
                  height: 230,
                  bgcolor: "background.paper",
                  overflow: "auto",
                }}
                dense
                component="div"
                role="list"
              >
                {left.map((value, index) => {
                  const labelId = `transfer-list-all-item-${value}-label`;

                  return (
                    <ListItem
                      key={index}
                      data={value}
                      role="listitem"
                      button
                      onClick={handleToggle(value)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`${value}`} />
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Grid>
          <Grid item md={2} sm={2} xs={2}>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item md={5} sm={5} xs={5}>
            <Card>
              <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                  <Checkbox
                    onClick={handleToggleAll(right)}
                    checked={
                      numberOfChecked(right) === right.length &&
                      right.length !== 0
                    }
                    indeterminate={
                      numberOfChecked(right) !== right.length &&
                      numberOfChecked(right) !== 0
                    }
                    disabled={right.length === 0}
                    inputProps={{
                      "aria-label": "all items selected",
                    }}
                  />
                }
                title="Chosen"
                subheader={`${numberOfChecked(right)}/${right.length} selected`}
              />
              <Divider />
              <List
                sx={{
                  height: 230,
                  bgcolor: "background.paper",
                  overflow: "auto",
                }}
                dense
                component="div"
                role="list"
              >
                {right.map((value) => {
                  const labelId = `transfer-list-all-item-${value}-label`;

                  return (
                    <ListItem
                      key={value}
                      role="listitem"
                      button
                      onClick={handleToggle(value)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={`${value}`} />
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <div style={{ textAlign: "end", marginBottom: "10px", marginTop: "10px" }}>
              <Button variant="contained" onClick={handleCheckedRight}>
                Submit
              </Button>
            </div>

          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <div className="customCardheader">
              <Typography variant="h4"> Report Table</Typography>
            </div>
            {/* <div style={{ textAlign: "end" }}>
              <Button>
                Download CSV
              </Button>
            </div> */}
            <TextField
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              fullWidth
              size="small"
              style={{ marginTop: '10px', marginBottom: '10px' }}
            />
            {/* <DataGrid
              rows={rows}
              columns={tableData.map((item) => ({
                field: item.id.toString(),
                headerName: item.name,
                width: 150,
              }))}
              pageSize={5}
            /> */}
            <div className="customDataGridTable">
              <DataGrid
                components={{
                  Pagination: CustomPagination
                }}
                rows={filteredRows} // Use filtered rows instead of 'rows'
                columns={tableData.map((item) => ({
                  field: item.id.toString(),
                  headerName: item.name,
                  width: 350,
                }))}
                pageSize={5}
              />
            </div>

          </Grid>
        </Grid>
      </Card>


    </div>
  );
}

export default MainReport;
