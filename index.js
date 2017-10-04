var SERVER_product = 'product-api'
var PORT = 3000;
var HOST = '127.0.0.1';
var logger = require('morgan')
var get = 0;
var post = 0;


var restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ product: SERVER_product})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.product, server.url)
  console.log('Resources:')
  console.log(' /products')
  console.log(' /products/:id')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())
  .use(logger('dev'))

// Get all products in the system
server.get('/products', function (req, res, next) {
  get = get + 1;
  console.log(`Get count: ` + get)

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the products in the system
    res.send(products)
  
  })
})

// Get a single product by their product id
server.get('/products/:id', function (req, res, next) {

  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (product) {
      // Send the product if no issues
      res.send(product)
    } else {
      // Send 404 header if the product doesn't exist
      res.send(404)
    }
  })
})

// Create a new product
server.post('/products', function (req, res, next) {
  post = post + 1;
  console.log('Post count: ' + post)

  // Make sure product is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('product must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  var newproduct = {
		product: req.params.product, 
		price: req.params.price
	}

  // Create the product using the persistence engine
  productsSave.create( newproduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  })
})

// Update a product by their id
server.put('/products/:id', function (req, res, next) {

  // Make sure product is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('product must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  
  var newproduct = {
		_id: req.params.id,
		product: req.params.product, 
		price: req.params.price
	}
  
  // Update the product with the persistence engine
  productsSave.update(newproduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete product with the given id
server.del('/products/:id', function (req, res, next) {

  // Delete the product with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})



//Delete all products
server.del('/products/', function (req, res, next) {
  
    // Delete the product with the persistence engine
    productsSave.deleteMany({}, function (error, product) {
  
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send a 200 OK response
      res.send()
    })
  })

