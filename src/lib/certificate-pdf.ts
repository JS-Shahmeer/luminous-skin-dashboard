import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const GOLD = rgb(0.776, 0.659, 0.459); // #C6A875
const INK = rgb(0.051, 0.051, 0.051); // #0D0D0D
const BEIGE = rgb(0.722, 0.694, 0.655); // #B8B1A7

export async function generateCertificatePdf({
  studentName,
  courseTitle,
  issuedOn,
  credentialId,
}: {
  studentName: string;
  courseTitle: string;
  issuedOn: string;
  credentialId: string;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.973, 0.969, 0.961) });
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: GOLD,
    borderWidth: 2,
  });
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: GOLD,
    borderWidth: 0.75,
  });

  const centerText = (text: string, y: number, font: typeof serif, size: number, color = INK) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color });
  };

  centerText("LUMINOUS SKN ACADEMY", height - 100, sansBold, 14, GOLD);
  centerText("Certificate of Completion", height - 150, serifItalic, 20, BEIGE);

  centerText("This certifies that", height - 230, sans, 13, BEIGE);
  centerText(studentName, height - 275, serif, 34, INK);

  centerText("has successfully completed", height - 320, sans, 13, BEIGE);
  centerText(courseTitle, height - 360, serif, 24, GOLD);

  centerText(`Issued ${issuedOn}  ·  Credential ID: ${credentialId}`, 110, sans, 11, BEIGE);
  centerText("Luminous SKN Academy — Sydney, Australia", 85, sans, 10, BEIGE);

  return doc.save();
}
