const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const envoyerEmail = require("../utils/envoyerEmail");

const homecontroller = {
  getChef: async (res, req) => {
    try {
      const chefs = await prisma.employee.findMany();
      return chefs;
    } catch (error) {
      console.log({ error: "erreur dans la recuperation des chefs" });
    }
  },
  getBreakfast: async (res, req) => {
    try {
      const repasBreakfast = await prisma.repas.findMany({
        where: {
          categorie_id: 1,
        },
      });
      return repasBreakfast;
    } catch (error) {
      console.log({ error: "erreur dans la recuperation des repasBreakfast" });
    }
  },
  getLaunch: async (res, req) => {
    try {
      const repasLaunch = await prisma.repas.findMany({
        where: {
          categorie_id: 2,
        },
      });
      return repasLaunch;
    } catch (error) {
      console.log({ error: "erreur dans la recuperation des repasLaunch" });
    }
  },
  getDinner: async (res, req) => {
    try {
      const repasDinner = await prisma.repas.findMany({
        where: {
          categorie_id: 3,
        },
      });
      return repasDinner;
    } catch (error) {
      console.log({ error: "erreur dans la recuperation des  repasDinner" });
    }
  },

  renderPage: async (req, res) => {
    try {
      const chefs = await homecontroller.getChef(req, res);
      const repasBreakfast = await homecontroller.getBreakfast(req, res);
      const repasLaunch = await homecontroller.getLaunch(req, res);
      const repasDinner = await homecontroller.getDinner(req, res);

      res.render("index", { chefs, repasBreakfast, repasLaunch, repasDinner });
    } catch (error) {
      console.error("Erreur de l appelle de lindex :", error);
      res.status(500).send("Erreur de l appelle de lindex");
    }
  },
  newsLetter: async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
    const htmlTemplate = ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Abonnement à la newsletter</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #333;
                text-align: center;
            }
    
            p {
                color: #666;
                margin-bottom: 20px;
            }
    
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 3px;
               
            }
    
            .btn:hover {
                background-color: #0056b3;
                color: #fff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Abonnement à la newsletter</h1>
            <p>Merci de vous être abonné à notre newsletter ! Vous recevrez bientôt les dernières nouvelles, offres et mises à jour.</p>
            <p>Pour toute question ou assistance supplémentaire, n'hésitez pas à nous contacter.</p>
            <p>Merci encore et à bientôt !</p>
            <p>L'équipe de [Restoran]</p>
            <p><a href="mailto:contact@example.com" class="btn">Contactez-nous</a></p>
        </div>
    </body>
    </html>
     `;

    try {
      const emailExiste = await prisma.newsletter.findUnique({
        where: {
          email: email,
        },
      });
      console.log("emailExiste", emailExiste);
      if (emailExiste) {
        console.log(`L email ${email} est deja abonne e la newsletter.`);
        res.send(`Vous etes deja abonne a la newsletter.`);
      } else {
        const nouveauEmail = await prisma.newsletter.create({
          data: {
            email,
            is_valid: true,
            restaurant_id: 1,
          },
        });
        await envoyerEmail(email, "S'abonner à la newsletter", htmlTemplate);
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur de serveur (email)");
    }
  },
};

module.exports = homecontroller;
