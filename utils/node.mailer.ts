import nodemailer, { Transporter } from "nodemailer";

interface MailOptions {
  sendTo: string;
  subject: string;
  html: string;
}

// Create the transporter with proper type annotations
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: process.env.NODE_ENV === "production", // Use TLS in production
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

// Send mail function with type safety
export const sendMail = async ({
  sendTo,
  subject,
  html,
}: MailOptions): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"PayGuard" <${process.env.AUTH_EMAIL}>`, // Dynamically use AUTH_EMAIL
      to: sendTo,
      subject: subject,
      html: html,
    });
    return true;
  } catch (error) {
    console.error("Error in sending mail:", error);
    return false;
  }
};
