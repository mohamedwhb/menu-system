import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'

export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, receiptData } = req.body
  if (!email || !receiptData) {
    return res.status(400).json({ message: 'E-Mail oder Belegdaten fehlen' })
  }

  // PDF generieren
  const doc = new PDFDocument()
  let buffers: Buffer[] = []
  doc.on('data', buffers.push.bind(buffers))
  doc.on('end', async () => {
    const pdfBuffer = Buffer.concat(buffers)

    // SMTP-Transport konfigurieren (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    try {
      await transporter.sendMail({
        from: `"Quittung" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Ihre Quittung',
        text: 'Im Anhang finden Sie Ihre Quittung als PDF.',
        attachments: [
          {
            filename: 'quittung.pdf',
            content: pdfBuffer,
          },
        ],
      })
      res.status(200).json({ message: 'E-Mail erfolgreich gesendet' })
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Senden der E-Mail', error })
    }
  })

  // PDF-Inhalt (einfaches Beispiel)
  doc.fontSize(18).text('Quittung', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).text(`Firma: ${receiptData.companyName}`)
  doc.text(`Adresse: ${receiptData.companyAddress}`)
  doc.text(`Datum: ${receiptData.date} ${receiptData.time}`)
  doc.text(`Rechnungsnummer: ${receiptData.receiptNumber}`)
  doc.moveDown()
  doc.text('Positionen:')
  receiptData.items.forEach((item: any) => {
    doc.text(`- ${item.quantity}x ${item.description} à ${item.unitPrice} EUR = ${item.totalPrice} EUR`)
  })
  doc.moveDown()
  doc.text(`Gesamt: ${receiptData.total} EUR`)
  doc.end()
} 