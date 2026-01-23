import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import './FileUpload.css'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['image/jpeg', 'image/png'],
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > maxSize) {
        alert(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
        return
      }
      if (!acceptedTypes.includes(file.type)) {
        alert(`Unsupported file type: ${file.type}. Please upload ${acceptedTypes.join(' or ')} files.`)
        return
      }
      onFileSelect(file)
    }
  }, [onFileSelect, acceptedTypes, maxSize])

  return (
    <div className="file-upload">
      <div className="file-upload__content">
        <div className="file-upload__icon">📁</div>
        <h3 className="file-upload__title">Upload Your Image</h3>
        <p className="file-upload__description">
          Drag and drop your JPG or PNG file here, or click to browse
        </p>
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          className="file-upload__input"
          id="file-input"
        />
        <label htmlFor="file-input" className="file-upload__button">
          Choose File
        </label>
        <p className="file-upload__note">
          Maximum file size: {maxSize / 1024 / 1024}MB
        </p>
      </div>
    </div>
  )
}

FileUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  maxSize: PropTypes.number
}

export default FileUpload