import { textFilter } from 'react-bootstrap-table2-filter';

export const getTableColumn = (data) => {
  if (data !== null && data !== undefined) {
    var keys = Object.keys(data);
    var columns = keys.map(key => (
      {
        "dataField": key,
        "text": key,
        "sort": true,
        filter: textFilter()
      }
    ));
    return columns;
  }
  return [];
};



export const ACTIVE_STATUS_OPTIONS = [
  {
    value: true,
    label: "true"
  },
  {
    value: false,
    label: "false"
  }
];


export const pageinationOptions = (total) => {

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing { from} to { to} of { size} Results
    </span>
  );

  return {
    paginationSize: 4,
    pageStartIndex: 0,
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [{
      text: '5', value: 5
    }, {
      text: '10', value: 10
    }, {
      text: 'All', value: total
    }]
  };
};

