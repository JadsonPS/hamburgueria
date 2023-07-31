const express = require('express');
const app = express();
const port = 3003;
const uuid = require('uuid');
app.use(express.json()); 

const orders = [];

//middlaeware de verificação de id
const identificadoDeId = (request, response, next) => {
  const {id} = request.params
  const index = orders.findIndex(order => order.id === id)
   if (index < 0) {
    console.log('meddlewares chamado')
    return response.status(404).json({"mensagem":"Order not found"})
  } 
  /* console.log('middlawre ativado') */
   next()
}  



// middleware do metodo e url
const metodoEUrl = (request, response, next) => {
  const {url, method} = request;
  console.log("URL: " + url);
  console.log("method: " + method);
  next()
}

//GET
app.get('/order', metodoEUrl, (request, response) => {
  /* console.log(request)  */
  
  return response.json(orders)
})



//POST
app.post('/order', metodoEUrl, (request, response) => {
  const {order, nameClient, price } = request.body
  const status = "Em preparação"
  const orderClient = {id:uuid.v4(), order, nameClient, price, status};
  orders.push(orderClient)
  return response.status(201).json(orderClient)
})




//PUT
app.put('/order/:id', metodoEUrl, identificadoDeId, (request, response) => {
  const {id} = request.params
  const {order, nameClient, price } = request.body
  const index = orders.findIndex(order => order.id === id)
  const status = orders[index].status
  const newOrder = {id, order, nameClient, price, status }
 /* if (index < 0) {
    return response.status(404).json({"mensagem":"Order not found"})
  } */ 
  orders[index] = newOrder 
  return response.json(newOrder)
})



//DELETE
app.delete('/order/:id', metodoEUrl, identificadoDeId, (request, response) => {
  const {id} = request.params
  const index = orders.findIndex(order => order.id === id)
  /* if (index < 0) {
    return response.status(404).json({"mensagem":"Order not found"})
  } */
  orders.splice(index, 1) //apaga o item da array
  return response.status(201).json(orders)
})


// GET - retorna um pedido específico
app.get('/order/:id', metodoEUrl, identificadoDeId, (request, response) => {
  const {id} = request.params
  const index = orders.findIndex(order => order.id === id)

  
  /* if (index < 0) {
    return response.status(404).json({"mensagem":"Order not found"})
  } */
  
  return response.json(orders[index])
  
})



// PATCH - altera o status do pedido para pronto
app.patch('/order/:id', metodoEUrl, identificadoDeId, (request, response) => {
  const {id} = request.params
  const index = orders.findIndex(order => order.id === id)
  orders[index].status = 'Pronto' 
  /* console.log(orders[index].status ) */
  /* if (index < 0) {
    return response.status(404).json({"mensagem":"Order not found"})
  } */
  return response.json(orders[index])
})



app.listen(port, () => {
  console.log('servidor online!')
})