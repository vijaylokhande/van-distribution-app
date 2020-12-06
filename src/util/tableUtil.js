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
    label: "Active"
  },
  {
    value: false,
    label: "Inactive"
  }
];


export const PROPERTY_TYPES_OPTIONS = [
  {
    value: "UNIT",
    label: "UNIT"
  },
  {
    value: "EMPLOYEE_DESIGNATION",
    label: "EMPLOYEE_DESIGNATION"
  },
  {
    value: "ID_PROOF",
    label: "ID_PROOF"
  },
  {
    value: "SHIPMENT_STATUS",
    label: "SHIPMENT_STATUS"
  },
  {
    value: "PAYMENT_MODE",
    label: "PAYMENT_MODE"
  },
  {
    value :"ENTRY_STATUS",
    label :"ENTRY_STATUS"
  },
  {
    value :"COMPANY",
    label :"COMPANY"
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

