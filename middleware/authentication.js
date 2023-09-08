const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key_here';


// Generate a JWT token for a user
function generateToken(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET_KEY, {
      expiresIn: '1h', // Token expiration time
    });
}
  
// Verify and decode a JWT token
function verifyToken(token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (error) {
      return null; // Token is invalid
    }
}

function authenticateAdmin(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if(!decoded.isAdmin){
      return res.status(401).json({ error: 'Only Admin Allowed!' });
    }
    req.user = decoded; // Store user data in the request object
    next();
}

function authenticateUser(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if(decoded.isAdmin){
      return res.status(401).json({ error: 'Only Employees Allowed!' });
    }
    req.user = decoded; // Store user data in the request object
    next();
}

module.exports = {
    generateToken,
    authenticateAdmin,
    authenticateUser
}