const validate_search_query=(req,resp,next)=>{
    const {query}=req.query;
    if(!query || query.trim().length<2){return resp.status(401).json({err:'Query search invalid !'})};
    if(query.length > 100 ){return resp.status(401).json({err:'Query pentru search prea lung !'})}
    req.query.q=query.trim();
    next();
}
module.exports={validate_search_query}