import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
export default function Search({onSearch}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Created a debounce function to delay the search
    const debounce = setTimeout(() => {
      // Triggered the search with the current value of searchTerm
      onSearch(searchTerm);
    }, 800);

    // Cleanup the previous timeout if searchTerm changes before the debounce is executed
    return () => clearTimeout(debounce);
  }, [searchTerm, onSearch]);

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
