import React, { useEffect, useState } from 'react'
import Sidebarmenu from './Sidebarmenu'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'
import { useGetAllProductsQuery, useDeleteSingleProductMutation, useDeleteMultipleProductMutation } from '../app/apiproducts';


function Allproducts() {


  const [prodata, stateprodata] = useState([])
  const [searchpro, statesearchpro] = useState('')
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);
  const { data, isLoading, refetch } = useGetAllProductsQuery(searchpro)
  const [removeprod] = useDeleteSingleProductMutation();
  const [removemultipleprod] = useDeleteMultipleProductMutation()



  const handleDelete = async (id) => {
    try {
      const result = await removeprod(id)

      if (result) {

        refetch()

        toast.success('product delete successfully')

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

      const result = await removemultipleprod(ids)

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


    stateprodata(data)

     refetch()


  }, [data])


  const columns = [
    {
      name: 'Name',
      selector: (row) => row.productname,
      sortable: true,
    },
    {
      name: 'Image',
      selector: (row) => <img src={`/uploads/${row.productimage}`} alt="User" style={{ width: '50px', height: '50px' }} />,
      sortable: true,
    },
    {
      name: 'Categories',
      selector: (row) => row.productcat,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <a style={{ marginRight: 20 }} href={`allproducts/${row._id}`} ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></a>
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

        <h5 style={{ textAlign: 'center', margin: 35 }}>Products</h5>

        <div style={{ display: 'flex', margin: 'auto', width: '20%' }} className='searchproduct'>
          <input style={{ outline: 'none', borderRadius: 20, width: '100%' }} type="text" placeholder='search products' onChange={(e) => statesearchpro(e.target.value)} />
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

export default Allproducts