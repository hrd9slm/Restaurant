const nodemailer=require("nodemailer")

module.exports =async(userEmail,subject,htmlTemplate)=>{
    try{

        const transporter = nodemailer.createTransport({
            host: process.env.HOST_EMAIL,
            port: parseInt(process.env.PORT_Email),
            secure: true, 
            auth: {
              user: process.env.EMAIL_ADRESS,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

         
            const optionEmail = {
              from: process.env.EMAIL_ADRESS, 
              to: userEmail, 
              subject: subject, 
              text: "Hello world?", 
              html: htmlTemplate, 
            }
             const info = await transporter.sendMail(optionEmail);
             console.log("Envoi d email:"+info.response);
         
    }
    catch(error){
        console.log(error);
        throw new Error("Erreur server nodemailer ")
    }
}