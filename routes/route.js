const express = require('express');
const router = express.Router();

const college = require('../Controller/collegeController')

const intern = require('../Controller/internController')


router.post('/functionup/colleges',college.creatcollege) // Creating College Data

router.post('/functionup/interns',intern.createIntern) // Creating Interns Data

router.get('/functionup/collegeDetails',college.getlistofstudents) // Getting List of all Interns


module.exports = router;