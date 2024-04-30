import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Typography, Button, ThemeProvider, createTheme } from "@mui/material";
import { styled } from '@mui/system';

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "image", headerName: "Image", width: 150, sortable: false, renderCell: (params) => <ImageCell value={params.value} /> },
  { field: "description", headerName: "Description", width: 250 },
  { field: "date", headerName: "Date", width: 120 },
  { field: "number", headerName: "Number", width: 120 },
];

const rows = [
  { id: 1, image: "https://images.pexels.com/photos/1723637/pexels-photo-1723637.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Description 1", date: "01/01/2024", number: 10 },
  { id: 2, image: "https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Description 2", date: "02/01/2024", number: 20 },
];

const ModalContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

const ImageCell = ({ value }) => (
  <img src={value} alt="Image" style={{ width: '100%', height: 'auto' }} />
);

const App = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [darkMode, setDarkMode] = useState(false);


  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode)); 
      return newMode;
    });
  };

  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode')); 
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
    }
  }, []);



  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const theme = createTheme({ 
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: "100vh", width: "100%", backgroundColor: darkMode ? "#333" : "#fff" }}>
      <Button onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </Button>
      
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={handleRowClick}
          autoHeight
          disableColumnFilter={false}
          disableColumnMenu={false}
          sortingOrder={["asc", "desc"]}
          checkboxSelection
          {...(darkMode && { className: "dark-mode" })}
        />
        <Modal open={!!selectedRow} onClose={handleCloseModal}>
          <ModalContainer >
            <Typography variant="h6">Details</Typography>
            {selectedRow && (
              <div style={{ height: "90vh", width: "100%", color:darkMode?"#fff" : "#333"}}>
                <Typography>ID: {selectedRow.id}</Typography>
                <Typography>Description: {selectedRow.description}</Typography>
                <Typography>Date: {selectedRow.date}</Typography>
                <Typography>Number: {selectedRow.number}</Typography>
                <img src={selectedRow.image} alt="Image" style={{ width: '100%',  }} />
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            )}
          </ModalContainer>
        </Modal>
      </div>
    </ThemeProvider>
  );
};

export default App;


