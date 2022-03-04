function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isUserLoggedIn(req, res, next) {
    if(!req.session.userEmail && !req.session.userId){
        res.redirect("/");
    }
    return next();
}

module.exports = {
    capitalizeFirstLetter,
    isUserLoggedIn,
};