# Clippy - File Conversion Tool

A web-based file conversion tool that allows users to upload JPG/PNG images and convert them to different formats (PDF, PNG, JPG).

## Features

- **File Upload**: Drag-and-drop or click to upload JPG/PNG images
- **Format Conversion**:
  - JPG ↔ PNG (image format conversion)
  - JPG/PNG → PDF (document conversion)
- **Progress Tracking**: Real-time conversion progress indicator
- **File Validation**: Size limits (10MB) and format validation
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages and recovery options

## Technical Implementation

### Core Technologies
- **HTML5 Canvas API**: For image processing and format conversion
- **jsPDF Library**: For PDF generation from images
- **Vanilla JavaScript**: No framework dependencies for core functionality
- **CSS3**: Modern styling with responsive design

### Architecture
- **Client-side Processing**: All conversions happen in the browser
- **No Server Required**: Standalone HTML file with embedded functionality
- **File API**: Modern browser APIs for file handling
- **Blob API**: For generating downloadable files

### Conversion Logic

#### Image to Image Conversion
```javascript
// Uses Canvas API to redraw image in target format
canvas.toBlob(blob => { /* download blob */ }, `image/${targetFormat}`, quality)
```

#### Image to PDF Conversion
```javascript
// Uses jsPDF to create PDF with centered image
const pdf = new jsPDF()
pdf.addImage(canvasImage, 'JPEG', x, y, width, height)
```

## Usage

1. Open `index.html` in a modern web browser
2. Click "Choose File" or drag and drop a JPG/PNG image
3. Select your desired output format (PDF, PNG, or JPG)
4. Click "Convert File" to start the conversion
5. Download the converted file when complete

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Limitations

- **Maximum Size**: 10MB per file
- **Supported Input**: JPG, PNG images only
- **Output Formats**: PDF, PNG, JPG

## Development

The project is built as a standalone HTML file for simplicity and portability. To modify the functionality:

1. Edit the inline JavaScript in `index.html`
2. Modify CSS styles for visual changes
3. Test in multiple browsers for compatibility

## Future Enhancements

- Batch file processing
- Image quality/compression settings
- Additional output formats (WebP, AVIF)
- Drag-and-drop multiple files
- Image resizing/cropping options

## License

This project is open source and available under the MIT License.