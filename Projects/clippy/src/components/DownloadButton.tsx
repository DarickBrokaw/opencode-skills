import React from 'react'
import PropTypes from 'prop-types'
import './DownloadButton.css'

interface DownloadButtonProps {
  file: Blob
  originalFileName: string
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  file,
  originalFileName
}) => {
  const handleDownload = () => {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url

    // Generate filename with extension
    const baseName = originalFileName.replace(/\.[^/.]+$/, "")
    const extension = file.type === 'application/pdf' ? '.pdf' :
                     file.type === 'image/png' ? '.png' : '.jpg'
    a.download = `${baseName}_converted${extension}`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="download-section">
      <h3 className="download-section__title">Conversion Complete!</h3>
      <p className="download-section__info">
        File size: {(file.size / 1024).toFixed(1)} KB
      </p>
      <button
        onClick={handleDownload}
        className="download-button"
      >
        📥 Download Converted File
      </button>
    </div>
  )
}

DownloadButton.propTypes = {
  file: PropTypes.instanceOf(Blob).isRequired,
  originalFileName: PropTypes.string.isRequired
}

export default DownloadButton