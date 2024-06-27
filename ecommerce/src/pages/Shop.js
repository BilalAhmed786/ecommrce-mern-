import React, { useEffect, useState } from 'react';
import { useGetProductDataQuery, useGetProductCategeroyQuery, useGetCurrencyQuery } from '../app/apiproducts';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, addProducts } from '../reducers/cartslice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faBox, faDollarSign, faTag, faShoppingCart, faEye } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saleprice, setPrice] = useState('');
  const [search, stateSearchcat] = useState('');
  const [productcat, setCategory] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState(true);
  const [catFilter, setCatFilter] = useState(true);
  const [searchpro, setSearchpro] = useState(true);
  const [setMore, setHasMore] = useState(true);
  const [arrproducts, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [page, setPage] = useState(1);

  const { data: procat, refetch: categoryFetch } = useGetProductCategeroyQuery(search);
  const { data: currency = [{ currency: '' }], refetch: fetchCurrency } = useGetCurrencyQuery();
  const { data: fetchedProducts = [], isLoading: isFetching, refetch } = useGetProductDataQuery({
    page,
    pageSize: 18,
    saleprice,
    productcat,
    productFilter
  });

  const products = [...new Set(arrproducts)]; // Products filtered from array

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleFiltersChange = () => {
    setPage(1);
  };

  useEffect(() => {
    if (page === 1) {
      setProducts(fetchedProducts);
      refetch();
      fetchCurrency();
    } else {
      setProducts(prevProducts => [...prevProducts, ...fetchedProducts]);
    }
  }, [fetchedProducts, page, procat]);

  useEffect(() => {
    if (page > 1 && isFetching) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isFetching, page]);

  useEffect(() => {
    setHasMore(fetchedProducts.length > 0);
  }, [fetchedProducts]);

  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setSearchpro(true);
    setPriceFilter(true);
    setCatFilter(true);
  };

  const searchItem = () => {
    setSearchpro(searchpro => !searchpro);
  };

  const priceFilterHandle = () => {
    setPriceFilter(priceFilter => !priceFilter);
  };

  const catFilterHandle = () => {
    setCatFilter(catFilter => !catFilter);
  };

  const handleProductImageHover = (productId) => {
    setHoveredProductId(productId);
  };

  const handleResetHoveredProduct = () => {
    setHoveredProductId(null);
  };

  dispatch(addProducts(products)); // Add products to cartslice

  const handleAddToCart = (productId) => {
    toast.success("Product added");
    dispatch(addToCart(productId));
  };

  const viewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className='shopcontainer'>
      <div><button className='closefilterbtn' onClick={openSidebar}>Filters</button></div>
      <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
        <div><button className='btncloseside' onClick={closeSidebar}>x</button></div>
        <ul className='shopfilters'>
          <div className='searchcontain'>
            <FontAwesomeIcon icon={faBox} />
            <label style={{ cursor: 'pointer', marginBottom: 10 }} onClick={searchItem}>Product Filter</label>
            <span><FontAwesomeIcon icon={faAngleDown} /></span>
            <div className={searchpro ? 'searchpro' : ''}>
              <input type="text" name="productname" placeholder='Product Name' onChange={(e) => setProductFilter(e.target.value)} />
            </div>
          </div>
          <div className='searchcontain'>
            <FontAwesomeIcon icon={faDollarSign} />
            <label style={{ cursor: 'pointer', marginBottom: 10 }} onClick={priceFilterHandle}>Price Filter</label>
            <span><FontAwesomeIcon icon={faAngleDown} /></span>
            <select style={{ display: priceFilter ? 'none' : 'block' }} value={saleprice} onChange={(e) => setPrice(e.target.value)}>
              <option value="">All</option>
              <option value="0-50">0-50</option>
              <option value="50-100">50-100</option>
              <option value="100-200">100-200</option>
            </select>
          </div>
          <div className='searchcontain'>
            <span><FontAwesomeIcon icon={faTag} /></span>
            <label style={{ cursor: 'pointer', marginBottom: 10 }} onClick={catFilterHandle}>Category Filter</label>
            <span><FontAwesomeIcon icon={faAngleDown} /></span>
            <select style={{ display: catFilter ? 'none' : 'block' }} value={productcat} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {procat ? procat.map((products, index) => (
                <option key={index}>{products.productcat}</option>
              )) : null}
            </select>
          </div>
          <button className='applyfilters' onClick={handleFiltersChange}>Apply Filters</button>
        </ul>
      </div>
      <InfiniteScroll
        dataLength={products.length}
        next={handleLoadMore}
        hasMore={setMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}>No more products</p>}
        scrollThreshold={0.9}
      >
        <h2 style={{ textAlign: 'center', padding: 20, fontFamily: 'aviano' }}>Shop</h2>
        <div className='product-container'>
          {products.map((product) => (
            <div key={product.id} className='product-display' onMouseEnter={() => handleProductImageHover(product._id)}
              onMouseLeave={handleResetHoveredProduct}>
              <Link to={`/product/${product._id}`}>
                {product.discountedprice ?
                  <div className="badge">
                    <span className="badge-text">{(((product.saleprice - product.discountedprice) / product.saleprice) * 100).toFixed(0)}% off</span>
                  </div>
                  : null}
                <img src={hoveredProductId === product._id ? `/uploads/${product.galleryimages[0]}` : `/uploads/${product.productimage}`}
                  alt={`Product ${product._id}`} className="product-image" />
              </Link>
              <div className="cart-button-container">
                <button onClick={() => viewDetail(product._id)} style={{ display: hoveredProductId === product._id ? 'block' : 'none' }} className='btncart'><FontAwesomeIcon icon={faEye} /></button>
                <button onClick={() => handleAddToCart(product._id)} style={{ display: hoveredProductId === product._id ? 'block' : 'none' }} className='btncart'><FontAwesomeIcon icon={faShoppingCart} /></button>
              </div>
              <p>{product.productname}</p>
              {product.discountedprice ?
                <div className='discountprice'>
                  <s style={{ color: 'red' }}><p style={{ color: 'red' }}>{currency[0]?.currency} {product.saleprice}</p></s>
                  <p>{currency[0]?.currency}{product.discountedprice}</p>
                </div>
                : <p>{currency[0]?.currency} {product.saleprice}</p>}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ShopPage;
