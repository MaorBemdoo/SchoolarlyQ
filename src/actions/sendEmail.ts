/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import initLogger from "@/config/logger";
import ResponseHandler from "@/utils/ResponseHandler";
import nodemailer from "nodemailer";

export async function sendEmail(props: any) {
  const logger = await initLogger();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const res = await transporter.sendMail({
      from: props.from || process.env.SMTP_USER!,
      to: props.to || process.env.SMTP_USER!,
      subject: props.subject || "No Subject From SchoolarlyQ",
      text: props.text,
      html: props.html,
    });

    logger.info(res, "Email sent successfully");
    return ResponseHandler("success", "Email sent successfully");
  } catch (error: any) {
    logger.error(error, "Error sending email");
    return ResponseHandler("failed", error.message || "Error sending message");
  }
}
