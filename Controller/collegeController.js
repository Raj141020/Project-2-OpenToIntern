const validation  = require("../Validation/validation"); 

const college = require("../Models/collegeModel");

const internModel = require("../Models/internModel");
const { set } = require("mongoose");


let { isEmpty, isValidCollegeName,isValidFCName, isValidCollegeLogoLink} = validation //Destructuring

const creatcollege = async function(req,res){

    try{
         
        let data = req.body
        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,message:"Body is empty"})
        }
        
        let {name,fullName,logoLink,isDeleted} = data //Destructuring

    if(!name||!fullName||!logoLink) {
        return res.status(400).send({status:false,message:"All fields must be required"})
    }


    /*------------------------Checking attributes are empty or not-----------------------------------*/


    if(!isEmpty(name)){
        return res.status(400).send({status:false,message:"Name is required"})
    }
    if(!isEmpty(fullName)){
        return res.status(400).send({status:false,message:"Full Name is required"})
    }
    if(!isEmpty(logoLink)){
        return res.status(400).send({status:false,message:"Logo link is required"})
    }


    if(!isValidCollegeName(name)){ // College short name validation
        return res.status(400).send({status:false,message:"College name is Wrong"})
    }
    
    let collegeName = await college.findOne({name:name}) //Duplicate checking
    if(collegeName){
        return res.status(400).send({msg:"College Name already registered"})
    }

    if(! isValidFCName(fullName)){ // College Full Name Validation
        return res.status(400).send({status:false,message:"Please provide valid full college name"})
    }

    if(! isValidCollegeLogoLink(logoLink)){ // College Logo Link Validation
        return res.status(400).send({status:false,message:"Please provide valid logo link"})
    }


    /*-----------------------------------CREATING COLLEGE DATA----------------------------------------*/


    let collegeCreate = await college.create(data)
    res.status(201).send({status:true,data:{name:collegeCreate.name,fullName:collegeCreate.fullName,logoLink:collegeCreate.logoLink,isDeleted:collegeCreate.isDeleted}})
    console.log(collegeCreate)
    }
    
    catch(error){
          res.status(500).send({status:true,message:error.message})
    }
}

module.exports.creatcollege = creatcollege


 /*-----------------------------------GETTING STUDENT LIST----------------------------------------*/


 const getlistofstudents = async function(req,res){

    try{
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.query.collegeName

         if(!data){
            return res.status(400).send({status:false,message:"Please provide college name in query"})
        }

        let getCollegeName = await college.findOne({name:data})
        if(!getCollegeName){
            return res.status(404).send({msg:"Your College is not Registered"})
        }

        let getcollegeId = getCollegeName._id
        console.log(getcollegeId)

        let getstudentList = await internModel.find({collegeId:getcollegeId,isDeleted:false}).select({_id:1,name:1,email:1,mobile:1})
        console.log(getstudentList)
        if(getstudentList.length == 0){
            return res.status(200).send({msg:`No student from ${data} is registered for Internship`})
        }

        let collegeData = {name:getCollegeName.name,fullName:getCollegeName.fullName,logoLink:getCollegeName.logoLink}
        console.log(collegeData)

        collegeData.interns = getstudentList
         
        res.status(200).send({status:true,data:collegeData})

    }
    catch(error){
        res.status(500).send({msg:error.message})
    }
 }

 module.exports.getlistofstudents = getlistofstudents