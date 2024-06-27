import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag,faUser,faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation,useUserDetailsMutation } from '../app/apiauth';
import Cartpreview from './Cartpreview';

function Header() {
  const [refetchuser] = useUserDetailsMutation();
  const [logoutuser]= useLogoutUserMutation();
  const totalQuantity = useSelector((state) => state.cart.cart.length);
  const navigate = useNavigate(); 
  const [register,stateRegister]= useState(false)
  
    const handleuserauth = ()=>{
      
      stateRegister(previous=>!previous)
  }

  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const Logout = async () => {

    
    try {

      
          await logoutuser();

         
          await refetchuser();

          localStorage.removeItem('user')
        
            setIsOpen(false);
          
            window.location.href="/login"

      }
    
      catch (error) {

      console.log(error)

    }
  }

  const [showCart, setShowCart] = useState(false);

  const handleMouseEnter = () => {
    setShowCart(true);
  };

  const handleMouseLeave = () => {
    setShowCart(false);
  };




  return (
    <div className='headercontainer'>
        <div className='sitelogo'>
          <img src='/uploads/thrifter.png'/>
        </div>
      <div className='cart'>
        <div className='cartitems'>
          <span >{totalQuantity}</span>
        </div>
        
        
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} 
          className='cartwraper'>
         <Link onClick={()=>stateRegister(false)} to="/cart"> <FontAwesomeIcon icon={faShoppingBag} /></Link>
          {showCart && (
          <div className="cart-preview">
              <Cartpreview />
          </div>
          )}
        </div> 
       
        
      </div>


      <div className='headerlink'>

        <Link className='menuheader' to="/" onClick={()=>stateRegister(false)}>Shop</Link>
        <Link className='menuheader' to="/cart"a onClick={()=>stateRegister(false)}>Cart</Link>
        <Link className='menuheader' to="/checkout" onClick={()=>stateRegister(false)}>Checkout</Link>

{localStorage.getItem('user') && localStorage.getItem('user') === 'admin' ? 
  
  <Link className='menuheader' to="/dashboard" onClick={()=>stateRegister(false)}>Dashboard</Link>
:
localStorage.getItem('user') && localStorage.getItem('user') === 'subscriber'?
  <Link className='menuheader' to="/client" onClick={()=>stateRegister(false)}>Dashboard</Link>
:null
}

        
        { !localStorage.getItem('user') ?
        <>
        <div className='iconheader'><FontAwesomeIcon icon={faUser} onClick={handleuserauth}/><FontAwesomeIcon icon={faArrowCircleDown} onClick={handleuserauth}/></div>
        <div style={{display:register? 'block':'none'}} className='userauth'>
          <ul>
            <li><Link to="/login" onClick={()=>stateRegister(false)}>Login</Link></li> 
            <li><Link to="/register" onClick={()=>stateRegister(false)}>Register</Link></li>
          </ul>
        </div>
        </>
        :
        <button className='logoutheader' style={{ border: 'none', background: 'none',fontSize:20,fontFamily:'aviano'}} onClick={Logout} >Logout</button>
  }
      </div>

  
      <div className="dropdown-hamburger-menu">
      <button className="hamburger-icon" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </button>
      <ul className={`menu-items ${isOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={()=>setIsOpen(false)}>Shop</Link></li>
        <li><Link to="/cart"a onClick={()=>setIsOpen(false)}>Cart</Link></li>
        <li><Link to="/checkout" onClick={()=>setIsOpen(false)}>Checkout</Link></li>
        {localStorage.getItem('user') && localStorage.getItem('user') === 'admin' ? 
  
     <li><Link to="/dashboard" onClick={()=>setIsOpen(false)}>Dashboard</Link></li> 
      :
      localStorage.getItem('user') && localStorage.getItem('user') === 'subscriber'?
     <li><Link to="/client" onClick={()=>setIsOpen(false)}>Dashboard</Link></li>
      :null
    }
{ !localStorage.getItem('user') ?
        <>
        
            <li><Link to="/login" onClick={()=>setIsOpen(false)}>Login</Link></li> 
            <li><Link to="/register" onClick={()=>setIsOpen(false)}>Register</Link></li>
        
        </>
        :
        <li  onClick={Logout} >Logout</li>
  }



      </ul>
    </div>


   </div>
  )
}


export default Header