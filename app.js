const express = require('express');
const path = require('path');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const routes = require('./routes'); 
const bodyParser = require('body-parser');
const logMiddleware=require('./middlewares/logMiddleware ');
const expressLayout=require('express-ejs-layouts');
app.use(logMiddleware);



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, 'views/layout'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(expressLayout);

app.use(async (req, res, next) => {
    try {
        const restaurantInfo = await prisma.restaurant.findUnique({
            where: { id: 1 }, 
            select: {
                email: true,
                adresse: true,
                numero_de_telephone: true
            }
        });
     
        app.locals.restaurantInfo = restaurantInfo;
        next();
    } catch (error) {
        console.error("Erreur lors de l affichage des informations de restaurant :", error);
        res.status(500).send("Erreur lors de l affichage des informations de contact.");
    }
});
app.use('/', routes); 



const PORT = process.env.PORT || 1515;
app.listen(PORT, () => {
   
    console.log(`Serveur démarré sur le port ${PORT}`);
});
