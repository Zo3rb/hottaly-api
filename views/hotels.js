const express = require('express');
const HotelsController = require('../controllers/HotelsController');
const { RequireSignIn } = require("../middleware");

const router = express.Router();

router.post('/create-hotel', RequireSignIn, HotelsController.createHotel);
router.get('/hotels', HotelsController.indexHotels);
router.get('/hotel/:id', HotelsController.getHotel);
router.post('/hotel/:id', RequireSignIn, HotelsController.updateHotel);
router.delete('/hotel/:id', RequireSignIn, HotelsController.deleteHotel);

router.get("/hotels/my", RequireSignIn, HotelsController.getUserHotels);

module.exports = router;
