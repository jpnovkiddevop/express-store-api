const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
    
    const products = await Product.find({price: {$gt: 30}})
    .sort("price")
    .select('name price')
    
    res.status(200).json({products, nHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    console.log(numericFilters)
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true' ? true:false
    }
    if(company) {
        queryObject.company = company
    }
    if(name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    
    if(numericFilters) {
        const operatorMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$lte',
        }

        let filters = numericFilters.replace(/\s+/g, '-')
        .replace(/([<>=]+)/g, (match, operators) => {
            const operator = operatorMap[operators];
            return operator ? operator : match;
        });

        console.log(filters);
        
        const options = ['price', 'rating'];
    
        filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split('-');
        if (options.includes(field)) {
            queryObject[field] = {[operator]: Number(value)};
        }
        });
}
    console.log(queryObject)
    let result= Product.find(queryObject);
    if(sort) {
        const sortList = sort.split(",").join(" ")
        result = result.sort(sortList)    
    }else{
        result = result.sort("createdAt")
    }

    if(fields) {
        const fieldsList = fields.split(",").join(" ")
        result = result.select(fieldsList)    
    }else{
        result = result.select("createdAt")
    }
   
const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) || 20
const skip = (page - 1) * limit; 

result = result.skip(skip).limit(limit)
    const products = await result
    
    res.status(200).json({products, nHits: products.length})
};

module.exports = {
    getAllProductsStatic,
    getAllProducts
}