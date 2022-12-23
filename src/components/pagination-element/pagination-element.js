import React from 'react';
import { Pagination } from 'antd';

import './pagination-element.css';

function PaginationEl({ totalResults, currentPage, onPaginationChange, inRated }) {
  return (
    <div className="pagination">
      {totalResults && !inRated ? (
        <Pagination
          current={currentPage}
          onChange={onPaginationChange}
          total={totalResults}
          showSizeChanger={false}
          defaultPageSize={20}
        />
      ) : null}
    </div>
  );
}

export default PaginationEl;
