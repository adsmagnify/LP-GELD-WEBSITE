import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  firstRegisterError,
  validateRegisterFields,
} from "@/app/lib/registerValidation";

const CONTACT_EMAIL = "Support@geldwealth.com";

interface RegisterRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  interestedTopic?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: RegisterRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const phone = body.phone?.trim() || "";
  const interestedTopic = body.interestedTopic?.trim().slice(0, 200) || "";

  const fieldErrors = validateRegisterFields({ name, email, phone });
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: firstRegisterError(fieldErrors), fieldErrors },
      { status: 400 }
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.error("Register form misconfigured: missing SMTP environment variables.");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 503 }
    );
  }

  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const recipient = process.env.CONTACT_EMAIL?.trim() || CONTACT_EMAIL;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: {
        name: `${name} via GELD Webinar LP`,
        address: smtpUser,
      },
      to: recipient,
      replyTo: {
        name,
        address: email,
      },
      envelope: {
        from: smtpUser,
        to: recipient,
      },
      subject: interestedTopic
        ? `${interestedTopic} | Webinar interest from ${name}`
        : `Webinar registration from ${name}`,
      text: [
        interestedTopic
          ? `New interest in webinar: ${interestedTopic}`
          : "New webinar registration from the landing page.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Contact Number: ${phone}`,
        interestedTopic ? `Webinar: ${interestedTopic}` : null,
        `Source: webinar-landing`,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <p><strong>${
          interestedTopic
            ? `New interest: ${escapeHtml(interestedTopic)}`
            : "New webinar registration"
        }</strong> (landing page)</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Contact Number:</strong> ${escapeHtml(phone)}</p>
        ${
          interestedTopic
            ? `<p><strong>Webinar:</strong> ${escapeHtml(interestedTopic)}</p>`
            : ""
        }
        <p><strong>Source:</strong> webinar-landing</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send webinar registration email:", error);
    return NextResponse.json(
      { error: "Failed to send registration. Please try again later." },
      { status: 500 }
    );
  }
}
