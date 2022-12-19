const User = require('./user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

module.exports=function(passport){




    passport.use(
        new localStrategy((username, password, done)=>{
            User.findOne({username:username}, (err,user)=>{
                if(err) throw err;
                if(!user) return done(null,false);
                bcrypt.compare(password, user.password, (err, result)=>{
                    if(err) throw err;
                    if(result===true){
                        return done(null,user);
                    }else{
                        return done(null,false);
                    }
                });
            });
        })
    );

    passport.serializeUser((user, callback) =>{
        callback(null, user.id)
    })
    passport.deserializeUser((id, callback) =>{
        User.findOne({_id: id}, (err, user)=>{
            const userInfo = {
                username:user.username
            };
            callback(err,userInfo);
        })
    })

}