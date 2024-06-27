import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserDetailsMutation } from '../app/apiauth';

function ClientProtected(props) {

  const { Component } = props

  const navigate = useNavigate()

  const [userdetails, userstateDetail] = useState('')
  

  const [data] = useUserDetailsMutation()

  

  useEffect(() => {

    const userdetail = async () => {

      const newdata = await data()

      userstateDetail(newdata?newdata.data:'')

      if (newdata.error || newdata.data.userrole !== 'subscriber') {

        localStorage.removeItem('user')
        

        window.location.href='/login'

      }

    }

    userdetail();

  }, [data])


  return (
    <>
      <Component userid={userdetails?userdetails.userId:''} username={userdetails?userdetails.username:''} useremail={userdetails?userdetails.useremail:''}/>
    </>

  )


}

export default ClientProtected


