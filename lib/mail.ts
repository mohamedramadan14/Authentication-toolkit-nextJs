import {Resend} from "resend";

const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/confirm?token=${token}`;
    await resendClient.emails.send({
        from: process.env.FROM_EMAIL_TEST || "onboarding@resend.dev",
        to: email,
        subject: "Please confirm your account",
        html: `<p>Click<a href="${confirmLink}">here</a>to confirm your account.</p>`,
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
    await resendClient.emails.send({
        from: process.env.FROM_EMAIL_TEST || "onboarding@resend.dev",
        to: email,
        subject: "Reset your account password",
        html: `<p>Click <a href="${resetLink}"> here </a> to reset your account password. </p>`,
    })
}

export const sendTwoCodeEmail = async (email: string, code: string) => {
    await resendClient.emails.send({
        from: process.env.FROM_EMAIL_TEST || "onboarding@resend.dev",
        to: email,
        subject: "Two factor authentication code",
        html: `<p>Here's your one-time Two factor authentication code : ${code}</p>`,
    })
}