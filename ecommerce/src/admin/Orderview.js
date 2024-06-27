import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Sidebarmenu from './Sidebarmenu';
import { useGetSingleorderforadminQuery, useSingleOrderStatusMutation } from '../app/apiorders';
import { useGetCurrencyQuery } from '../app/apiproducts';
import { toast } from 'react-toastify';

function Orderview() {
    const navigate =useNavigate();
    const { id } = useParams();
    const { data, error, isLoading, refetch } = useGetSingleorderforadminQuery(id);
    const { data: currency } = useGetCurrencyQuery();
    const [ordersingleStatus] = useSingleOrderStatusMutation();
    const [validation, setValidation] = useState('');
    const [orderstatus, setOrderstatus] = useState({ status: '' });

    

    const userdata = data && data.length > 0 ? data[0] : null;
    const curr = currency && currency.length > 0 ? currency[0] : {};

    let productsname = [];
    let productsquantity = [];
    let productsprice = [];
    let productsid = '';

    if (userdata) {
        productsname = userdata.productname || [];
        productsquantity = userdata.productquantity || [];
        productsprice = userdata.productsprice || [];
        productsid = userdata._id;
    }   

    const selectstatus = (e) => {
        const { name, value } = e.target;
        setOrderstatus({
            ...orderstatus, [name]: value
        });
    };

    const statusSubmited = async (e) => {

        
        e.preventDefault();
        try {
            const statusord = await ordersingleStatus({
                status: orderstatus,
                productsname: productsname,
                productsquantity: productsquantity,
                productsid: productsid
            });

            console.log(statusord)
            if (statusord) {
                if (statusord.data === 'update successfully') {
                    toast.success(statusord.data);
                    refetch();
                } else {
                    toast.error(statusord.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return <div>...isLoading</div>;
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='dashboardcontainer'>
            <Sidebarmenu />
            <div className="marquee-container">
                <a style={{ display: 'block', color: 'red', position: 'absolute', left: '20%', marginTop: 55 }} href='/orders' >All orders</a>
                <h1 style={{ textAlign: 'center', margin: 45, fontFamily: 'aviano' }}>Order Details</h1>
                <form style={{ display: 'block', textAlign: 'center', margin: 'auto', width: 190, marginTop: 50 }} onSubmit={statusSubmited}>
                    <select style={{ height: 35, padding: 5 }} name='status' onChange={selectstatus}>
                        <option value="">Select</option>
                        <option value="pending">Pending</option>
                        <option value="return">Return</option>
                        <option value="fulfilled">Fulfilled</option>
                    </select>
                    <input style={{ marginTop: -5 }} className='btn btn-danger orderstatusbtn' type="submit" value="Status" />
                    {validation ? <div style={{ margin: 5 }} className='alert alert-danger'>{validation}</div> : null}
                </form>
                <table className='orderdetailtb'>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userdata ? (
                            <tr>
                                <td>
                                    {productsname.map((product, index) => (
                                        <div key={index}>{index + 1}. {product}</div>
                                    ))}
                                </td>
                                <td>
                                    {productsquantity.map((quantity, index) => (
                                        <div key={index}>{quantity}</div>
                                    ))}
                                </td>
                                <td>
                                    {productsprice.map((productpr, index) => (
                                        <div key={index}>{productpr}</div>
                                    ))}
                                </td>
                                <td>
                                    <div>{userdata.status}</div>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="4">No order details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <hr style={{ marginLeft: 150, marginRight: 150, border: 'none', borderBottom: '1px solid #ccc' }} />
                {userdata && (
                    <div className='ordermislenous'>
                        <div><b>Cart total</b>: {userdata.carttotal}</div>
                        <div><b>Shipment</b>: {userdata.shipmentcharges}</div>
                        <div><b>Total</b> : {curr.currency} {userdata.totalamount}</div>
                    </div>
                )}
                {userdata && (
                    <div style={{ width: '18rem', margin: 'auto', marginTop: 40, background: 'rgb(242, 242, 242)', marginBottom: 30 }} className="card">
                        <div style={{ padding: 5, border: '1px solid black' }} className="card-body">
                            <h3 style={{ textAlign: 'center' }} className="card-title">Biller Info</h3>
                            <div>{userdata.address}</div>
                            <div>{userdata.email}</div>
                            <div>{userdata.mobile}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orderview;
