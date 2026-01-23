// File validation utilities

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateFile = (file: File): ValidationResult => {
  // Check if file exists
  if (!file) {
    return { isValid: false, error: 'No file provided' }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
    }
  }

  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file type: ${file.type}. Please upload JPG or PNG files.`
    }
  }

  return { isValid: true }
}

export const validateFileType = (file: File, targetFormat: string): ValidationResult => {
  // Check if trying to convert to same format
  if ((file.type === 'image/jpeg' && targetFormat === 'jpg') ||
      (file.type === 'image/png' && targetFormat === 'png')) {
    return {
      isValid: false,
      error: `File is already in ${targetFormat.toUpperCase()} format`
    }
  }

  return { isValid: true }
}

export const getFileExtension = (fileType: string): string => {
  switch (fileType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    default:
      return 'unknown'
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}