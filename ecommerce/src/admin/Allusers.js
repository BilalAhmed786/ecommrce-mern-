import React, { useEffect, useState } from 'react'
import Sidebarmenu from './Sidebarmenu'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEdit, faSearch} from '@fortawesome/free-solid-svg-icons';
import { useAllUserQuery, useDeleteUserMutation,useDeletemultipleUserMutation,useSingleUserQuery, useUpdateSingleUserMutation } from '../app/apiusers';
import { toast } from 'react-toastify'
function Allusers() {
  
  const [prodata, stateprodata] = useState([])
  const [searchpro, statesearchpro] = useState('')
  const [id, setSingleuser] = useState('');
  const [formtoggle, magicformtoggle] = useState(false)
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(0);
  const { data, isLoading, refetch } = useAllUserQuery(searchpro)
  const [removeprod] = useDeleteUserMutation();
  const{data:singleuser,isLoading:loading,refetch:singlerefetch}=  useSingleUserQuery(id)
  const[updateuserrecord] = useUpdateSingleUserMutation()
  
  const [removemultipleuser] = useDeletemultipleUserMutation()


  useEffect(() => {


    stateprodata(data?data.Users:'')

    userUpdate(singleuser?singleuser[0]:'')

     refetch()


  }, [data,singleuser])




  const [updateuser,userUpdate] =useState({

    name:'',
    email:'',
    role:''


  })

  const updateuserhandle = (e)=>{

    const{name,value}=e.target

    userUpdate({

      ...updateuser,[name]:value

    })
    

  }


  const updateformhandle =async(e)=>{

      e.preventDefault()

      try{
        
        const result = await updateuserrecord(updateuser)

        if(result){

          if(result.data==='user updated!!'){
            toast.success(result.data)
          }else{

            toast.error(result.data)
          }


        }else{

          console.log('somthing went wrong')
        }


}catch(error){

  console.log(error)
}


  }




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

  const handleEdit = (id)=>{
    setSingleuser(id)
    magicformtoggle(true)
    singlerefetch()
    
   
  }

  //multiple products delete
  const handleRowSelected = (rows) => {

    setSelectedRows(rows.selectedRows);
    setSelectedItems(rows.selectedCount)
  };

  const handlemultiitemDelete = async(e) => {
  
  try {
      // Extract IDs of selected rows
      const ids = selectedRows.map(row => row._id);

      const result = await removemultipleuser(ids)

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
      name: 'Role',
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(row._id)} />
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

      <h5 style={{ textAlign: 'center', margin: 35 }}>Registerd Users</h5>

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
        <div style={{display:formtoggle? 'block':'none'}}>
              <div className='updateuser'>

              <h6 style={{ textAlign: 'center' }}>Edit User</h6>
              <form onSubmit={updateformhandle}>
              <a className='btn btn-danger'
              style={{
                float: 'right', marginTop:-40, marginRight: -20,
                borderRadius: 25, fontSize: 12
              }} onClick={()=>magicformtoggle(false)}>X</a>
              <div className='form-group'>
                <label>Name</label><br/>
                <input type="text" name="name" value={updateuser.name} onChange={updateuserhandle}/>
              </div>
              <div className='form-group'>
                <label>Email</label><br/>
                <input type="text" name="email" value={updateuser.email} onChange={updateuserhandle} />
              </div>
              <div className='form-group'>
                <label>Role</label><br/>
                <input type="text" name="role" value={updateuser.role} onChange={updateuserhandle}/>
              </div>
              <input style={{ display: 'block', margin: 'auto' }}
              className='btn btn-danger'
              type="submit" value="update" />
            </form>

              </div>
          </div>  
      </div>




    </div>


  </div>

)
}

export default Allusers