import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStripePaymentMutation } from '../app/apiproducts';
import { useUserDetailsMutation } from '../app/apiauth';
import { useGetBillingaddressQuery } from '../app/apiorders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Checkout(props) {
    const navigate = useNavigate();
    const shipmentcharges = props.data?.data?.[0]?.shipment || 0;
    const currency = props.data?.currency?.[0]?.currency || '';
    const cartdetails = useSelector((state) => state.cart.cart);
    
   
    const [data] = useUserDetailsMutation();
    const [userinfo, setUserinfo] = useState('');
    const { data: billingaddress, isLoading } = useGetBillingaddressQuery(userinfo ? userinfo.useremail : '');

    let productname = [];
    let productsprice = [];
    let inventory = [];
    let productid = [];
    let productquantity = [];

    if (cartdetails.length > 0) {
        productname = cartdetails.map((item) => item.productname);
        productsprice = cartdetails.map((item) => item.saleprice);
        inventory = cartdetails.map((item) => item.inventory);
        productid = cartdetails.map((item) => item._id);
        productquantity = cartdetails.map((quantity) => quantity.quantity);
    } else {
       
        navigate('/');
    
    }


    // give carttotal 
    const getTotalPrice = () => {
    
        return cartdetails.reduce((total, item) => total + item.saleprice * item.quantity, 0);
    
    };

    // totalbill 
   
    if(cartdetails){

    
        var carttotal = getTotalPrice();
        var totalamount = parseInt(carttotal) + parseInt(shipmentcharges)


    
    }



    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const result = await data();
                if (result) {
                    setUserinfo(result.data);
                    setPaymentMethod(billingaddress ? billingaddress[0] : '');
                } else {
                    console.log('Something went wrong');
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserInfo();
    }, [billingaddress]);

    const [paymentMode] = useStripePaymentMutation();
    const stripe = useStripe();
    const elements = useElements();
    const [paymentMethod, setPaymentMethod] = useState({
        name: '',
        email: '',
        mobile: '',
        city: '',
        address: '',
        stripepayment: '',
    });

    const handlePaymentMethodChange = (e) => {
        const { name, value } = e.target;
        setPaymentMethod({
            ...paymentMethod,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod.stripepayment === 'Stripe') {
            const { token, error } = await stripe.createToken(elements.getElement(CardElement));
            if (token) {
                const result = await paymentMode({
                    token: token.id,
                    paymentMethod, productname,
                    productid, productsprice, inventory, productquantity,carttotal, shipmentcharges, totalamount,
                });

                if (!result.data.msg) {
                    toast.error(result.data);
                } else {
                    // localStorage.removeItem('cartItems');
                    window.location.href = 'http://localhost:3000/';
                }
            } else {
                toast.error(error.message);
            }
        } else {
            const result = await paymentMode({
                paymentMethod, productname,
                productid, productsprice, inventory, productquantity, carttotal, shipmentcharges, totalamount,
            });

            if (!result.data.msg) {
                toast.error(result.data);
            } else {
                toast.success(result.data.msg);
                localStorage.removeItem('cartItems');
                window.location.href = 'http://localhost:3000/';
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='checkoutcontainer'>
            <h2 style={{ textAlign: 'center', padding: 45, fontFamily: 'aviano' }}>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <div className='rowviewcontain'>
                    <div className='rowview'>
                        <div className='orderform'>
                            <div className='form-group'>
                                <label htmlFor="name">Name</label><br />
                                <input type='text' name="name" value={paymentMethod.name || ''} onChange={handlePaymentMethodChange} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="email">Email</label><br />
                                <input type='text' name="email" value={paymentMethod.email || ''} onChange={handlePaymentMethodChange} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="mobile">Contact no</label><br />
                                <input type='text' name="mobile" value={paymentMethod.mobile || ''} onChange={handlePaymentMethodChange} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="city">City</label><br />
                                <input type='text' name="city" value={paymentMethod.city || ''} onChange={handlePaymentMethodChange} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="address">Address</label><br />
                                <textarea className='chekcoutaddress' cols='50' rows='5' name="address" value={paymentMethod.address || ''} onChange={handlePaymentMethodChange}></textarea>
                            </div>
                        </div>
                        <div className="card" style={{ width: '24rem', height: '16rem', overflow: 'auto' }}>
                            <div className="card-body">
                                <h5 className="card-title">Order Details</h5>
                                <p><b>Products name</b></p>
                                {cartdetails.map((product, index) => (
                                    <div style={{ listStyleType: 'none' }} key={index}>
                                        <li><b>{index + 1}</b>. {product.productname} x {product.quantity}</li>
                                    </div>
                                ))}
                                <p><b>CartTotal</b>: {carttotal}</p>
                            </div>
                        </div>
                    </div>
                    <div className='placeorder' style={{ display: 'block', float: 'right' }}>
                        <label><b>Shipment charges:</b> {shipmentcharges}</label><p></p>
                        <label><b>Total Amount:</b> {currency}{totalamount}</label><p></p>
                        <div>
                            <h5>Payment Methods</h5>
                            <label>
                                <input
                                    type="radio"
                                    name="stripepayment"
                                    value="Stripe"
                                    checked={paymentMethod.stripepayment === 'Stripe'}
                                    onChange={handlePaymentMethodChange}
                                    required
                                />
                                Stripe
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="stripepayment"
                                    value="cod"
                                    checked={paymentMethod.stripepayment === 'cod'}
                                    onChange={handlePaymentMethodChange}
                                    required
                                />
                                Cod
                            </label>
                        </div>
                        {paymentMethod.stripepayment === 'Stripe' && <CardElement />}
                        <button className='btn btn-danger checkoutpay' type="submit">Pay</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Checkout;
