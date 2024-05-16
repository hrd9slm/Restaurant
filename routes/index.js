const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/homecontroller');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const Joi = require('joi');

const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'img'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 Mb
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers images sont autorises (jpeg, jpg, png, gif)'));
        }
    }
});

const repasSchema = Joi.object({
    nom: Joi.string().required(),
    description: Joi.string().required(),
    prix: Joi.number().required(),
    categorie_id: Joi.number().integer().required()
});



router.get('/',homecontroller.renderPage);
router.post('/',homecontroller.newsLetter);


router.get('/about', (req, res) => {
    res.render('about'); 
});

router.get('/contact', (req, res) => {
    res.render('contact'); 
});
router.get('/repas', async(req, res) => {
    const categories = await prisma.categorie.findMany();
    res.render('ajouterRepas',{categories}); 
});

router.post('/ajouter-repas', upload.single('url_image'), async (req, res) => {
    const { error, value } = repasSchema.validate(req.body);
    if (error) {
  
        return res.status(400).send(`Erreur de validation: ${error.details[0].message}`);
    }

    const { nom, description, prix, categorie_id } = req.body;
    console.log('categorie_id',req.body);
    const image_url = '/img/' + req.file.originalname; 


     try {
         const nouveauRepas = await prisma.repas.create({
             data: {
                 nom,
                 description,
                 prix: parseFloat(prix),
                 image_url,
                 categorie_id: parseInt(categorie_id)
             }
         });

         res.redirect('/repas'); 
     } catch (error) {
         console.error(error);
         res.status(500).send('Erreur de serveur');
     }
 });

 router.get('/layout', async(req,res)=>{
    try {
        // Récupérer les informations de contact depuis la base de données
        const restaurantInfo = await prisma.restaurant.findUnique({
            where: { id: 1 }, // Suppose que les informations de contact sont associées à un restaurant spécifique avec l'ID 1
            select: {
                email: true,
                adresse: true,
                numero_de_telephone: true
            }
        });

        // Rendre la vue avec les informations de contact
        res.render('layout', { restaurantInfo });
    } catch (error) {
        console.error("Erreur lors de la récupération des informations de contact :", error);
        res.status(500).send("Erreur lors de la récupération des informations de contact.");
    }

});

 module.exports = router;