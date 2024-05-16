const fs = require('fs').promises;
const logMiddleware = async (req, res, next) => {
    try {
        // Obtenir les informations sur la requête
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        
        
        // Construire le message à enregistrer
        const logMessage = `${timestamp} - ${method} ${url} \n`;

        // Enregistrer le message dans un fichier texte
        await fs.appendFile('requestLogs.txt', logMessage);

        // Passer à la prochaine fonction middleware
        next();
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de l enregistrement du journal :', error);
        next(error);
    }
};
module.exports = logMiddleware;