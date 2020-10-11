/*
 * EMPLOYEE MANAGER WEB APPLICATION
 * USES:
 *      - express
 *      - ejs
 *      - body-parser
 *      - mongoose
*/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/employeeDB", {useNewUrlParser: true, useUnifiedTopology: true});

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    phone: String
});
const Employee = new mongoose.model("Employee", employeeSchema);

app.get("/", function(req, res) {
    Employee.find({}, function(err, results) {
        if(!err) {
            res.render("index", {results});
        }
    });
});

app.post("/addemployee", function(req, res) {
    const newEmployee = new Employee({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone
    });

    newEmployee.save(function(err) {
        if (err) console.log(err);
        else res.redirect("/");
    });
});

app.post("/changeemployee", function(req, res) {
    let objForUpdate = {};
    if (req.body.name) objForUpdate.name = req.body.name;
    if (req.body.email) objForUpdate.email = req.body.email;
    if (req.body.address) objForUpdate.address = req.body.address;
    if (req.body.phone) objForUpdate.phone = req.body.phone;

    objForUpdate = { $set: objForUpdate };

    Employee.updateOne({_id: req.body.changebuttonid}, objForUpdate, function(err) {
        if(!err) {
            res.redirect("/");
        }
    });
});

app.post("/deleteemployee", function(req, res) {
    if(req.body.deletebuttonid == "all") {
        Employee.deleteMany({}, function (err) {
            if (err) return console.log(err);
            else res.redirect("/");
        });
    }
    else {
        Employee.deleteOne({ _id: req.body.deletebuttonid }, function (err) {
            if (err) return console.log(err);
            else res.redirect("/");
        });
    }
});







let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function() {
    console.log("Server started on port 3000.");
});