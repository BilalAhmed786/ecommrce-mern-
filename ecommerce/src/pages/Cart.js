import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { decreaseQuantity, removeFromCart, increaseQuantity } from '../reducers/cartslice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetCurrencyQuery,useGetProductssliderQuery} from '../app/apiproducts';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Cart() {

 const{data,isLoading} =useGetCurrencyQuery()
 const {data:sliderdata} =useGetProductssliderQuery()

 




   

  const cartItems = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId) => {

    dispatch(removeFromCart(productId));
  
    toast.success("item removed successfully")
  };


  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const getTotalPrice = () => {
    
      return cartItems.reduce((total, item) => total + item.saleprice * item.quantity, 0);
  
  };
    
    
    const carttotal= getTotalPrice();

    localStorage.setItem('carttotal',carttotal)


    //image crousel

    const settings = {
      dots: true,
      infinite: true,
      speed: 200,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        { //for media
          breakpoint: 750,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },  { //for media
          breakpoint: 1050,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600, //for media

          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
      ]
    };
 //image crousel end
   
    if (isLoading) return <div>Loading...</div>;
  return (
    <div className='cartcontainer'>

       <h2 style={{textAlign:'center',fontFamily:'aviano',padding:45 }}>Cart</h2>
     
      {cartItems.length === 0 ?


        <h6 style={{ display:'block',textAlign: "center" }}>cart is empty</h6>

        :

        (
          <>

            <table className="carttable">
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th className='qtycart'>Qty</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item, index) => (

                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td><div><img style={{ width: 50 }} src={`/uploads/${item.productimage}`} alt='' /></div><div>{item.productname}</div></td>
                    <td>{data? data[0].currency:''}{item.saleprice}</td>
                    <td><button className='cartincbtnleft'  onClick={() => handleDecreaseQuantity(item._id)}> <b>-</b> </button>{item.quantity} <button className='cartincbtnright' onClick={() => handleIncreaseQuantity(item._id)} disabled={item.quantity === item.inventory}
                    > <b>+</b> </button></td>
                    <td><button style={{color:'red',background:'none',border:"none",cursor:'pointer'}} onClick={() => handleRemoveFromCart(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>

         <div className='proceedcheckout'>
            <h5 className='totalprice'>Total Price: {data?data[0].currency:''}{getTotalPrice()}</h5>
                  <Link to='/checkout'>
                  <button  className='btn btn-danger'>Proeced to Checkout</button>
                  </Link>
            </div>


      <div className='slidecrousel'>
      <h2 style={{marginBottom:22,fontFamily:'aviano'}}>Latest Products</h2>
      <Slider {...settings}>
        {sliderdata?sliderdata.map((product) => (
         
          <div className='latestprocrous'>
            <Link key={product.id} to={`/product/${product._id}`}>
            <img className='imgcrousel' src={`/uploads/${product.productimage}`} alt={product.name} />
            </Link> 
            <p style={{textAlign:'center',textDecoration:'none'}}>{product.productname}</p>
            <p>{data? data[0].currency:''}{product.saleprice}</p>
          </div>
       
        )):null}
      </Slider>
    </div>

           
          </>
         
        )
      }

    </div>
  )
}

export default Cart
