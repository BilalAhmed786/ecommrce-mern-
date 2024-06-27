import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useGetReviewsforadminQuery } from '../app/apiproducts';

function Testcomponent() {

    const [searchpro, statesearchpro] = useState('')
    const { data, isLoading, refetch } = useGetReviewsforadminQuery(searchpro)
    const [selectedRows, setSelectedRows] = useState([]);


    


    useEffect(()=>{

        refetch()
       
        
    },[data])




      const columns = [
     
        {
            name: 'Name',
            selector: (row) =>row.name,
            sortable: true,
          },
          {
            name: 'Rating',
            sortable: true,
            selector: (row) =>row.rating
          },
          {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
          },
        // Add more columns as needed
      ];
    
      const handleRowSelected = (rows) => {
    
        
        setSelectedRows(rows.selectedRows.map(row => row._id));
      };
    
      const handleRowDeselected = (rows) => {
        setSelectedRows(selectedRows.filter(_id => !rows.find(row => row._id === _id)));
      };


      const handleUpdate = async () => {

           console.log(selectedRows)

      }



  return (
    <div>
    <DataTable
      title="My Data Table"
      columns={columns}
      data={data?data.Reviews:''}
      selectableRows
      selectableRowsHighlight
      selectableRowsSelected={selectedRows}
      onSelectedRowsChange={handleRowSelected}
      onDeselectedRowsChange={handleRowDeselected}
    />
    <button onClick={handleUpdate}>Update Selected</button>
  </div>
  )
}

export default Testcomponent