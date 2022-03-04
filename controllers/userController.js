
const { User } = require("./../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { capitalizeFirstLetter } = require("./../helpers/helpers");

const getSignIn = (req, res) => {
    res.render("signin", {
        title: "SLRCRUD - Sign in",
    });
};

const postSignIn = async (req, res) => {
    try{
        req.body = JSON.parse(JSON.stringify(req.body));
        let email = req.body.hasOwnProperty("email") ? req.body.email : "";
        let password = req.body.hasOwnProperty("password") ? req.body.password : "";
        let user = await User.findOne({ where: { email: email } });

        console.log("BODY: ", req.body);
        console.log("EMAIL: ", req.body.email);
        console.log("PASSWORD: ", req.body.password);
        console.log("USER: ", user);

        if(email.length <= 0 || validator.isEmpty(email) || !validator.isEmail(email)){
            throw new Error("Email must valid and not empty!");
        }

        if(validator.isEmpty(password)){
            throw new Error("Password cannot be empty");
        }

        if(!user){
            throw new Error("Sorry, something went wrong, please check your email and password and try again!");
        }

        let passwordCheck = await bcrypt.compare(password, user.password);

        console.log("PASSWORD CHECK: ", passwordCheck);

        if(!passwordCheck){
            throw new Error("Sorry, something went wrong, please check your email and password and try again!");
        }else{
            req.session.userEmail = user.email;
            req.session.userId = user.id;
            res.redirect("/dashboard");
        }

    }catch(err){
        console.log("Sign in post error: ", err);

        res.status(406);
        return res.render("signin", {
            title: "SLRCRUD - Sign in",
            error: err.message,
            oldInput: req.body,
        });
    }
}

const getSignUp = (req, res) => {
    res.render("signup", {
        title: "SLRCRUD - Sign up",
    });
};

const postSignUp = async (req, res) => {
    try{ 
        req.body = JSON.parse(JSON.stringify(req.body));
        let first_name = req.body.hasOwnProperty("first_name") ? req.body.first_name : "";
        let last_name = req.body.hasOwnProperty("last_name") ? req.body.last_name : "";
        let email = req.body.hasOwnProperty("email") ? req.body.email : "";
        let password = req.body.hasOwnProperty("password") ? req.body.password : "";
        let confirm_password = req.body.hasOwnProperty("confirm_password") ? req.body.confirm_password : "";

        if(first_name.length < 3 || validator.isEmpty(first_name) || last_name.length < 3 || validator.isEmpty(last_name)){
            throw new Error("First name and last name must be at least 3 characters long and not empty!");
        }

        if(email.length <= 0 || validator.isEmpty(email) || !validator.isEmail(email)){
            throw new Error("Email must valid and not empty!");
        }

        if(password.length < 6 || validator.isEmpty(password) || confirm_password.length < 6 || validator.isEmpty(confirm_password) || password !== confirm_password){
            throw new Error("Password must be at least 6 characters long and match!");
        }

        let user = await User.findOne({ where: { email: email } });
        console.log("User found: ", user);

        if(!user){
            bcrypt.hash(password, 14)
            .then(hash => {
                User.create({
                    first_name: capitalizeFirstLetter(first_name.trim()),
                    last_name: capitalizeFirstLetter(last_name.trim()),
                    email: email.trim(),
                    password: hash,
                })
                .then(user => {
                    console.log("User created: ", user);
                    
                    res.status(200);
                    return res.render("signin", {
                        title: "SLRCRUD - Sign in",
                        success: true,
                        message: "Account created successfully!",
                    });
                })
                .catch(err => {
                    console.log("Error creating user: ", err);
                    throw new Error("Error while trying to insert user into the database, please try again later!");
                });
            })
            .catch(err => {
                console.log("Error hashing password: ", err);
                throw new Error("Error while trying to insert user into the database, please try again later!");
            });
        }else{
            throw new Error("User already exists!");
        }
    }catch(err){
        console.log("Sign up post error: ", err);

        res.status(406);
        return res.render("signup", {
            title: "SLRCRUD - Sign up",
            error: err.message,
            oldInput: req.body,
        });
    }
};

const getDashboard = (req, res) => {
    res.render("client/dashboard", {
        title: "SLRCRUD - Dashboard",
    });
};

const getLogout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

module.exports = {
    getSignIn,
    postSignIn,
    getSignUp,
    postSignUp,
    getDashboard,
    getLogout
}