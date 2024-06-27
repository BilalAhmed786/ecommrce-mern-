import React, { useEffect, useRef, useState } from 'react'
import Sidebarmenu from './Sidebarmenu'
import { useUpdateSingleProductMutation, useGetSingleProductQuery, useGetProductCategeroyQuery } from '../app/apiproducts';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';

function Editproduct() {

    const { id } = useParams()
    const { data: category } = useGetProductCategeroyQuery();
    const [updateData] = useUpdateSingleProductMutation();
    const { data, isLoading, refetch } = useGetSingleProductQuery(id);




    useEffect(() => {

        setFormData(data ? data : '')

        refetch()

    }, [data])


    const myDivRef = useRef(null);

    // for single image selected and delte option
    const [selectedImage, setSelectedImage] = useState('');

    const fileInputRef = React.createRef();
    const handleFileChange = (event) => {
        const file = event.target.files[0];


        if (file) {

            const reader = new FileReader();

            reader.onloadend = () => {

                setSelectedImage({
                    src: reader.result,
                    name: file,
                });

            };
            reader.readAsDataURL(file);

        }
    };

    const handleDelete = (e) => {
        e.preventDefault()
        setSelectedImage(null);

        const fileval = fileInputRef.current.value;



        setSelectedImage(fileval)
    };

    // multiple images selected with delete options


    const [selectedmultipleImages, setmultipleSelectedImages] = useState([]);


    const handlemultiFileChange = (e) => {

        const selectedImages = Array.from(e.target.files);

        setmultipleSelectedImages([...selectedmultipleImages, ...selectedImages]);

    };

    const handlemultiDelete = (e, index) => {
        e.preventDefault();
        // Remove the selected image and corresponding file
        const updatedImages = [...selectedmultipleImages];
        updatedImages.splice(index, 1);
        setmultipleSelectedImages(updatedImages);
    };

    // form submit



    const [formData, setFormData] = useState({
        productname: '',
        productcat: '',
        productshortdesc: '',
        productdesc: '',
        inventory: '',
        saleprice: '',
        discountedprice: ''

    });


    const handleChange = (e) => {
        const { name, value } = e.target;


        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

    };

    const productsform = async (e) => {
        e.preventDefault()

        if (myDivRef.current) {

            myDivRef.current.focus();

        }


        const form = new FormData();

        selectedmultipleImages.map((images) => (
            form.append("imagesmultiple", images)
        ));


        form.append("imagesingle", selectedImage.name);
        form.append("productname", formData.productname);
        form.append("productcat", formData.productcat);
        form.append("productshortdesc", formData.productshortdesc);
        form.append("productdesc", formData.productdesc);
        form.append("inventory", formData.inventory);
        form.append("saleprice", formData.saleprice);
        form.append("discountedprice", formData.discountedprice);
        form.append("productid", formData._id)



        try {
            const result = await updateData(form);
            console.log(result)
            result.data.map((messages) => {

                if (messages === 'product updated') {

                    toast.success(messages)



                } else {

                    toast.error(messages)
                }

            })

        }
        catch (error) {
            console.error('Error submitting form data', error);
        }




    }

    if (isLoading) {
        return <div>...loading</div>
    }


    return (
        <div className='dashboardcontainer'>



            <Sidebarmenu />


            <div className="marquee-container">

                   
                <form onSubmit={productsform}>
               <div style={{textAlign:'center',width:'40%',
               position:'absolute',marginTop:5}}><Link style={{color:'red'}} to="/allproducts">All products</Link></div><h3 style={{ textAlign: 'center', marginTop: 35 }}>Edit product</h3>

                    <div className="form-group">
                        <input className="prdouctaddinput" type="text"
                            name="productname" value={formData.productname} placeholder="productname" onChange={handleChange} />

                    </div>
                    <div className="form-group">
                        <label className="productaddlab" for="productcat">productcategories</label>
                        <select style={{paddingLeft:5}} id="productcat" name="productcat" onChange={handleChange}>
                            <option >{formData.productcat}</option>

                            {category ? category.map((category, index) => (

                                <option key={index}>{category.productcat}</option>


                            )) : null


                            }


                        </select>

                    </div>
                    <div className="form-group">
                        <label className="productaddlab" for="shortdesc">Short description</label>
                        <textarea name="productshortdesc" cols="50" rows="10"
                         value={formData.productshortdesc} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label className="productaddlab" for="longdesc">Description</label>
                        <textarea name="productdesc" cols="50" rows="10"
                        value={formData.productdesc} onChange={handleChange}></textarea>
                    </div>

                    <div className="proimage">
                        <div>
                        <img id="blah" src="" alt='' />
                        <input
                            type="file"
                            name="singleimage" id="imgInp"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <img style={{width: 200}}
                            src={selectedImage ? selectedImage.src : null} alt='' />
                            </div>
                       <div className='btn-proimg'><button id='previewimage' style={{ display: selectedImage.src ? 'block' : 'none', margin: 'auto' }}
                            onClick={(e) => handleDelete(e)}>X</button></div>

                    </div>

                    <input
                       onClick={() => document.getElementById('imgInp').click()}
                        style={{ display: 'block', margin: 'auto' }}
                        type="button" id="loadFileXml"
                        className="addbutton" value="Product Image" />

                    
                        <input style={{ display: 'none' }}
                            id="image"
                            type="file"
                            name="multipleimages"
                            onChange={handlemultiFileChange}
                            multiple
                        />
                    

                    

                    <input style={{ display: 'block', margin: 'auto', marginTop: 35 }}
                        type="button" id="loadFileimage"
                        className="addbutton" value="Gallery Images"
                        onClick={() => document.getElementById('image').click()} />

            <div id="gallerypreview">
                    {selectedmultipleImages.map((image, index) => (
                        <div key={index}>
                            <img className='galleryimgs' src={URL.createObjectURL(image)} style={{ display: 'block', width: '100px' }} />
                           <div className='galleryimgbtn'> <button className='btn-imagegallery'
                                onClick={(e) => handlemultiDelete(e, index)}>x</button></div>
                        </div>
                    ))}
                </div>

                    <div className="form-group">
                        <input className="prdouctaddinput" type="text" name="inventory"
                            value={formData.inventory} placeholder="inventory" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input className="prdouctaddinput" type="text" name="saleprice"
                            value={formData.saleprice} placeholder="saleprice" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input className="prdouctaddinput" type="text" name="discountedprice"
                            value={formData.discountedprice} onChange={handleChange} placeholder="discountedprice" />
                    </div>
                    <div className="form-group">
                        <button className="addbutton" type="submit" name="submit">Update</button>
                    </div>


                </form>
            </div>
        </div>
    )
}

export default Editproduct