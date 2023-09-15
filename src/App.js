import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "./components/Search";
import {
  TextField,
  Box,
  TableContainer,
  Checkbox,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import LastPageOutlinedIcon from "@mui/icons-material/LastPageOutlined";
import FirstPageTwoToneIcon from "@mui/icons-material/FirstPageTwoTone";
import EditIcon from "@mui/icons-material/Edit";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const usersPerPage = 10;



  /**
   * Make API call to get the users list and store it to display the users
   *
   * @returns { Array.<Product> }
   *      Array of users with complete data on all available products
   * 
   * 
   * Example for successful response from backend:
   * 
   * [
          {
            "id": "1",
            "name": "Aaron Miles",
            "email": "aaron@mailinator.com",
            "role": "member"
          },
          {
            "id": "2",
            "name": "Aishwarya Naik",
            "email": "aishwarya@mailinator.com",
            "role": "member"
          },
          {
            "id": "3",
            "name": "Arvind Kumar",
            "email": "arvind@mailinator.com",
            "role": "admin"
          }
      ]
   */


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error Fetching data", error);
      }
    };

    fetchData();
  }, []);

  /** 
  
  The below function is used to delete all the selected values, i.e, The entries in which the checkbox is clicked.
  step 1: Create a new array of users by filtering out the selected users
  step 2: Clear the selectedUsers array
  
  */
  const handleAllSelectedDelete = () => {
    // step 1:
    const updatedUsers = users.filter(
      (user) => !selectedUsers.includes(user.id)
    );
    setUsers(updatedUsers);
    // step 2:
    setSelectedUsers([]);
  };

  /** 

    The Below function is for deleting only the selected entries by clicking on particular checkboxs. This is done by
    clicking the delete icon in front of each entry.

    step 1: Create a new array of users by filtering out the user with the specified userId
    step 2: If the deleted user was selected, remove it from the selectedUsers array
  */

  const handleDelete = (userId) => {
    // step 1
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    // step 2
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((id) => id !== userId)
    );
  };
   

  /**
   * 
   * @param { String } userId 
   * 
   * This function is built to handle the checkbox change when different checkboxes are clicked
   */
  const handleCheckboxChange = (userId) => {
    // Toggle the selection of a user
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  /** 
   * 
   * @param {String} userId 
   * 
   * This function is used handle the edit and takes userId as parameter to get the selected user correctly.
   */
  const handleEdit = (userId) => {
    // Set the user ID being edited
    setEditingUserId(userId);
    // Initialize the edited user name with the current user name
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setEditedUserName(userToEdit.name);
    }
  };

  /**
   * 
   * @param {String} userId 
   * 
   * The below function is made to save the changes when any user's name is changed and later it sets the user as the updated value 
   * using setUsers.
   */

  const handleSave = (userId) => {
    // Update the user's data in the state
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        // Update user data here
        return {
          ...user,
          name: editedUserName, // Update the user's name with the edited value
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    // Reset the editing state
    setEditingUserId(null);
    setEditedUserName("");
  };


  /**
   * 
   * @param {String} term
   * 
   * The handleSearch funtion is used to get value as term and setSearchTerm with the provided value by user.
   * After that it reset to page 1 when searching using setCurrentPage
   */
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  /**
   * 
   * @param {{ target: { value: string }} event 
   *        JS event object emitted from the search input field
   * @param {String} newPage 
   * 
   *    The below function is used to handlePageChange when the respective button is clicked.
   */


  const handlePageChange = (event, newPage) => {
    // Check if the "First Page" or "Last Page" button was clicked
    if (newPage === 1) {
      // Go to the first page
      setCurrentPage(1);
    } else if (newPage === Math.ceil(filteredUsers.length / usersPerPage)) {
      // Go to the last page
      setCurrentPage(Math.ceil(filteredUsers.length / usersPerPage));
    } else {
      // Go to the selected page
      setCurrentPage(newPage);
    }
    console.log("newPage:", newPage);
    console.log("currentPage:", currentPage);
  };

  /**
   * The below function takes the users and filters them while searching for any particular entry using search field.
   */

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the index range for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="App">
      <Box>
        {/* <h1 className='App-header'>Admin UI</h1> */}
        <Search onSearch={handleSearch} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>
                  <Checkbox />
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell  className="email-cell" style={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        value={editedUserName} // Replace with the appropriate field value
                        onChange={(e) => setEditedUserName(e.target.value)} // Update the edited user name
                      />
                    ) : (
                      <Typography variant="body1">{user.name}</Typography>
                    )}
                  </TableCell>
                  <TableCell><Typography variant="body1">{user.email}</Typography></TableCell>
                  <TableCell><Typography variant="body1">{user.role}</Typography></TableCell>
                  <TableCell>
                    <div center-action-buttons>
                      {editingUserId === user.id ? (
                        <IconButton
                          aria-label="save"
                          color="primary"
                          onClick={() => handleSave(user.id)}
                        >
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEdit(user.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(user.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </TableCell>{" "}
                  {/* Replace with actual actions */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="pagination">
          <div className="delete-button">
            <Button
              variant="contained"
              color="error"
              onClick={handleAllSelectedDelete}
            >
              Delete Selected
            </Button>
          </div>
          {/* <Pagination/>     */}
          <Box className="pagination-center">
            <div className="prev-button">
              <Button onClick={() => handlePageChange(null, 1)}>
                {" "}
                {/* Go to the first page */}
                <FirstPageTwoToneIcon />
              </Button>
            </div>
            <Pagination
              count={Math.ceil(filteredUsers.length / usersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
              size="small" 
            />
            <Box className="last-button">
              <Button
                onClick={() =>
                  handlePageChange(
                    null,
                    Math.ceil(filteredUsers.length / usersPerPage)
                  )
                }
              >
                {" "}
                {/* Go to the last page */}
                <LastPageOutlinedIcon />
              </Button>
            </Box>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default App;
