const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const fromEmailAddress = process.env.FROM_EMAIL_ADDRESS
const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: fromEmailAddress,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>'
      }
      sgMail.send(msg)
}

const sendCancelEmail = (email, name) => {
    const msg = {
        to: email,
        from: fromEmailAddress,
        subject: 'Sorry to see you go!',
        text: `It's been a pleasure, ${name}. If possible, could you let us know why you're leaving? If not, hope you come back soon! `
    }
    sgMail.send(msg)
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}