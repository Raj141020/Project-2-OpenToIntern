const express = require('express');
const route = require('./routes/route');
const mongoose  = require('mongoose');
const app = express();
const multer = require('multer')

app.use(express.json());
app.use(multer().any())

mongoose.connect("mongodb+srv://Rajnagwanshi:abhishek1410@cluster0.qlrpwrw.mongodb.net/Project2-OpenToIntern", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(3001, function () {
    console.log('Express app running on port ' + (3001))
});
