const jwt = require('jsonwebtoken');

const Authorize = async(req, res, next) => {
   
    const token =  await req.cookies.token;
    
    if (!token) {
       
        return res.status(401).json({ message: 'Unauthorized' });
    }

   jwt.verify(token,process.env.SECRET, (err,decoded) => {
        
    if (err) {
    
        return res.status(401).json({ message: 'Invalid token' });
    
    }
        
        req.user = decoded;
    });

    next();


};

module.exports = Authorize