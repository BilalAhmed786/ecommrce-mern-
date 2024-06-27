import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useLoginUserMutation, useUserDetailsMutation } from '../app/apiauth';
import ReCAPTCHA from 'react-google-recaptcha';



function Login() {


  const navigate = useNavigate()

  const [data, stateuserdata] = useState([])

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [loginuser, stateloginUser] = useLoginUserMutation()//validations 

  const [userData] = useUserDetailsMutation()

  const [login, logninState] = useState({
    email: '',
    password: ''

  })

  const LoginUser = (e) => {

    const { name, value } = e.target


    logninState({
      ...login,
      [name]: value

    })

  }

 

  const handleCaptchaChange = (value) => {
    // CAPTCHA verification completed callback
    setIsCaptchaVerified(true);
  };


  const LoginCread = async (e) => {

    e.preventDefault();



    try {

      if (isCaptchaVerified) {

      const validation = await loginuser(login)

        validation.data.map((errormessage)=>{ //validations
          
          if(errormessage === 'login successfully'){

            toast.success(errormessage)

          }else{

             toast.error(errormessage)
          
          }
        
        })
    }else {

      toast.error('Please complete the CAPTCHA verification')
     
    }

  


      const user = await userData()


      stateuserdata(user.data)


    } catch (error) {

      console.log(error)

    }

  }

  useEffect(() => {

    //login user cant visit login page

    const logicredit = async () => {

      const data = await userData()

      stateuserdata(data.data)


    }

    logicredit()


    if (data) {   //redirect on user role base


      if (data.userrole === 'admin') {

        localStorage.setItem("user",data.userrole)
       
        window.location.href ='http://localhost:3000/dashboard'


      } else if (data.userrole === 'subscriber') {

        
        localStorage.setItem("user",data.userrole)

        
        window.location.href ='http://localhost:3000/client'

      }

    }


  }, [data])

  return (
    <>

      <section className="vh-100 bg-image">
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card">
                  <div className="card-body p-6">
                    <h2 className="text-uppercase text-center mb-5">Login</h2>

                    <div style={{ color: "red" }}>


                    </div>


                    <form method="POST" onSubmit={LoginCread}>
                      <div className="form-outline mb-4">
                        <input type="email" name='email' className="form-control form-control-lg" onChange={LoginUser} />
                        <label className="form-label" htmlFor="youremail">Your Email</label>
                      </div>

                      <div className="form-outline mb-4">
                        <input type="password" name='password' className="form-control form-control-lg" autocomplete="new-password" onChange={LoginUser} />
                        <label className="form-label" htmlFor="password">Password</label>
                      </div>

                      <ReCAPTCHA 
                      sitekey="6LdTT5wpAAAAAIm1OBDj87YplC5-S8OJp4Fa9mH8"
                      onChange={handleCaptchaChange}
                          className='recaptchacontain'
                      />

                      <div className="d-flex justify-content-center">
                        <button type="submit"
                          className="btn btn-danger">Login</button>

                      </div>

                      <p className="text-center text-muted mt-5 mb-0">Forget you password? <Link to="/Forget-password"
                        className="fw-bold text-body">Forget password</Link></p>

                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )

}

export default Login