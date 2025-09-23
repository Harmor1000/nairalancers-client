import React, { useEffect, useRef, useState } from 'react';
import "./Gigs.scss";
// import { gigs } from '../../data';
import GigCard from '../../components/gigCard/GigCard';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest.js';
import { useLocation } from 'react-router-dom';
import { PulseLoader } from "react-spinners";

const Gigs = () => {

  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const {search} = useLocation();

  // console.log(location)

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['gigs'],
    queryFn: () =>
      newRequest.get(`/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
      )
      .then ((res) =>{
        return res.data;
      }),
  });

  console.log(data);
  
  const reSort = (type) =>{
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch()
  };

  return (
    <div className='gigs'><div className="container">
    <span className="breadcrumbs">NAIRALANCERS {">"} GRAPHICS & DESIGN {">"} </span>
    <h1>AI Artists</h1>
    <p>
      Explore the boundries of art and technology with Nairalancers' AI artists
    </p>
    <div className="menu">
      <div className="left">
        <span>Budget</span>
        <input ref={minRef}type="number" placeholder='min' />
        <input ref={maxRef} type="number" placeholder='max' />
        <button onClick={apply}>Apply</button>
      </div>
      <div className="right">
        <span className="sortBy">Sort By</span>
        <span className="sortType">{sort === "sales" ? "Best Selling" : "Newest"}</span>
        <img src="./img/down.png" alt=""  onClick={()=>setOpen(!open)}/>
        {open && (<div className="rightMenu">
          {sort === "sales" ? 
          (<span onClick={()=>reSort("createdAt")}>Newest</span>)
          :
          (<span onClick={()=>reSort("sales")}>Best Selling</span>)
          }
        </div>)}
      </div>
    </div>
    <div className="cards">
      {isLoading
       ?  <PulseLoader
        color= 'green'
        loading='true'
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      /> 
       : error 
       ? "Something went wrong!" 
       : data.map((gig)=> <GigCard key={gig._id} item={gig}></GigCard>
      )}
    </div>
  </div>
  </div>
  )
}

export default Gigs