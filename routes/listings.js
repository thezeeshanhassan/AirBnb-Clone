const express = require(`express`);
const router = express.Router();
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
const {isLoggedIn} = require(`../middlewares.js`) // Middleware LoggedIn Checks that User is LoggedIn to perform CRUD operations
//// MiddleWares For Schema Validation (Server Side Validation)
const {isRightUserForListing} = require(`../middlewares.js`) // To check Whether It is the Right Owner for Lisitng to Perform Update or Delete Operations
const {validateListingSchema} = require(`../middlewares.js`); // To Validate Listings
const lisitngController = require(`../controller/listing.js`); // Listing Controller that contain all Lisitng Functions

//// Route for Show All Listings
router.get(`/`, wrapAsync(lisitngController.showAllListing));

//// Route to Create New Post
router.get(`/new`,isLoggedIn, lisitngController.renderFormforNewPost);

//// Route to See Detail of Each Post (Show Route)
router.get(`/:id`, wrapAsync(lisitngController.detailOfEachPost));

//// Insert New Post To Database From User
// validateListingSchema MiddleWare Called while Server Side Validation
router.post(`/`,isLoggedIn ,validateListingSchema, wrapAsync(lisitngController.insertingNewPostinDB));

// Edit Route
router.get("/:id/edit",isLoggedIn,isRightUserForListing, wrapAsync(lisitngController.editPost));

// Update Route
// validateListingSchema MiddleWare Called while Server Side Validation
router.patch("/:id",isLoggedIn,validateListingSchema, wrapAsync(lisitngController.updatePost));

//// Delete Route
router.delete(`/:id`,isLoggedIn,isRightUserForListing, wrapAsync(lisitngController.deletePost));

module.exports = router;