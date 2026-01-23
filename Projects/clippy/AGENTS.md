# AGENTS.md - File Conversion Website Project

## Project Overview
This is a web-based file conversion tool that allows users to upload .jpg/.png files and convert them to .pdf, .png, or .jpg formats. The application provides a simple, intuitive interface for file type conversion.

## Build, Test, and Development Commands

### Package Management
```bash
npm install          # Install dependencies
npm install <package> # Add new dependency
npm update           # Update dependencies
```

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:unit    # Run unit tests only
npm run test:e2e     # Run end-to-end tests
```

### Linting and Formatting
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

### Single Test Commands
```bash
# Run a specific test file
npm test -- conversion.test.js
npm test -- --testNamePattern="should convert jpg to pdf"

# Run tests for a specific directory
npm test -- tests/unit/
npm test -- tests/e2e/

# When npm fails, use manual testing
# Open test-suite.html in browser for automated checks
# Run ./run-tests.sh for comprehensive verification
```

### Fallback Development Commands
```bash
# When npm/Node.js tools fail:
python3 -m http.server 3000  # Simple HTTP server
yarn install                 # Alternative package manager
# Create standalone HTML files without build tools
```

## Project Structure
```
clippy/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx
│   │   ├── Converter.jsx
│   │   ├── ProgressBar.jsx
│   │   └── DownloadButton.jsx
│   ├── services/
│   │   ├── fileConverter.js
│   │   └── api.js
│   ├── utils/
│   │   ├── fileValidation.js
│   │   └── imageProcessing.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── components/
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   ├── unit/
│   └── e2e/
├── package.json
├── vite.config.js
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
└── README.md
```

## Code Style Guidelines

### General Principles
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use descriptive variable and function names
- Write self-documenting code

### Import Organization
```javascript
// 1. React and core libraries
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// 2. Third-party libraries
import axios from 'axios';
import { Button, Input } from 'antd';

// 3. Internal modules (absolute imports with @)
import { FileUpload } from '@/components';
import { convertFile } from '@/services';
import { validateFileType } from '@/utils';

// 4. Relative imports
import './styles.css';
```

### Component Structure
```javascript
// FileUpload.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export const FileUpload = ({ onFileSelect, acceptedTypes }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    // Implementation
  }, [onFileSelect]);

  return (
    <div className="file-upload">
      {/* JSX content */}
    </div>
  );
};

FileUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string)
};

export default FileUpload;
```

### Naming Conventions
- **Components**: PascalCase (FileUpload, ConverterButton)
- **Functions**: camelCase (handleFileUpload, validateImageType)
- **Variables**: camelCase (selectedFile, conversionProgress)
- **Constants**: UPPER_SNAKE_CASE (MAX_FILE_SIZE, SUPPORTED_FORMATS)
- **Files**: kebab-case for utilities (file-validation.js), PascalCase for components (FileUpload.jsx)

### TypeScript Guidelines
```typescript
// Define interfaces for props and data structures
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  maxSize?: number;
}

interface ConversionResult {
  success: boolean;
  convertedFile?: Blob;
  error?: string;
}

// Use generic types where appropriate
const useFileConversion = <T extends File>(): ConversionState<T> => {
  // Hook implementation
};
```

### Error Handling
```javascript
// Use try-catch for async operations
const convertFile = async (file, targetFormat) => {
  try {
    const result = await fileConverter.convert(file, targetFormat);
    return { success: true, data: result };
  } catch (error) {
    console.error('File conversion failed:', error);
    return { 
      success: false, 
      error: error.message || 'Conversion failed' 
    };
  }
};

// Validate inputs early
const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }
  
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
};
```

### State Management
```javascript
// Use useState for local component state
const [conversionState, setConversionState] = useState({
  isConverting: false,
  progress: 0,
  error: null
});

// Use useReducer for complex state logic
const fileReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, selectedFile: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
```

### CSS and Styling
```css
/* Use BEM methodology */
.file-upload {
  border: 2px dashed #ccc;
  border-radius: 8px;
}

.file-upload--dragging {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.file-upload__input {
  display: none;
}

.file-upload__label {
  padding: 20px;
  cursor: pointer;
}

/* Use CSS custom properties for theming */
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --border-radius: 8px;
}
```

### API Integration
```javascript
// Create dedicated API service functions
export const fileConverterAPI = {
  convert: async (file, targetFormat) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    
    return axios.post('/api/convert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    });
  },
  
  getSupportedFormats: async () => {
    return axios.get('/api/formats');
  }
};
```

## Testing Guidelines

### Unit Tests
```javascript
// Use Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '@/components';

describe('FileUpload', () => {
  it('should accept valid file types', () => {
    const onFileSelect = jest.fn();
    render(<FileUpload onFileSelect={onFileSelect} />);
    
    const fileInput = screen.getByLabelText(/upload file/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });
});
```

### E2E Tests
```javascript
// Use Playwright or Cypress
import { test, expect } from '@playwright/test';

test('should convert jpg to pdf', async ({ page }) => {
  await page.goto('/');
  
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');
  await page.selectOption('#targetFormat', 'pdf');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.download-button')).toBeVisible();
});
```

## Performance Guidelines
- Lazy load components using React.lazy()
- Implement file size limits and validation
- Use Web Workers for large file processing
- Optimize images before conversion
- Add loading states and progress indicators
- Implement proper error boundaries

## Security Considerations
- Validate all file uploads on client and server
- Sanitize file names
- Implement rate limiting for API endpoints
- Use secure file storage with proper access controls
- Never store sensitive file data in localStorage

## Platform-Specific Considerations

### Windows Development
- **esbuild Issues**: May fail with permission errors - use yarn or standalone HTML
- **Path Separators**: Use forward slashes or path.join() for cross-platform compatibility
- **Process Management**: Use taskkill for port conflicts, check with netstat
- **Antivirus**: May block development tools - whitelist or run as admin

### Build Tool Failures
- **Fallback Strategy**: Always have simple alternatives (Python server, CDN libraries)
- **Standalone HTML**: For simple apps, skip complex tooling entirely
- **Manual Testing**: Validate functionality manually when automation fails
- **Error Recovery**: Design with graceful degradation and clear error messages

### Port Management
```bash
# Check port usage
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # macOS/Linux

# Kill processes on port
taskkill /PID <PID> /F         # Windows
kill -9 $(lsof -ti:3000)       # macOS/Linux
```

## Git Workflow
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- Create feature branches from main
- Use pull requests for code review
- Keep commits small and focused
- Write descriptive commit messages