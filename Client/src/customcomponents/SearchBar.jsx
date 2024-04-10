import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ searchTerm, onSearchChange, onSearch }) => {
  return (
    <div className="relative w-96">
      <div className="flex items-center bg-lightish-white  border border-Teal p-2">
        <div className="mr-2">
          <FiSearch className="w-6 h-6 text-Teal" />
        </div>
        <input
          type="text"
          placeholder="Search for courses..."
          name="searchbar"
          id="searchbar"
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full border-none outline-none bg-transparent"
        />
        {/* <button className="btn btn-primary" onClick={onSearch}>
          Search
        </button> */}
      </div>
    </div>
  );
};

export default SearchBar;