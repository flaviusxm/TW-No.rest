const database=require('../models')
const USER=database.users;
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const passport=require('passport');
exports.configure_passport=()=>{
    passport.use(new GoogleStrategy(
{
    clientID:process.env.GOOGLE_CL_ID,
    clientSecret:process.env.GOOGLE_CL_SECRET,
    callbackURL:"http://localhost:5000/auth/google/callback"
},this.google_auth_callback
    ));
    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
}
exports.google_auth_callback = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await USER.findOne({ where: { google_id: profile.id } });

    if (!user) {
      user = await USER.create({
        google_id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        pictureUrl: profile.photos[0].value,
        last_login: new Date(),
      });
    } else {
      await user.update({ last_login: new Date() });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};
exports.serializeUser=async(user,done)=>{
    done(null,user.user_id);
}
exports.deserializeUser=async(id,done)=>{
    try{
        const user=await USER.findByPk(id);
        done(null,user);
    }catch(err){done(err,null);}
}
exports.get_auth_status=(req,resp)=>{
    if(req.isAuthenticated()){resp.json({user:req.user})}
    else{resp.status(400).json({err:'Nu este autentificat'})}
}
exports.google_auth_success=(req,resp)=>{
    resp.redirect('http://localhost:3000/landing')
}
exports.logout=(req,resp)=>{
    req.logOut((err)=>{
        if(err){return resp.status(500).json({err:'Eroare logout !'})}
        else{req.session.destroy((err)=>{
            if(err){return resp.status(500).json({err:'Eroare sesiune !'})}
        })}
        resp.clearCookie('connect.sid');
        resp.json({message:'Logout cu succes! '})
    })
}

exports.auth_fail = (req, resp) => {
  resp.status(401).json({ err: 'Autentificare esuata' });
};