const require_auth=(req,resp)=>{
    if(!req.is_authenticated()){return resp.status(401).json({err:'Nu este autentificat !'})} next();
}
module.exports={require_auth};