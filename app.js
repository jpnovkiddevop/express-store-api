require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

const connectDB = require("./db/connect")
const productsRouter = require("./routes/products")

const notFound = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

app.use(express.json()) // for parsing application/json

app.get("/", (req, res) => {
    res.send("<h1>Store API</h1><a href='/api/v1/products'>PRODUCTS</a>")
})

app.use("/api/v1/products", productsRouter)

//product routes

app.use(notFound)
app.use(errorMiddleware)


const port = process.env.PORT || 5002

const start = async () => {
    try {
        //connectdb
        await connectDB(process.env.MONGO_URI)
        app.listen(port, 
            console.log(`server listening on port ${port}...`)
        )
    } catch (error) {
        console.log(error)
    }
}

start()