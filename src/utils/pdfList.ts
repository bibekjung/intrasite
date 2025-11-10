/**
 * PDF List Utility
 *
 * This file maintains a list of PDFs in the public folder.
 * When you add a new PDF to the public folder, add it to the pdfList array below.
 *
 * The path should be relative to the public folder (e.g., '/filename.pdf')
 */

export interface PdfFile {
  name: string;
  path: string;
  displayName: string;
}

/**
 * List of PDFs in the public folder
 * Add new PDFs here when you add them to the public folder
 */
export const pdfList: PdfFile[] = [
  {
    name: 'SCM Technical Specifications v1.0.0.pdf',
    path: '/SCM Technical Specifications v1.0.0.pdf',
    displayName: 'SCM Technical Specifications v1.0.0',
  },
];

/**
 * Discovers and verifies PDFs from the list
 * Returns only PDFs that actually exist in the public folder
 */
export async function discoverPdfs(): Promise<PdfFile[]> {
  const verifiedPdfs: PdfFile[] = [];

  for (const pdf of pdfList) {
    try {
      const response = await fetch(pdf.path, { method: 'HEAD' });
      if (response.ok) {
        verifiedPdfs.push(pdf);
      }
    } catch {
      // PDF might not exist, skip it
    }
  }

  return verifiedPdfs;
}
