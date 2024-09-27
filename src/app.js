// const express = require('express'); 
// const signuproute = require('./routes/signup');
// const loginroute = require('./routes/login');
// const userroute = require('./routes/user');
// const formsroute = require('./routes/forms');
// const logoutroute = require('./services/logout');
// const callroute = require('./routes/callRoutes');
// const callLogRoutes = require('./routes/logRoute'); 
// // const phNoVerifyroute = require('./routes/phNoVerify'); 

// const bodyParser = require('body-parser');
// const cors = require('cors');
// const createAdminAccount = require("./scripts/admin");
// const redirectCalls = require('./twilio/redirectCalls');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json());
// app.use(cors());

// createAdminAccount();

// app.use("/user", signuproute);
// app.use("/auth", loginroute);
// app.use("/api", userroute);
// app.use("/api", logoutroute);
// app.use("/issue", formsroute);
// app.use("/api/calls", callroute); 
// app.use("/calls", callLogRoutes); 
// // app.use("/verify", phNoVerifyroute); 
// app.use("/twilio", redirectCalls);

// app.listen(PORT, () => { 
//     console.log(`Listening to port: ${PORT}`);
// });

const express = require('express'); 
const dotenv = require('dotenv');
const signuproute = require('./routes/signup');
const loginroute = require('./routes/login');
const userroute = require('./routes/user');
const formsroute = require('./routes/forms');
const logoutroute = require('./services/logout');
const callroute = require('./routes/callRoutes');
const callLogRoutes = require('./routes/logRoute'); 
const imageUploadRoutes = require('./imageUpload');
const phoneVerification = require('./phoneVerification');
const twilio = require("twilio");
const bodyParser = require('body-parser');
const cors = require('cors');
const createAdminAccount = require("./scripts/admin");
const redirectCalls = require('./twilio/redirectCalls');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

createAdminAccount();

app.use("/user", signuproute);
app.use("/auth", loginroute);
app.use("/api", userroute);
app.use("/api", logoutroute);
app.use("/issue", formsroute);
app.use("/api/calls", callroute); // Add the call routes
app.use("/calls", callLogRoutes); // Add the call routes
app.use("/twilio", redirectCalls);
app.use('/', imageUploadRoutes);
app.use('/', phoneVerification);

// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// async function createService() {
//   const service = await client.verify.v2.services.create({
//     friendlyName: "My First Verify Service",
//   });

//   console.log(service.sid);
// }

// createService();

app.listen(PORT, () => { 
    console.log(`Listening to port: ${PORT}`);
});