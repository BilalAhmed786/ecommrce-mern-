import React, { useEffect, useState } from 'react'
import Sidebarmenu from './Sidebarmenu'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'
import { useAllOrdersforadminQuery,useDeleteSingleOrderMutation,useDeleteMultipleOrderadminMutation } from '../app/apiorders';




function Orders() {

  const [prodata, stateprodata] = useState([])
  const [search, statesearch] = useState('')
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);
  const { data, isLoading, refetch } = useAllOrdersforadminQuery(search)
  const [removeorder] = useDeleteSingleOrderMutation();
  const [removemultipleorders] = useDeleteMultipleOrderadminMutation()

  
  const handleDelete = async (id) => {
    try {
      const result = await removeorder(id)

      if (result.data) {

        refetch()

        toast.success(result.data)

      }
    } catch (error) {
      console.log(error)
    }
  }

  //multiple products delete
  const handleRowSelected = (rows) => {

    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount)
  };


  const handlemultiitemDelete = async () => {
    try {
      // Extract IDs of selected rows
      const ids = selectedRows.map(row => row._id);

      const result = await removemultipleorders(ids)

      if (result) {

        if (result.data !== 'no item selected') {


          toast.success(result.data)
         
          window.location.reload()
        

        } else {

          toast.error(result.data)
        }

      } else {

        console.log('no response')
      }

    } catch (error) {
      console.error('Error deleting records:', error);
    }


  }

  useEffect(() => {


    stateprodata(data?data.orders:'')

    refetch()


  }, [data,selectedRows,selectedItems])


  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => row.timestamp,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <a style={{ marginRight: 20 }} href={`orders/${row._id}`} ><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></a>
          <FontAwesomeIcon icon={faRecycle} onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
    // Add more columns as needed
  ];




  return (
    <div className='dashboardcontainer'>



    <Sidebarmenu />


    <div className="marquee-container">

      <h5 style={{ textAlign: 'center', margin: 35 }}>Orders Detail</h5>

      <div style={{ display: 'flex', margin: 'auto', width: '20%' }} className='searchproduct'>
        <input style={{ outline: 'none', borderRadius: 20, width: '100%' }} type="text" placeholder='search products' onChange={(e) => statesearch(e.target.value)} />
        <div><FontAwesomeIcon icon={faSearch} /></div>
      </div>
      {prodata && prodata.length > 0 ?
        <div className='selecteddeleteitem'> <a onClick={handlemultiitemDelete}>Delete Selected</a><div>({selectedItems})</div></div>
        : null}

      <div style={{ width: '80%', margin: 'auto' }}>
        <DataTable
          columns={columns}
          data={prodata}
          pagination
          highlightOnHover
          selectableRows
          selectableRowsHighlight
          selectableRowsSelected={selectedRows}
          onSelectedRowsChange={handleRowSelected}
        
        />

      </div>




    </div>


  </div>
  )
}

export default Orders