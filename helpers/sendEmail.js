// import sendgrid from "@sendgrid/mail";
// import dotenv from "dotenv";
// dotenv.config();

// const { SENDGRID_API_KEY } = process.env;

// sendgrid.setApiKey(SENDGRID_API_KEY);

// const sendEmail = async (data) => {
//   const email = {
//     ...data,
//     from: "alinachumachenko1987@gmail.com",
//   };
//   await sendgrid.send(email);
//   return true;
// };

// export default sendEmail;

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const { META_FROM, META_PASS } = process.env;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_FROM,
    pass: META_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: META_FROM };
  return transport.sendMail(email);
};

export default sendEmail;
