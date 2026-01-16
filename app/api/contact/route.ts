import { type NextRequest, NextResponse } from "next/server"
import { getSupabase, isDatabaseConfigured } from "@/lib/db"
import { getResend, EMAIL_CONFIG } from "@/lib/resend"
import { logger } from "@/lib/logger"

// Contact form submission handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { firstName, lastName, email, phone, subject, message, marketingConsent } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Please fill in all required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 })
    }

    if (isDatabaseConfigured()) {
      try {
        const supabase = getSupabase()
        const { error } = await supabase.from("contact_messages").insert({
          id: crypto.randomUUID(),
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          subject: subject,
          message: message,
          created_at: new Date().toISOString(),
          status: "new",
        })

        // Log but don't fail if table doesn't exist
        if (error) {
          logger.debug("Contact database insert skipped", { error: error.message })
        }
      } catch (dbError) {
        // If database operations fail, continue with email
        logger.warn("Contact database not available, continuing with email only")
      }
    }

    const resend = getResend()

    // Send notification email to info@autolenis.com via Resend
    try {
      const notificationResponse = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.notificationRecipient,
        replyTo: email,
        subject: `[Contact Form] ${subject} - from ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2D1B69; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #2D1B69; margin-top: 0;">Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Marketing Consent:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${marketingConsent ? "Yes" : "No"}</td>
                </tr>
              </table>
              
              <h2 style="color: #2D1B69; margin-top: 30px;">Message</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                This message was sent from the AutoLenis contact form at ${new Date().toLocaleString()}.
              </p>
            </div>
          </div>
        `,
      })

      if (notificationResponse.error) {
        logger.error("Contact notification email failed", { error: notificationResponse.error })
        return NextResponse.json(
          { success: false, error: "Failed to send message. Please try again later." },
          { status: 500 },
        )
      }
    } catch (emailError: any) {
      logger.error("Contact email send error", { error: emailError.message })
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again later." },
        { status: 500 },
      )
    }

    // Send confirmation email to the submitter (non-blocking)
    try {
      await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email,
        subject: "We received your message - AutoLenis",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2D1B69; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Thank You for Contacting Us</h1>
            </div>
            <div style="padding: 30px;">
              <p>Hi ${firstName},</p>
              <p>Thank you for reaching out to AutoLenis. We have received your message and our team will get back to you within 24 hours.</p>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2D1B69;">Your Message Summary</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p style="margin-bottom: 0;"><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; color: #666;">${message}</p>
              </div>
              
              <p>In the meantime, feel free to explore our platform:</p>
              <ul>
                <li><a href="https://autolenis.com/how-it-works">Learn how AutoLenis works</a></li>
                <li><a href="https://autolenis.com/about">About AutoLenis</a></li>
                <li><a href="https://autolenis.com/buyer/onboarding">Start your application</a></li>
              </ul>
              
              <p>Best regards,<br>The AutoLenis Team</p>
            </div>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0;">AutoLenis - Your Vehicle Purchase Concierge</p>
              <p style="margin: 5px 0 0 0;">Reply to this email: <a href="mailto:info@autolenis.com">info@autolenis.com</a></p>
            </div>
          </div>
        `,
      })
    } catch {
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error: any) {
    logger.error("Contact API error", { error: error.message })
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}
