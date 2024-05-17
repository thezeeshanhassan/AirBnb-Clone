const Listing = require(`../models/listing`); // Listing Schema

//Show All Listing
module.exports.showAllListing = async (req, res, next) => {
    let allListing = await Listing.find({});
    res.render(`listings/index.ejs`, { allListing });
}

//// Route to Create New Post
module.exports.renderFormforNewPost = (req, res) => {
    // console.log(isLoggedIn);
    res.render(`listings/new.ejs`);
}

//// Route to See Detail of Each Post (Show Route)
module.exports.detailOfEachPost = async (req, res) => {
    let id = req.params.id;
    // To Get Detail of Each User
    let detailByID = await Listing.findById(id).populate({path : `review`, populate : {path : `createdBy`}}).populate(`owner`);
    if (!detailByID) {
        req.flash(`error`, "Post You Requested For Does Not Exist");
        res.redirect(`/listings`);
    }
    res.render(`listings/show.ejs`, { detailByID });
}

//// Insert New Post To Database From User
module.exports.insertingNewPostinDB = async (req, res, next) => {
    let url = req.file.path;
    let {filename} = req.file;
    console.log(url + '...........' + filename);
    // Validating Req.Body that Each Parameter Exists and Validated through Joi 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash(`success`, "New Post Added Successfully!");
    res.redirect(`/listings`);
}

//// Edit Post
module.exports.editPost = async (req, res) => {
    let { id } = req.params;
    let detailByID = await Listing.findById(id);
    if (!detailByID) {
        req.flash(`error`, "Post You Requested For Does Not Exist");
        res.redirect(`/listings`);
    }
    res.render(`listings/edit.ejs`, { detailByID });
}

//// Update Route
module.exports.updatePost = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(req.file)
    {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        listing.save();
    }
    req.flash(`success`, "Post Updated Successfully!");
    res.redirect(`/listings`);
}

//// Delete Route
module.exports.deletePost = async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash(`success`, "Post Deleted Successfully!");
    res.redirect(`/listings`);
}
