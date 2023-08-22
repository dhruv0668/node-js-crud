const express = require("express");
const app = express();
const cors = require("cors")
require('./db/config');
const User = require("./db/user");
const Product = require("./db/product");
const product = require("./db/product");
const jwt = require("jsonwebtoken");
const jwtkey = 'e-comm'
const path = require("path")
const multer = require("multer")
// const imageModel = require("./image.js")


app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    jwt.sign({ result }, jwtkey, { expiresIn: "3h" }, (err, token) => {
        if (err) {
            res.send("something went wrong, please try after sometime");
        }
        res.send({ result, auth: token });
    })
});

app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            if (user) {
                jwt.sign({ user }, jwtkey, { expiresIn: "3h" }, (err, token) => {
                    if (err) {
                        res.send("something went wrong, please try after sometime");
                    }
                    res.send({ user, auth: token });
                })
            }

        } else {
            res.send("user not found");
        }
    } else {
        res.send("user not found");
    }
})
 

app.post("/add-product", async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
});

app.get("/products", async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "no result found" });
    }
});

app.delete("/product/:id", async (req, res) => {
    const result = await product.deleteOne({ _id: req.params.id });
    res.send(result);
});

app.get("/product/:id", async (req, res) => {
    const result = await product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result)
    } else {
        res.send({ result: "result not found" });
    }
});

app.put("/product/:id", async (req, res) => {
    let result = await product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    );
    res.send(result)
});

app.get("/search/:key", async (req, res) => {
    let result = await product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { Company: { $regex: req.params.key } },
            { Category: { $regex: req.params.key } }
        ]
    });
    res.send(result)
});

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        jwt.verify(token, jwtkey, (err, valid) => {
            if (err) {
                res.status(401).send({ result: "please Provide valid token" })
            } else {
                next();
            }
        })
    } else {
        res.status(403).send({ result: "please add token with header" })
    }

}

app.listen(5000, (req, res) => {
    console.log("App is runing on port 5000");
});