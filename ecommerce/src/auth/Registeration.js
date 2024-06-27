import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRegisterUserMutation, useUserDetailsMutation } from '../app/apiauth'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Registeration() {

  const navigate = useNavigate()
  const [validreal, realValid] = useState([])
  const [data, stateuserdata] = useState([])
  const [registerData, registeruser] = useRegisterUserMutation()
  const [userData] = useUserDetailsMutation()


  useEffect(() => {

    //login user cant visit registration page

    const logicredit = async () => {

      const data = await userData()

      stateuserdata(data.data)


    }

    logicredit()


    if (data) {   //redirect on user role base


      if (data.userrole === 'admin') {


        navigate('/dashboard')


      } else if (data.userrole === 'subscriber') {


        navigate('/client')

      }

    }

  }, [data])


  const [values, formval] = useState({
    name: '',
    email: '',
    password: '',
    retypepassword: ''
  })

  function Stateregval(e) {

    const { name, value } = e.target

    formval({

      ...values, [name]: value
    })


  }


  const registrationform = async (e) => {

    e.preventDefault()

    const createuser = await registerData(values)

    if (createuser) {

      //realValid(createuser.data)
      createuser?.data.map((errormessages) => {


        if(errormessages === 'registerd successfully'){

          toast.success(errormessages)

        }else{

          toast.error(errormessages)

        }



      })

    }


  };


  return (
    <section className="vh-80 bg-image">
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card">
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">Create an account</h2>
                  <div style={{ color: "red" }}>
                  </div>
                  <form method="POST" onSubmit={registrationform} >
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example1cg">Your Name</label>
                      <input type="text" name='name' className="form-control form-control-lg" onChange={Stateregval} />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example3cg">Your Email</label>
                      <input type="email" name='email' className="form-control form-control-lg" autocomplete="username" onChange={Stateregval} />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example4cg">Password</label>
                      <input type="password" name='password' className="form-control form-control-lg" autocomplete="new-password" onChange={Stateregval} />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example4cdg">Repeat your password</label>
                      <input type="password" name='retypepassword' className="form-control form-control-lg" autocomplete="new-password" onChange={Stateregval} />
                    </div>
                    <div className="d-flex justify-content-center">

                      <button type="submit"
                        className="btn btn-danger">Register</button>
                    </div>
                    <p className="text-center text-muted mt-5 mb-0">Have already an account? <a href="#!"
                      className="fw-bold text-body"><u>Login here</u></a></p>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Registeration
