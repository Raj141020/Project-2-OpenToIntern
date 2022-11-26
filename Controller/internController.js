const validation  = require("../Validation/validation"); 

const intern = require("../Models/internModel");

const college = require("../Models/collegeModel");



let { isEmpty, isValidStudentName, isValidEmail, isValidStudentMobile} = validation //Destructuring

const createIntern = async function(req,res){ 
    try{
        res.setHeader('Access-Control-Allow-Origin','*')
        let data = req.body
    if(Object.keys(data).length==0){// Checking body is empty or not
        return res.status(400).send({status:false,message:"Body is empty"})
    }

    let {name,email,mobile,collegeName,isDeleted} = data //Destructuring

    if(!name||!email||!mobile||!collegeName) {
        return res.status(400).send({status:false,message:"All fields must be required"})
    }

/*------------------------Checking attributes are empty or not-----------------------------------*/

    if(!isEmpty(name)){
        return res.status(400).send({status:false,message:"First Name is required"})
    }
    if(!isEmpty(email)){
        return res.status(400).send({status:false,message:"Last Name is required"})
    }
    if(!isEmpty(mobile)){
        return res.status(400).send({status:false,message:"title  is required"})
    }
    if(!isEmpty(collegeName)){
        return res.status(400).send({status:false,message:"Email is required"})
    }



    if(!isValidStudentName(name)){ // Student Name validation
        return res.status(400).send({status:false,message:"Name is Wrong"})
    }

    if(!isValidEmail(email)){ // Student Email validation
        return res.status(400).send({status:false,message:"Please provide valid Email"})
    }

     let studentemail = await intern.findOne({email:email}) // Checking Duplicate Email
     if(studentemail){
        return res.status(400).send({msg:"Email already registered"})
     }

     /* Example of mobile valid Numbers  +919367788755
                                         89898293041
                                         918765431234
                                         +16308520397
                                         786-307-3615 
                                         */

    if(! isValidStudentMobile(mobile)){ // Student mobile validation
        return res.status(400).send({status:false,message:"Please provide valid mobile number"})
    }

    let studentMobile = await intern.findOne({mobile:mobile}) // Checking Duplicate Mobile No
     if(studentMobile){
        return res.status(400).send({msg:"Mobile Number already registered"})
     }

     
     let getCollegeId = await college.findOne({name:data.collegeName})

     if(!getCollegeId){
        return res.status(404).send({msg:"Your College is not registered"})
     }

     data.collegeId = getCollegeId["_id"]
    
    /*-----------------------------------CREATING INTERN-----------------------------------------------------*/

    let internCreate = await intern.create(data)

    res.status(201).send({status:true,data:{isDeleted:internCreate.isDeleted,name:internCreate.name,email:internCreate.email,mobile:internCreate.mobile,collegeId:internCreate.collegeId}})
    console.log(internCreate)
    }
    catch(error){
          res.status(500).send({status:false,message:error.message})
    }
    
}


module.exports.createIntern = createIntern

