const express= require('express')
const {AddWaterParams,getAllWaterParams,getWaterParamsByProduct_id,getWaterParamsByUserName } =require('../controllers/saveWaterParams');

const router = express.Router()

router.post('/save-water-params',AddWaterParams);

router.get('/get-all-water-params',getAllWaterParams);

router.get('/get-water-params-by-product_id/:product_id',getWaterParamsByProduct_id);

router.get('/get-water-params-by-userName/:userName',getWaterParamsByUserName);

module.exports=router;
