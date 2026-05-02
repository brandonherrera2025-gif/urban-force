const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let orders = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/order", (req, res) => {
    const order = req.body;
    orders.push(order);

    res.json({
        success: true
    });
});

app.get("/api/orders", (req, res) => {
    res.json(orders);
});

app.listen(5000, () => {
    console.log("Servidor activo en http://127.0.0.1:5000");
});