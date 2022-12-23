import React from 'react';
import { Input } from 'antd';

import './search-panel.css';

const { Search } = Input;

function SearchPanel({ onSearchChange }) {
  return (
    <Search
      onChange={onSearchChange}
      allowClear
      placeholder="Type to search..."
      style={{
        width: 938,
        padding: 36,
      }}
    />
  );
}

export default SearchPanel;
