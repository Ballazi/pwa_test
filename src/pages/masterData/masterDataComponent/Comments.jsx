import { Button, Card, CardContent, Grid, IconButton, TextField, Tooltip, Typography, FormControl, InputLabel, Select, MenuItem, Dialog, DialogContent, DialogActions, Container } from '@mui/material'
import React, { useState } from 'react'
import { requiredValidator } from '../../../validation/common-validator'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { DataGrid } from '@mui/x-data-grid'
import { createComments, deleteComments, updateComments, viewComments } from '../../../api/master-data/comment'
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useEffect } from 'react'
import { viewShiper } from '../../../api/master-data/user'
import ErrorTypography from '../../../components/typography/ErrorTypography';


const schema = yup.object().shape({
    cmmnt_text: requiredValidator("Comment Type"),
    shipper_id: requiredValidator("Shipper Name")
})

const Comments = () => {
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })

    const columns = [
        { field: 'cmmnt_text', headerName: 'Comment Type', width: 150 },
        { field: 'cmmnt_shipper_id', headerName: 'Shipper Name', width: 250 },
        {
            field: 'actions', headerName: 'Actions', width: 100, sortable: false,
            renderCell:
                params => (
                    <div>
                        <Tooltip title="Edit">
                            <IconButton
                                onClick={() => handleEditClick(params.row)}
                            >
                                <BorderColorIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                )
        }
    ]

    const [comments, setComments] = useState([])
    const [newComments, setNewComments] = useState({ cmmnt_text: '', cmmnt_shipper_id: '' })
    const [selectedComments, setSelectedComments] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [shipperList, setShipperList] = useState([])
    const [editComments, setEditComments] = useState('')
    const dispatch = useDispatch()

    const handleEditClick = comment => {
        setSelectedComments(comment)
        setEditDialogOpen(true)
    }
    const handleEditDialogClose = () => {
        setSelectedComments(null)
        setEditDialogOpen(false)
    }
    const handleDeleteClick = commentsId => {
        setSelectedComments(comments.find(comments => comments.id === commentsId))
        setDeleteDialogOpen(true)
    }
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
        setSelectedComments(null)
    }

    const fetchData = () => {
        return viewComments()
        // console.log(object)
            .then((data) => {
                if (data.success === true) {
                    const updatedComments = data.data.map(item => ({
                        id: item.id,
                        cmmnt_text: item.cmmnt_text,
                        cmmnt_shipper_id: item.cmmnt_shipper_id
                    }))
                    setComments(updatedComments)
                }
                else {
                    dispatch(
                        openSnackbar({
                            type: 'error',
                            message: data.clientMessage
                        })
                    )
                    setComments([])
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }

    const fetchShipper = () => {
        return viewShiper()
            .then((data) => {
                if (data.success === true) {
                    setShipperList(data.data)
                }
                else {
                    dispatch(
                        openSnackbar({
                            type: 'error',
                            message: data.clientMessage
                        })
                    )
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }
    useEffect(() => {
        fetchData()
        fetchShipper()
    }, [])

    const handleAddComments = (form_data) => {
        var data = {
            cmmnt_text: form_data.cmmnt_text,
            cmmnt_shipper_id: form_data.shipper_id
            // details: form_data.details
        }
        createComments(data)
            .then((data) => {
                if (data.success === true) {
                    fetchData()
                    fetchShipper()
                    dispatch(
                        openSnackbar({
                            type: 'success',
                            message: data.clientMessage
                        })
                    )
                    setValue('cmmnt_text', '')
                    setValue('cmmnt_shipper_id', '')
                }
                else {
                    dispatch(
                        openSnackbar({
                            type: 'error',
                            message: data.clientMessage
                        })
                    )
                }
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }

    const handleEditSave = () => {
        if (!selectedComments.type || selectedComments.shipper_id || selectedComments.type.trim() === "" || selectedComments.shipper_id.trim() === "") {
            dispatch(
                openSnackbar({
                    type: 'error',
                    message: "Please fill both of the fields"
                }))
        }
        else {
            var data = {
                "cmmnt_text": selectedComments.cmmnt_text,
                "cmmnt_shipper_id": selectedComments.cmmnt_shipper_id
            }
            updateComments(selectedComments.id, data)
                .then((data) => {
                    if (data.success === true) {
                        fetchData()
                        dispatch(
                            openSnackbar({ type: 'success', message: data.clientMessage })
                        )
                        setNewComments({ cmmnt_text: '', cmmnt_shipper_id: '' })
                        setEditDialogOpen(false)
                    }
                    else {
                        dispatch(
                            openSnackbar({ type: 'error', message: data.clientMessage })
                        )
                    }
                })
                .catch((error) => {
                    console.error("error", error)
                })

        }
    }
    const handleDeleteConfirm = () => {
        deleteComments(selectedComments.id)
            .then((data) => {
                if (data.success === true) {
                    setDeleteDialogOpen(false)
                    fetchData()
                    dispatch(
                        openSnackbar({ type: 'success', message: data.clientMessage })
                    )
                }
                else {
                    dispatch(
                        openSnackbar({ type: 'error', message: data.clientMessage })
                    )
                }
            })
            .catch((error) => {
                console.error("error", error)
            })
        setSelectedComments(null)
    }

    const editDialogContent = (
        <div>
            <TextField
                label="Edit Comment Name"
                size='small'
                fullWidth
                value={selectedComments ? selectedComments.cmmnt_text : ''}
                onChange={e => setSelectedComments(prevState => ({ ...prevState, cmmnt_text: e.target.value }))}
                style={{ marginBottom: '20px' }}
            />
            <FormControl
                fullWidth
                style={{ marginBottom: '20px' }}
                size='small'
                variant='outlined'>
                <InputLabel id='comment-label'>Comments Name</InputLabel>
                <Select
                    disabled
                    labelId="comment-label"
                    id='comment'
                    name='Shipper Name'
                    value={selectedComments ? selectedComments.cmmnt_shipper_id : ''}
                    onChange={(e) =>
                        setSelectedComments((prevState) => ({
                            ...prevState,
                            cmmnt_shipper_id: e.target.value
                        }))}
                    label='Shipper Name*'
                    fullWidth
                    size='small'
                >
                    {comments.map((option) => (
                        <MenuItem onClick={() => setEditComments(option.id)} key={option.id} value={option.cmmnt_shipper_id}>
                            {option.cmmnt_shipper_id}
                        </MenuItem>
                    ))}
                </Select>
                {errors.shipper_id && (
                    <ErrorTypography>
                        {errors.shipper_id.message}
                    </ErrorTypography>
                )}

            </FormControl>
            <DialogActions>
                <Button onClick={handleEditSave} variant='contained'>
                    Save
                </Button>
                <Button onClick={handleEditDialogClose} variant='contained' color='error'>
                    Cancel
                </Button>
            </DialogActions>
            {/* <TextField
                label="Edit Comment Details"
                size='small'
                fullWidth
                value={selectedComments ? selectedComments.cmmnt_text : ''}
                onChange={e => setSelectedComments(prevState => ({ ...prevState, cmmnt_text: e.target.value }))}
                style={{ marginBottom: '20px' }}
            /> */}
        </div>
    )

    return (
        <Container>
            <Grid container>
                <Grid item sm={12}>
                    <Card style={{ padding: '10px' }}>
                        <CardContent>
                            <div className='customCardheader'>
                                <Typography variant='h4'>
                                    Comment Data
                                </Typography>
                            </div>
                            <form onSubmit={handleSubmit(handleAddComments)}>
                                <Card style={{ marginTop: '20px', padding: '10px' }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name='cmmnt_text'
                                                    control={control}
                                                    defaultValue=''
                                                    sx={{ mb: 2 }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Comment Type *"
                                                            fullWidth
                                                            size='small'
                                                            error={Boolean(errors.cmmnt_text)}
                                                            helperText={errors.cmmnt_text?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="shipper_id"
                                                    control={control}
                                                    defaultValue=''
                                                    render={({ field }) => (
                                                        <FormControl
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            error={Boolean(errors.shipper_id)}
                                                        >
                                                            <InputLabel id="shipper-label">Shipper Name</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId="shipper-label"
                                                                id="shipper_id"
                                                                label="Shipper Name"
                                                                fullWidth
                                                                size="small"
                                                            // Add the multiple prop to enable multi-select
                                                            >
                                                                {/* <MenuItem value={"1"}>Shipper 1</MenuItem>
                          <MenuItem value={"2"}>Shipper 2</MenuItem>
                          <MenuItem value={"3"}>Shipper 3</MenuItem> */}

                                                                {shipperList.map((option) => (
                                                                    <MenuItem key={option.shpr_id} value={option.shpr_id}>
                                                                        {option.name}
                                                                    </MenuItem>
                                                                ))}

                                                            </Select>
                                                            {errors.shipper_id && (
                                                                <ErrorTypography>
                                                                    {errors.shipper_id.message}
                                                                </ErrorTypography>
                                                            )}
                                                        </FormControl>
                                                    )}
                                                />

                                            </Grid>
                                        </Grid>

                                        <Grid container justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
                                            <Button variant='contained' type='submit'>
                                                Add Comment
                                            </Button>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </form>
                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <div className="customCardheader">
                                    <Typography variant="h4"> Comments Table</Typography>
                                </div>
                                <div className='customDataGridTable'>

                                    {
                                        comments.length != 0 ?
                                            <DataGrid
                                                rows={comments}
                                                columns={columns}
                                                pageSize={5}
                                                rowsPerPageOptions={[5, 10, 20]}
                                                disableColumnMenu
                                                disableRowSelectionOnClick
                                            />
                                            :
                                            <div style={{
                                                textAlign: 'center'
                                            }}>
                                                <Typography variant='h6'>
                                                    No Data to Display
                                                </Typography>
                                            </div>
                                    }
                                </div>
                            </div>
                            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                                <div className='customCardheader'>
                                    <Typography variant='h4'>
                                        Edit Comments
                                    </Typography>
                                </div>
                                <DialogContent>
                                    {editDialogContent}
                                </DialogContent>
                            </Dialog>
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                                <div className='customCardheader'>
                                    <Typography variant='h4'>
                                        Delete Comments
                                    </Typography>
                                </div>
                                <DialogContent>
                                    {selectedComments && (
                                        <Typography>
                                            Are you sure you want to delete the Comments: <strong>{selectedComments.cmmnt_text}</strong>?
                                        </Typography>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteConfirm} variant='contained' color='error'>Yes</Button>
                                    <Button onClick={handleDeleteCancel} variant='contained' color='primary'>No</Button>
                                </DialogActions>
                            </Dialog>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>


    )
}

export default Comments