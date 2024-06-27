import React, { useEffect, useState } from 'react';
import Sidebarmenu from './Sidebarmenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import {
    useSubmitProductCategeroyMutation,
    useGetProductCategeroyQuery, useUpdateProductCategeroyMutation,
    useGetsingleProductCategeroyQuery, useDeleteProductCategeroyMutation
} from '../app/apiproducts';

function Addcategory() {

    const [modelformdisplay, statemodeform] = useState(false);
    const [id, setId] = useState('');
    const [searchitem, searchcat] = useState('');
    const [productcat] = useSubmitProductCategeroyMutation();
    const { data, isLoading, refetch } = useGetProductCategeroyQuery(searchitem);
    const { data: singlecategory, refetch: singleCat } = useGetsingleProductCategeroyQuery(id);
    const [updateproCat] = useUpdateProductCategeroyMutation();
    const [deleteproCat] = useDeleteProductCategeroyMutation();

    const [productcatval, stateproductcatval] = useState({
        productcat: ''
    });

    const [singleupdatedata, singlecatupdate] = useState({
        productcat: ''
    });

    useEffect(() => {
        if (singlecategory) {
            singlecatupdate(singlecategory[0] || { productcat: '' });
        }
    }, [singlecategory]);

    const changehandler = (e) => {
        const { name, value } = e.target;
        stateproductcatval({
            ...productcatval,
            [name]: value
        });
    };

    const singlecathandle = (e) => {
        const { name, value } = e.target;
        singlecatupdate({
            ...singleupdatedata,
            [name]: value
        });
    };

    const productcathandle = async (e) => {
        e.preventDefault();
        try {
            const result = await productcat(productcatval);
            if (result) {
                if (result.data === 'category saved') {
                    toast.success(result.data);
                    refetch();
                } else {
                    toast.error(result.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const editHandle = (id) => {
        setId(id);
        statemodeform(true);
        singleCat();
    };

    const updatecatHandle = async (e) => {
        e.preventDefault();
        try {
            const result = await updateproCat({ ...singleupdatedata, id });
            if (result) {
                if (result.data === 'update successfully') {
                    toast.success(result.data);
                    refetch();
                } else {
                    toast.error(result.data);
                }
            } else {
                console.log("something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteHandle = async (id) => {
        try {
            const result = await deleteproCat(id);
            if (result) {
                toast.success(result.data);
                refetch();
            } else {
                console.log('something went wrong');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className='dashboardcontainer'>
                <Sidebarmenu />
                <div className="marquee-container">
                    <h3 style={{ textAlign: "center", margin: 15, fontFamily: 'aviano' }}>Add Category</h3>
                    <form onSubmit={productcathandle}>
                        <div className='form-group'>
                            <label htmlFor='productcat'><b style={{ fontFamily: 'aviano' }}>Product Category</b></label><br />
                            <input name="productcat" style={{ textAlign: 'center', margin: 15 }} type='text'
                                placeholder='productcategory' onChange={changehandler} />
                        </div>
                        <input className='btn btn-danger' style={{
                            display: "block",
                            marginLeft: 'auto', marginRight: 'auto',
                            textAlign: 'center'
                        }}
                            type="submit" value="Add Category" />
                    </form>
                </div>
            </div>
            <div className='categorytb'>
                <input style={{ display: 'block', margin: 'auto', marginBottom: 20 }}
                    type='text' placeholder='search category' onChange={(e) => searchcat(e.target.value)} />
                {data && data.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Categories</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        {data.map((categories) => (
                            <tbody key={categories._id}>
                                <tr>
                                    <td>{categories.productcat}</td>
                                    <td><FontAwesomeIcon onClick={() => editHandle(categories._id)} icon={faEdit} /></td>
                                    <td><FontAwesomeIcon onClick={() => deleteHandle(categories._id)} icon={faRecycle} /></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                    : <h6 style={{ textAlign: 'center', fontFamily: 'aviano' }}>no record found</h6>}
                <div style={{ display: modelformdisplay ? 'block' : 'none' }} className='modelformcat'>
                    <button onClick={() => statemodeform(false)} className="catgorybtn">x</button>
                    <form onSubmit={updatecatHandle}>
                        <div className='form-group'>
                            <label>Category</label><br /><br />
                            <input className='prodcutcatinput' type="text" name='productcat'
                                value={singleupdatedata.productcat || ''} onChange={singlecathandle} />
                        </div>
                        <input style={{ display: 'block', margin: 'auto' }} className='btn btn-danger'
                            type="submit" value="Update" />
                    </form>
                </div>
            </div>
        </>
    );
}

export default Addcategory;
