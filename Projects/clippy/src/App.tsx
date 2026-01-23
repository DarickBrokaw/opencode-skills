import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { Converter } from '@/components/Converter'
import { ProgressBar } from '@/components/ProgressBar'
import { DownloadButton } from '@/components/DownloadButton'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setConvertedFile(null)
    setError(null)
  }

  const handleConversionStart = () => {
    setIsConverting(true)
    setConversionProgress(0)
    setError(null)
  }

  const handleConversionComplete = (result: Blob) => {
    setConvertedFile(result)
    setIsConverting(false)
    setConversionProgress(100)
  }

  const handleConversionError = (errorMessage: string) => {
    setError(errorMessage)
    setIsConverting(false)
    setConversionProgress(0)
  }

  const handleProgressUpdate = (progress: number) => {
    setConversionProgress(progress)
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Clippy - File Conversion Tool</h1>
        <p>Convert your images between JPG, PNG, and PDF formats</p>
      </header>

      <main className="app__main">
        <div className="container">
          {!selectedFile ? (
            <FileUpload onFileSelect={handleFileSelect} />
          ) : (
            <div className="conversion-section">
              <div className="file-info">
                <p>Selected file: <strong>{selectedFile.name}</strong></p>
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={() => setError(null)}>Dismiss</button>
                </div>
              )}

              <Converter
                file={selectedFile}
                onConversionStart={handleConversionStart}
                onConversionComplete={handleConversionComplete}
                onConversionError={handleConversionError}
                onProgressUpdate={handleProgressUpdate}
              />

              {isConverting && (
                <ProgressBar progress={conversionProgress} />
              )}

              {convertedFile && (
                <DownloadButton
                  file={convertedFile}
                  originalFileName={selectedFile.name}
                />
              )}

              <button
                className="back-button"
                onClick={() => {
                  setSelectedFile(null)
                  setConvertedFile(null)
                  setError(null)
                }}
              >
                Choose Different File
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App