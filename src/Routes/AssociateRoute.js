import {createAssociate,getAssociate,updateAssociate,deleteAssociate, loginAssociate} from '../Controllers/AssociateController.js'
import express from 'express';

const router = express.Router();

router.route('/createAssociate').post(createAssociate);
router.route('/loginAssociate').post(loginAssociate);
router.route('/getAssociate').get(getAssociate);
router.route('/updateAssociate/:id').put(updateAssociate);
router.route('/deleteAssociate/:id').delete(deleteAssociate);


export default router;

