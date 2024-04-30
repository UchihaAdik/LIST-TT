import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Typography, Button, ThemeProvider, createTheme } from "@mui/material";
import { styled } from '@mui/system';

const columns = [
  { field: "kinopoiskId", headerName: "ID", width: 90 },
  { field: "posterUrl", headerName: "Image", width: 100,sortable: false, renderCell: (params) => <ImageCell value={params.value} /> },
  { field: "nameRu", headerName: "nameEn", width: 250 },
  { field: "year", headerName: "year", width: 120 },
  { field: "ratingKinopoisk", headerName: "ratingKinopoisk", width: 120 },
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
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1", {
          headers: {
            'X-API-KEY': 'e414ddf7-9028-42df-8bdd-c2660bfed3e7'
          }
        });
        const responseData = await response.json();
        setMovies(responseData.items); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: darkMode ? "#333" : "#fff" }}>
      <Button onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </Button>
      
      {movies && (
        <DataGrid
          rows={movies}
          columns={columns}
          pageSize={5}
          onRowClick={handleRowClick}
          autoHeight
          disableColumnFilter={false}
          disableColumnMenu={false}
          sortingOrder={["asc", "desc"]}
          checkboxSelection
          getRowId={(row) => row.kinopoiskId}
          rowHeight={120}
          {...(darkMode && { className: "dark-mode" })}
        />
      )}
      
      <Modal open={!!selectedRow} onClose={handleCloseModal}>
        <ModalContainer >
          <Typography variant="h6">Details</Typography>
          {selectedRow && (
            <div style={{ height: "90vh", width: "100%", color:darkMode?"#fff" : "#333"}}>
              <Typography>ID: {selectedRow.kinopoiskId}</Typography>
              <Typography>Name: {selectedRow.nameRu}</Typography>
              <Typography>Year: {selectedRow.year}</Typography>
              <img src={selectedRow.posterUrl} alt="Image" style={{ width: '100%',  }} />
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


