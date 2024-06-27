import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faShoppingBag, faPlus, faTruck,faFolderOpen, faRubleSign, faClipboardList,faKey,faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import { useAllOrdersforadminQuery } from '../app/apiorders';
import { useGetReviewsforadminQuery } from '../app/apiproducts';
function Sidebarmenu() {
          const[search,searchItem]= useState('')
          
          const {data:allorders,isLoading,refetch:ordersRec} =  useAllOrdersforadminQuery(search)
          
          const {data:allreviews,refetch} =  useGetReviewsforadminQuery(search)
          
          
          const reviewpend = () => {
            const filtered = allreviews?allreviews.Reviews.filter(record => record.status === 'pending'):'';
            return filtered.length
          };

          
          const orderpend = () => {
            const filtered = allorders?allorders.orders.filter(record => record.status === 'pending'):'';
            return filtered.length
          };
         
        
     

 
   

   
  //toggle sidebar menu
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    setIsOpen(true);
    ordersRec()
    refetch()
  };
  const closeSidebar = () => {

    setIsOpen(false);
  };



  return (
    <div className='leftsidebarmenu'>
      <div><button className='dashmenu' onClick={openSidebar}><FontAwesomeIcon icon={faBars} /></button></div>
      <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
        <div><button className='btncloseside' onClick={closeSidebar}>x</button></div>
        <div className='no-marker'>
        <ul>

          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faUser} /> <Link className='menuitems' to='/alluser'>All User</Link></li>
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faShoppingBag} /><Link className='menuitems' to='/allproducts'>Products</Link></li>
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faPlus} /><Link className='menuitems' to='/addproduct'>Add Product</Link></li>
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={regularStar} /><Link className='menuitems' to='/productreviews'>Products Reviews</Link></li>{reviewpend() > 0 ? <span className='reviewtagstatus'>{ reviewpend()}</span>:''}
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faClipboardList} /><Link className='menuitems' to='/orders'>Orders</Link></li>{orderpend() > 0 ? <span className='ordertagstatus'>{ orderpend()}</span>:''}
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faFolderOpen} /><Link className='menuitems' to='/addcategory'>Categories</Link></li>
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faRubleSign} /><Link className='menuitems' to='/addcurrency'>Currency</Link></li>
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faTruck} /><Link className='menuitems' to='/shipment'>Shipment</Link></li>
          <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faKey} /><Link className='menuitems' to='/changepass'>Change Password</Link></li>

        </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebarmenu