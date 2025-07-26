import jwt from 'jsonwebtoken';

const createJwt = (user:any)=>{
    const token = process.env.ACSSES_TOKEN_SCRET;
    if(!token) return;
    const access_token = jwt.sign(user,token);
    return access_token;
}
export default createJwt;