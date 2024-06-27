import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Sidebarmenu from './Sidebarmenu'
import { useGetSingleorderforclientQuery } from '../app/apiorders'
import { useGetCurrencyQuery } from '../app/apiproducts'

function Clientordersview() {

    const { id } = useParams()

    const { data, error, isLoading } = useGetSingleorderforclientQuery(id)
    const { data: currency } = useGetCurrencyQuery()


    const userdata = data ? data[0] : ''
    const curr = currency ? currency[0] : ''


    if (isLoading) {

        return <div>...isLoading</div>
    }

    if (error) return <div>Error: {error.message}</div>;
    return (
        <div className='dashboardcontainer'>



            <Sidebarmenu />


            <div className="marquee-container">

        
            <a style={{display:'block',color:'red',
                position:'absolute',left:'20%',marginTop:55}} href='/clientorders' >All orders</a>

                    <h1 style={{textAlign:'center',margin:40,fontFamily:'aviano'}}>Order Details</h1>
                <table className='orderdetailtb'>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th >Price</th>
                            <th >Status</th>


                        </tr>
                    </thead>
                    <tbody>

                        <td>
                            {userdata.productname.map((products, index) => (

                                <div key={index}>{index + 1}.{products}</div>

                            ))}
                        </td>





                        <td >
                            {userdata.productquantity.map((quantity, index) => (

                                <div>

                                    {quantity}

                                </div>

                            ))}
                        </td>
                        <td >
                            {userdata.productsprice.map((productpr, index) => (

                                <div>
                                    {productpr}

                                </div>

                            ))}
                        </td>

                        <td>
                            <div>

                                {userdata.status}
                            </div>

                        </td>
                    </tbody>


                </table>

                <hr style={{ marginLeft: 150, marginRight: 150, border: 'none', borderBottom: '1px solid #ccc' }} />

                <div className='ordermislenous'>

                    <div >
                        <b>Cart total</b>: {userdata.carttotal}
                    </div>
                    <div>
                        <b>Shipment</b>:{userdata.shipmentcharges}
                    </div>
                    <div>
                        <b>Total</b> : {curr.currency} {userdata.totalamount}

                    </div>
                </div>

                <div style={{
                    width: '18rem', margin: 'auto', marginTop: 40,
                    background: 'rgb(242, 242, 242)', marginBottom: 30
                }} class="card">
                    <div style={{ padding: 5, border: '1px solid black' }} className="card-body">
                        <h3 style={{ textAlign: 'center' }} className="card-title">Billing Details</h3>

                        <div>

                            {userdata.address}
                        </div>
                        <div>

                            {userdata.email}
                        </div>

                        <div>

                            {userdata.mobile}
                        </div>



                    </div>
                </div>




            </div>
        </div>
    )
}

export default Clientordersview