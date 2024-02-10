import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { activationTemplate } from "./activiationTemplate";
import { resetPasswordTemplate } from "./resetPasswordTemplate";

export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  //setting smtp server with my gmail account
  //go to google manage account/settings/2step verification
  //create app password
  const { SMTP_EMAIL, SMTP_GMAIL_PASS } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_GMAIL_PASS,
    },
  });

  try {
    //const testResult = await transport.verify();
    //console.log("result", testResult);

    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log("send result", { sendResult });
  } catch (error) {
    console.log(error);
  }
};

export const compileActivationMailTemplate = (name: string, url: string) => {
  const template = handlebars.compile(activationTemplate);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};

export const compileForgotPasswordMailTemplate = (
  name: string,
  url: string
) => {
  const template = handlebars.compile(resetPasswordTemplate);
  const htmlBody = template({
    name,
    url,
  });

  return htmlBody;
};
