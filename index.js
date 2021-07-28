var express = require("express");
var app = express();
app.use(express.json());
var mongoose = require("mongoose");
var PRODUCTS_SCHEMA = require('./Schema/PRODUCTS_SCHEMA.JS')
var PORT = 8080 || PROCESS.ENV.PORT;
var URL = "mongodb+srv://Kshitiz_Agarwal:FJ9EiIfKDWGb6nzS@cluster0.mkzhm.mongodb.net/Warehouse?retryWrites=true&w=majority";

//Staring server at port 8080
app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log("Server started successfully at port " + PORT);
});
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err);
    console.log("Connected to database");
});

//API to get all categories in database
app.get('/getcategories', async (req, res) => {
    var Categories = []
    try {
        const categories = await PRODUCTS_SCHEMA.find({});
        if (categories) {
            categories.forEach(element => {
                Categories.push(element.Category);
            })
            res.status(200).send(Categories);
        }
        else {
            res.status(200).send({ msg: "No products exist in database" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ msg: "Bad Request" });
    }
})
//API to get all subcategories for a given Category in database
app.post('/getsubcategories', async (req, res) => {
    var Subcategories = [];
    try {
        const subcategories = await PRODUCTS_SCHEMA.findOne({ Category: req.body.category });
        if (subcategories) {
            subcategories.Items.forEach(element => {
                Subcategories.push(element.Subcategory);
            })
            res.status(200).send(Subcategories);
        }
        else res.status(200).send({ msg: "No subcategories exist for given category" })
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ msg: "Bad request" });
    }
})
//API to get all products for a given category in database
app.post('/getproductsbycategory', async (req, res) => {
    var Products = [];
    try {
        const products = await PRODUCTS_SCHEMA.findOne({ Category: req.body.category });
        if (products) {
            products.Items.forEach(element => {
                element.Products.forEach(p => {
                    Products.push(p);
                })
            })
            res.status(200).send(Products);
        }
        else
            res.status(200).send({ msg: "No products exist for given category" })
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ msg: "Bad request" });
    }
})
//API to get all products for a given subcategory in database
app.post('/getproductsbysubcategory', async (req, res) => {
    try {
        const products = await PRODUCTS_SCHEMA.findOne({ "Items.Subcategory": req.body.subcategory })
        if (products) {
            products.Items.forEach(element => {
                if (element.Subcategory == (req.body.subcategory)) {
                    res.status(200).send(element.Products);
                }
            });
        }
        else {
            res.status(200).send({ msg: "No products exist for given subcategory" })
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ msg: "Bad request" });
    }
})
//API to add new product for a given category and subcategory in database
app.post('/newproduct', async (req, res) => {
    Category = req.body.category;
    Subcategory = req.body.subcategory;
    product = req.body.product;
    try {
        const productadded = await PRODUCTS_SCHEMA.findOneAndUpdate({ Category: Category, "Items.Subcategory": Subcategory }, { $push: { "Items.$.Products": product } });
        if (productadded) res.status(200).send({ msg: "New product added into database" });
        else res.status(500).send({ msg: "Bad Request" });
    }
    catch (e) {
        console.log(e);
    }

})

//API to get add a new Category, Subcategory and Poduct into the database
app.post('/newitem', async (req, res) => {
    const newentry = new PRODUCTS_SCHEMA(req.body);
    try {
        const inserted = await newentry.save();
        if (inserted)
            console.log("done");
    }
    catch (e) {
        console.log(e);
    }

})


