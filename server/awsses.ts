import { env } from "./env";

// const accountSid = "ACb09ca0aa10be7f6646219656253331fd";
// const authToken = env.TWILIO_AUTH_TOKEN;
// console.log("authToken", authToken);
// const client = require("twilio")(accountSid, authToken);

// client.messages
//   .create({
//     body: "Hello from Twilio",
//     from: "+18447690503",
//     to: "+18324174232",
//   })
//   .then((message) => console.log(message.sid));

import { MailtrapClient } from "mailtrap";

const TOKEN = "ed12e9b1ba82f213e04e32bd4cbedd9e";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@coogsmail.online",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "brickmp4@gmail.com",
  },
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
