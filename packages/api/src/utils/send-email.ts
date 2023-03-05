import * as nodemailer from "nodemailer";
import { logger } from "@acme/logger";

interface Options {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: Options) {
  if (process.env.ENABLE_MAIL !== "1") return;

  logger.debug(`===> Sending email to: ${to}`);

  const isEthereal = process.env.IS_ETHEREAL_EMAIL;

  let host = "smtp-relay.sendinblue.com";
  let user = process.env.SEND_IN_BLUE_USER;
  let pass = process.env.SEND_IN_BLUE_KEY;

  if (isEthereal) {
    const testAccount = await nodemailer.createTestAccount();
    host = "smtp.ethereal.email";
    user = testAccount.user;
    pass = testAccount.pass;
  }

  // create reusable transporter object using SendInBlue for SMTP
  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Nyaman Tech" <admin@nyamantech.com>',
    to: Array.isArray(to) ? to : [to], // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  if (isEthereal) {
    logger.debug(`===> Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  // TODO: save to email audit
  return info;
}
