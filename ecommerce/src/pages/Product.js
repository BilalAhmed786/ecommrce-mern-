import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToCart } from '../reducers/cartslice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Starrate from './Starrate';
import Clientprorating from './Clientprorating';
import { useGetSingleProductQuery, useProductsReviewsMutation, useGetProductsreviewsQuery } from '../app/apiproducts';


function Product() {

    const { id } = useParams()
    const formRef = useRef()
    const dispatch = useDispatch();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);//image slider
    const { data, error, isLoading } = useGetSingleProductQuery(id);
    const { data: proreviews } = useGetProductsreviewsQuery(id)
    const [productreviews] = useProductsReviewsMutation()


    //add to cart   

    const handleAddToCart = (productId) => {

        toast.success("product added");

        dispatch(addToCart(productId));
    };

    //image sldier controllers
    const nextImage = () => {
        const newIndex = (currentImageIndex + 1) % data.galleryimages.length;





        setCurrentImageIndex(newIndex);
    };

    const prevImage = () => {
        const newIndex = (currentImageIndex - 1 + data.galleryimages.length) % data.galleryimages.length;
        setCurrentImageIndex(newIndex);
    };

    //its must for page re-render not work if its not 


    //star rating work

    const [rating, setRating] = useState(0);
    const [validation, setformvalid] = useState('')
    const [formdata, setFormdata] = useState({
        name: '',
        email: '',
        comment: ''

    })

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleInputChange = (e) => {

        const { name, value } = e.target

        setFormdata({
            ...formdata,
            [name]: value

        })


    };

    const handleSubmit = async (e) => {



        e.preventDefault();

        try {
            const result = await productreviews({ id, rating, formdata })


            if (result) {

                // setformvalid(result.data)
                if (result.data === 'comment ready for publish') {

                    toast.success(result.data)
                } else {

                    toast.error(result.data)
                }


                setRating(0);
                setFormdata('');
                formRef.current.reset();

            } else {

                console.log('something went wrong')
            }



        } catch (error) {

            console.log(error)
        }



    };



    //its must for page re-render not work if its not 
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }



    return (
        <div className='productcontainer'>
            <h3 style={{textAlign:'center',marginBottom:35}}>{data?data.productname:""}</h3>

                <div className='imggallery'>

                    <div className='productimg'>


                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={prevImage}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <img className='singlepro-img' src={`/uploads/${data.galleryimages[currentImageIndex]}`} alt='' />
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={nextImage}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>


                    </div>




                    {data ? data.galleryimages.map((gallery, index) => (

                        <div className='gallery'>
                            <img className='singlepro-gallery' src={`/uploads/${gallery}`} alt='' />
                        </div>



                    )) : null

                    }
                </div>

                <div className='productdetails'>
                    <h2 style={{ fontFamily: 'Aviano Flare' }}>{data.productname}</h2>
                    <p style={{ fontFamily: 'Aviano Flare' }}>${data.saleprice}</p>
                    <p style={{ fontFamily: 'Aviano Flare' }}>{data.productshortdesc}</p>
                    <div className='buttonwraper'>
                        <button className='addtocart'
                            onClick={() => handleAddToCart(data._id)}>
                            Add to Cart</button>
                    </div>


                </div>

           




            {proreviews && proreviews.length > 0 ?

                <div className='clientreviews'>

                    <h5>Client Reveiws</h5>

                    Average rating:({(proreviews.reduce((total, review) => total + parseInt(review.rating), 0) / proreviews.length).toFixed(1)}/5)<br />
                    <b>{proreviews.length} comments</b>


                    {proreviews.map((review, index) => (

                        <div class="card">
                            <div class="card-body">
                                <div key={index}>

                                    <p className='reviewername'>{review.name}</p>
                                    <Clientprorating rating={review.rating} />
                                    <p>{review.comment}</p> {/* Assuming each review has a 'comment' field */}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
                : null}


            <div style={{marginTop:25}} className='reviewform'>
                <form className='formreview' ref={formRef} onSubmit={handleSubmit}>
                    <h4>Leave a Review</h4>
                    <div style={{ display: 'flex', padding: 5 }}>
                        <label style={{ marginRight: 5 }}><b>Rating:</b></label>
                        <Starrate rating={rating} onRatingChange={handleRatingChange} />
                    </div>
                    <div className='form-group'>
                        <label>name:</label><br />
                        <input className='reviewinput' type="text" name="name" onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label>Email:</label><br />
                        <input className='reviewinput' type="text" name="email" onChange={handleInputChange} />
                    </div>
                    <div className='form-group'>
                        <label>Comment:</label><br />
                        <textarea className='reviewtextarea' name="comment" rows='10' cols='120' onChange={handleInputChange} />
                    </div>
                    <button className='btn btn-danger' style={{ display: 'block', margin: 'auto' }} type="submit">Submit</button>
                </form>
            </div>





        </div>



    )
}

export default Product