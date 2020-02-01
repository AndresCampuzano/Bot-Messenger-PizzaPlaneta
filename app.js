'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAIyWa72nAIBAM9LdZCBeHmMeKnaZCbZBnhtrkzWtIJ9wu500sxHiTvIlqlIb8HZCaNlQ7pfIVGMh4T3agZCF11dCjSj4RfSsldQ7TXvMDFtEeJo8VQ3oOaLVXu6FlDZABBpjvBUD209dQL4RXhGOsv0YMRLUTmhyA9BskXTntzQZDZD"

const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'pizzaplaneta_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('PizzaPlaneta no tienes permisos.');
    }
});

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event){
    if(event.message){
        handleMessage(senderId, event.message)
    } else if(event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event){
    if(event.text){
        //Acá se pone la funcion que se desea al momento de si el usuario escribe cualquier cosa
        // defaultMessage(senderId);
        if (event.text === "Nuestro menu 🍕") {
            showPizzas(senderId)
        } else if (event.text === "Contactanos 📞") {
            contactSupport(senderId)
        } else if (event.text === "Acerca de nosotros 🐶") {
            messageImage(senderId)
        }
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu o las opciones rapidas",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Nuestro menu 🍕",
                    "payload": "PIZZAS_BOT_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Contactanos 📞",
                    "payload": "CONTACT_BOT_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de nosotros 🐶",
                    "payload": "ABOUT_BOT_PAYLOAD"
                }
            ]
        }
    }
    // callSendApi(messageData)
    senderActions(senderId)
    callSendApi(messageData)
    // setTimeout(function(){ callSendApi(messageData); }, 2000);
}

function handlePostback(senderId, payload){
    console.log(payload)
    switch (payload) {
        case "GET_STARTED_PIZZAPLANETA":
            senderActions(senderId)
            console.log(payload)
            defaultMessage(senderId)
        break;
        case "PIZZAS_PAYLOAD":
            senderActions(senderId)
            showPizzas(senderId);
        break;
        case "CONTACT_PAYLOAD":
            senderActions(senderId)
            contactSupport(senderId);
        break;
        case "LOCATIONS_PAYLOAD":
            senderActions(senderId)
            showLocation(senderId);
        break;
        case "PIZZA_SENT_PAYLOAD":
            senderActions(senderId)
            receipt(senderId)
        break;
    }
}

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event){
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
        break;
        case "video": 
            console.log(attachment_type);
        break;
        case "audio":
            console.log(attachment_type);
        break;
      case "file":
            console.log(attachment_type);
        break;
      default:
            console.log(attachment_type);
        break;
    }
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
        function (err) {
            if (err) {
                console.log('Ha ocurrido un error')
            } else {
                console.log('Mensaje enviado')
            }
        }
    )
}


function showPizzas(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements":[
                        {
                          "title":"Pepperoni",
                          "subtitle":"Con todo el sabor del pepperoni.\n"+"Personal: 20 cm\n" + "Mediana: 30 cm\n"+ "Familiar: 35 cm",
                          "image_url": "https://images.pexels.com/photos/774487/pexels-photo-774487.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                          "buttons":[
                            {
                                "type":"postback",
                                "title":"Elegir Personal",
                                "payload":"PIZZA_SENT_PAYLOAD",
                              },
                            {
                              "type":"postback",
                              "title":"Elegir Mediana",
                              "payload":"PIZZA_SENT_PAYLOAD",
                            },
                            {
                              "type":"postback",
                              "title":"Elegir Familiar",
                              "payload":"PIZZA_SENT_PAYLOAD",
                            }
                          ]
                        },
                        {
                          "title":"Pollo BBQ",
                          "subtitle":"Con todo el sabor del pollo BBQ.\n"+"Personal: 20 cm\n" + "Mediana: 30 cm\n"+ "Familiar: 35 cm",
                          "image_url": "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                          "buttons":[
                            {
                              "type":"postback",
                              "title":"Elegir Personal",
                              "payload":"PIZZA_SENT_PAYLOAD",
                            },
                            {
                              "type":"postback",
                              "title":"Elegir Mediana",
                              "payload":"PIZZA_SENT_PAYLOAD",
                            },
                            {
                              "type":"postback",
                              "title":"Elegir Familiar",
                              "payload":"PIZZA_SENT_PAYLOAD",
                            }
                          ]
                        }
                      ]
                }
            }
        }
    }
    callSendApi(messageData)
}

//clase 19
function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message":{
            "attachment":{
              "type":"image", 
              "payload":{
                "is_reusable": true,
                "url":"https://media.giphy.com/media/9fuvOqZ8tbZOU/giphy.gif"
              }
            }
          }
    }
    callSendApi(messageData)
}

//clase 19
function contactSupport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Contactanos por una llamada",
                "buttons":[
                  {
                    "type":"phone_number",
                    "title":"Llamar",
                    "payload":"+573205644748"
                  }
                ]
              }
            }
          }
    }
    callSendApi(messageData)
}

//clase 19
function showLocation(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements":[
                        {
                          "title":"Nuestas Sucursales en Medellín",
                          "subtitle":"Disfruta de un 10% de descuento los viernes",
                          "image_url": "https://media-cdn.tripadvisor.com/media/photo-w/13/df/d8/ea/our-new-look-store.jpg",
                          "buttons":[
                            {
                                "type":"web_url",
                                "url":"https://www.google.com/maps/search/domino's+pizza/@6.2477598,-75.5941865,12z",
                                "title":"Abrir mapa",
                                "webview_height_ratio": "tall"
                            }
                          ]
                        }
                      ]
                }
            }
        }
    }
    callSendApi(messageData)
}

// clase 20

function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Andres Campuzano",
                    "order_number": "123123",
                    "currency": "COP",
                    "payment_method": "Efectivo",
                    "order_url": "https://github.com/AndresCampuzano",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "Dominos Poblado",
                        "street_2": "---",
                        "city": "Medellin",
                        "postal_code": "543135",
                        "state": "Antioquia",
                        "country": "Colombia"
                    },
                    "summary": {
                        "subtotal": 18000,
                        "shipping_cost": 3000,
                        "total_tax": 500,
                        "total_cost": 21500
                    },
                    "adjustments": [
                        {
                            "name": "Descuento frecuente",
                            "amount": 1000
                        }
                    ],
                    "elements": [
                        {
                            "title": "Pizza Pepperoni",
                            "subtitle": "La mejor pizza de pepperoni",
                            "quantity": 1,
                            "price": 18000,
                            "currency": "COP",
                            "image_url": "https://images.pexels.com/photos/774487/pexels-photo-774487.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                        },
                        {
                            "title": "Bebida",
                            "subtitle": "Coca Cola Personal",
                            "quantity": 1,
                            "price": 2500,
                            "currency": "COP",
                            "image_url": "https://www.restaurantnews.com/wp-content/uploads/2014/01/Dominos-Pizza-Signs-Multi-Year-Beverage-Supplier-Agreement-with-The-Coca-Cola-Company.jpg"
                        }
                    ]
                }
            }
        }
    }
    setTimeout(function(){ askAdddress(senderId); }, 2000);
    callSendApi(messageData)
}

function askAdddress(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Por favor escribe tu dirección de envio para proceder",
        }
    }
    callSendApi(messageData)
}


app.listen(app.get('port'), function(){
    console.log('Server running on port: ', app.get('port'));
});