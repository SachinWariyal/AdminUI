import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
export default function Search({onSearch}) {
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Below we are using useEffect hook provided by React. Which is taking care of making the search request by taking the Search Term from user 
   * We have also implemented debounce, which fetches the searched entry by user after 800ms, This is usefull when we have to prevent API call in
   * keystroke and after doing this, once the user finished typing the call is made.
   * 
   * Here it is made for showing how search happens after 800ms
   */

  useEffect(() => {
    // Created a debounce function to delay the search
    const debounce = setTimeout(() => {
      // Triggered the search with the current value of searchTerm
      onSearch(searchTerm);
    }, 800);

    // Cleanup the previous timeout if searchTerm changes before the debounce is executed
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
  };

  return (
    <div className="search-bar">
      <TextField 
      fullWidth
      id="fullWidth" 
      label="Search by name, email or role" 
      variant="outlined" 
    
      value={searchTerm}
      onChange={handleInputChange}
      />
    </div>
  );
}
