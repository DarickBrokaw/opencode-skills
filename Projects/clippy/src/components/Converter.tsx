import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { convertFile } from '@/services/fileConverter'
import './Converter.css'

interface ConverterProps {
  file: File
  onConversionStart: () => void
  onConversionComplete: (result: Blob) => void
  onConversionError: (error: string) => void
  onProgressUpdate: (progress: number) => void
}

export const Converter: React.FC<ConverterProps> = ({
  file,
  onConversionStart,
  onConversionComplete,
  onConversionError,
  onProgressUpdate
}) => {
  const [targetFormat, setTargetFormat] = useState<string>('pdf')

  const handleConvert = async () => {
    try {
      onConversionStart()
      onProgressUpdate(10)

      const result = await convertFile(file, targetFormat, onProgressUpdate)
      onProgressUpdate(100)
      onConversionComplete(result)
    } catch (error) {
      onConversionError(error instanceof Error ? error.message : 'Conversion failed')
    }
  }

  const getSupportedFormats = () => {
    const formats = ['pdf', 'png', 'jpg']
    return formats.filter(format => {
      if (file.type === 'image/jpeg' && format === 'jpg') return false
      if (file.type === 'image/png' && format === 'png') return false
      return true
    })
  }

  return (
    <div className="converter">
      <h3 className="converter__title">Choose Output Format</h3>

      <div className="converter__options">
        {getSupportedFormats().map((format) => (
          <label key={format} className="converter__option">
            <input
              type="radio"
              name="format"
              value={format}
              checked={targetFormat === format}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="converter__radio"
            />
            <span className="converter__label">
              {format.toUpperCase()}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={handleConvert}
        className="converter__button"
        disabled={!targetFormat}
      >
        Convert File
      </button>
    </div>
  )
}

Converter.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
  onConversionStart: PropTypes.func.isRequired,
  onConversionComplete: PropTypes.func.isRequired,
  onConversionError: PropTypes.func.isRequired,
  onProgressUpdate: PropTypes.func.isRequired
}

export default Converter