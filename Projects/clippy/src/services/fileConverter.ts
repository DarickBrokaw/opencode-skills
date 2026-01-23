// File conversion service using Canvas API and jsPDF

import jsPDF from 'jspdf'

export const convertImageToImage = (
  imageFile: File,
  targetFormat: string,
  quality: number = 0.9
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx?.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert image'))
          }
        },
        `image/${targetFormat}`,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(imageFile)
  })
}

export const convertImageToPdf = (imageFile: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate PDF dimensions (A4: 210 x 297 mm at 72 DPI)
      const pdfWidth = 210
      const pdfHeight = 297
      const imgAspectRatio = img.width / img.height
      const pdfAspectRatio = pdfWidth / pdfHeight

      let drawWidth = pdfWidth
      let drawHeight = pdfHeight

      if (imgAspectRatio > pdfAspectRatio) {
        drawHeight = pdfWidth / imgAspectRatio
      } else {
        drawWidth = pdfHeight * imgAspectRatio
      }

      // Center the image on the page
      const xOffset = (pdfWidth - drawWidth) / 2
      const yOffset = (pdfHeight - drawHeight) / 2

      canvas.width = pdfWidth * 4 // Higher resolution for better quality
      canvas.height = pdfHeight * 4

      ctx?.drawImage(img, xOffset * 4, yOffset * 4, drawWidth * 4, drawHeight * 4)

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)

      // Convert PDF to Blob
      const pdfBlob = pdf.output('blob')
      resolve(pdfBlob)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for PDF conversion'))
    }

    img.src = URL.createObjectURL(imageFile)
  })
}

export const convertFile = async (
  file: File,
  targetFormat: string,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  try {
    onProgress?.(20)

    if (targetFormat === 'pdf') {
      onProgress?.(50)
      const result = await convertImageToPdf(file)
      onProgress?.(90)
      return result
    } else if (targetFormat === 'png' || targetFormat === 'jpg') {
      onProgress?.(50)
      const result = await convertImageToImage(file, targetFormat)
      onProgress?.(90)
      return result
    } else {
      throw new Error(`Unsupported target format: ${targetFormat}`)
    }
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}