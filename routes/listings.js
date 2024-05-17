const express = require(`express`);
const router = express.Router();
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
const {isLoggedIn} = require(`../middlewares.js`) // Middleware LoggedIn Checks that User is LoggedIn to perform CRUD operations
//// MiddleWares For Schema Validation (Server Side Validation)
const {isRightUserForListing} = require(`../middlewares.js`) // To check Whether It is the Right Owner for Lisitng to Perform Update or Delete Operations
const {validateListingSchema} = require(`../middlewares.js`); // To Validate Listings
const lisitngController = require(`../controller/listing.js`); // Listing Controller that contain all Lisitng Functions
const multer  = require('multer'); // Multer is Used to handle Files Not Urls
const {storage} = require(`../cloudConfig.js`) // Cloud Storage to Store Medias
const upload = multer({ storage }); // Destination To Save Files

/* router.route is used when multiple route has same path. It helps not to write same path repeatedly */


router.route(`/`)
//// Route for Show All Listings
.get(wrapAsync(lisitngController.showAllListing))
//// Insert New Post To Database From User
// validateListingSchema MiddleWare Called while Server Side Validation
.post(isLoggedIn ,upload.single('listing[image]'),validateListingSchema, wrapAsync(lisitngController.insertingNewPostinDB));


//// Route to Create New Post
router.get(`/new`,isLoggedIn, lisitngController.renderFormforNewPost);

router.route(`/:id`)
//// Route to See Detail of Each Post (Show Route)
.get(wrapAsync(lisitngController.detailOfEachPost))
// Update Route
// validateListingSchema MiddleWare Called while Server Side Validation
.patch(isLoggedIn,upload.single('listing[image]'), validateListingSchema, wrapAsync(lisitngController.updatePost))
//// Delete Route
.delete(isLoggedIn,isRightUserForListing, wrapAsync(lisitngController.deletePost));

// Edit Route
router.get("/:id/edit",isLoggedIn,isRightUserForListing, wrapAsync(lisitngController.editPost));

module.exports = router;