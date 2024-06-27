import React, { useEffect, useState } from 'react'
import Sidebarmenu from './Sidebarmenu'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'
import {
  useGetReviewsforadminQuery, useGetSingleReviewsforadminQuery, useDeletesinglereviewMutation,
  useDeletemultireviewsMutation, useUpdatereviewstatusMutation
} from '../app/apiproducts';

function Productreviews() {


  const [prodata, stateprodata] = useState([])
  const [searchpro, statesearchpro] = useState('')
  const [selectedRows, setSelectedRows] = useState([]);
  const [id, stateSinglereview] = useState('')
  const [updatecommentstatus, stateUpdatestatus] = useState('');
  const [reviewform, stateReviewform] = useState(false);
  const { data, isLoading, refetch } = useGetReviewsforadminQuery(searchpro)
  const { data: singlereview, refetch: reviewSingle } = useGetSingleReviewsforadminQuery(id)
  const [removeprod] = useDeletesinglereviewMutation();
  const [removemultipleprod] = useDeletemultireviewsMutation()
  const [reviewUpdated] = useUpdatereviewstatusMutation()



    useEffect(() => {


    stateprodata(data ? data.Reviews : '')


    

  }, [data])


  const handleDelete = async (id) => {
    try {
      const result = await removeprod(id)

      if (result.data) {

        refetch()
        toast.success(result.data)

      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = async (id) => {


    stateSinglereview(id)
    
    stateReviewform(true)
    
    reviewSingle()

    

  }

  
//multiple products delete
  const handleRowSelected = (rows) => {

    setSelectedRows(rows.selectedRows.map(row => row._id));
  
  };

  const handleRowDeselected = (rows) => {
    
    setSelectedRows(selectedRows.filter(id => !rows.find(row => row._id === id)));
   
  };
  
  
  const updatestatus =async(e)=>{
    e.preventDefault()
  
    try{
  
  
      const result = await reviewUpdated({updatecommentstatus,selectedRows})
  
    if(result){
  
      if(result.data === 'select item review status updated'){
  
        toast.success(result.data)
        
        window.location.reload()
      
        
      }else{
  
        toast.error(result.data)
      }
    
    }else{
  
      console.log('something wron happend')
    }
  
  
  
  }catch(error){
  
    console.log(error)
  }
  
  
  
  
  }

  const handlemultiitemDelete = async (e) => {

    e.preventDefault()
    try {
      
      
      const result = await removemultipleprod(selectedRows)
      if (result) {

        if(result.data !== 'item not selected'){
          
          toast.success(result.data)

              window.location.reload()
        }else{

          toast.error(result.data)

        }

       

      } else {

        console.log('no response')
      }

    } catch (error) {
      console.error('Error deleting records:', error);
    }


  }



  const StarRatingCell = ({ value }) => { //star rating
    const stars = [];
    for (let i = 0; i < value; i++) {
      stars.push(<span key={i}>&#9733;</span>); // Unicode for a star
    }
    return <div>{stars}</div>;
  };





  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Rating',
      sortable: true,
      cell: row => <StarRatingCell value={row.rating} />
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Comment',
      selector: (row) => row.comment,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <FontAwesomeIcon icon={faRecycle} onClick={() => handleDelete(row._id)} />
          <FontAwesomeIcon icon={faEye} onClick={() => handleEdit(row._id)} />
        </div>
      ),
    },
    // Add more columns as needed
  ];




  return (
    <div className='dashboardcontainer'>



      <Sidebarmenu />


      <div className="marquee-container">


        <h5 style={{ textAlign: 'center', margin: 35 }}>Product Reviews</h5>

        <div style={{ display: 'flex', margin: 'auto', width: '20%' }} className='searchproduct'>
          <input style={{ outline: 'none', borderRadius: 20, width: '100%' }} type="text" placeholder='search products' onChange={(e) => statesearchpro(e.target.value)} />
          <div><FontAwesomeIcon icon={faSearch} /></div>
        </div>
        {prodata && prodata.length > 0 ?
          <>
            <div className='selecteddeleteitem'> <a onClick={handlemultiitemDelete}>Delete Selected</a><div>({selectedRows.length})</div></div>

            <div className='statusbtn'>
              <form onSubmit={updatestatus}>
              <button type='submit' style={{backgroundColor:'white',
              border:'none',color:'red',textDecoration:'underline'}}>Update({selectedRows.length})</button>
              <select name='status'
                onChange={(e) => stateUpdatestatus(e.target.value)}>
                <option value=''>Select</option>
                <option value='pending'>Pending</option>
                <option value='approved'>Approved</option>
              </select>
              </form>

            </div>

          </>
          : null}


        <div className='datatablecontainer' style={{ width: '80%', margin: 'auto' }}>
          
          <DataTable
            columns={columns}
            data={prodata}
            pagination
            highlightOnHover
            selectableRows
            selectableRowsHighlight
            selectableRowsSelected={selectedRows}
            onSelectedRowsChange={handleRowSelected}
            onDeselectedRowsChange={handleRowDeselected}
          />

          <div style={{display:reviewform? 'block':'none'}} className='reviewmagic'>


            <div class="card">

              <div class="card-body">
                <button className='clientreviewbtn' onClick={()=>stateReviewform(false)}>x</button>
                <h6 style={{marginTop:20}}>Client Review</h6>

                <p>{singlereview?singlereview[0].name:""}</p>
                <p style={{color:'gold'}}><StarRatingCell value={singlereview?singlereview[0].rating:""} /></p>
                <p className='commentset'>{singlereview?singlereview[0].comment:""}</p>

              </div>
            </div>


          </div>




        </div>




      </div>


    </div>

  )
}

export default Productreviews