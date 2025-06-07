import jwt from 'jsonwebtoken';


export const generateTokenAndSetCookie  = (userId,res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d', // Token validity period
  });

    res.cookie('jwt', token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: "None", // Helps prevent CSRF attacks // Use secure cookies in production
    });

}