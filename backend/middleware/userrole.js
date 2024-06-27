function checkUserRole(role) {
console.log(role)
    return (req, res, next) => {


        const userRole = req.user?.userrole;

       
         if (userRole !== role) {


           return res.redirect('http://localhost:3000/login')

        }

        next()


    };
}

module.exports = checkUserRole