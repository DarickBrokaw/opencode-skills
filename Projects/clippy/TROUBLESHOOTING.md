# Troubleshooting Guide

## Known Issues and Solutions

### npm install Failures on Windows

**Issue**: `npm install` fails with esbuild permission errors like:
```
Error: spawnSync C:\Users\...\esbuild.exe EPERM
```

**Root Cause**: esbuild binary has permission issues on Windows systems.

**Solutions**:
1. **Use yarn instead**: `yarn install` often works better on Windows
2. **Clean install**: Delete `node_modules` and `package-lock.json`, then retry
3. **Use standalone HTML**: For simple projects, create HTML files without build tools
4. **Check antivirus**: Windows Defender may block esbuild binaries

### HTTP Server Port Conflicts

**Issue**: Port 3000 already in use when starting development server.

**Symptoms**:
- Server fails to start
- "Port already in use" errors
- curl returns connection refused

**Solutions**:
1. **Kill existing processes**:
   ```bash
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # On Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

2. **Use different port**: `python3 -m http.server 8080`
3. **Check what's using the port**: `netstat -an | grep :3000`

### Node.js Build Tool Failures

**Issue**: Vite, Webpack, or other build tools fail to start.

**Solutions**:
1. **Fallback to simple HTTP server**: Use Python's built-in server for static files
2. **Check Node.js version**: Ensure Node.js 16+ is installed
3. **Clear cache**: `npm cache clean --force`
4. **Use CDN libraries**: For simple apps, load dependencies from CDN instead of bundling

### File Permission Issues

**Issue**: "Access denied" or "Permission denied" errors.

**Solutions**:
1. **Run as administrator**: On Windows, run terminal as admin
2. **Check antivirus**: May be blocking file operations
3. **Use different directories**: Avoid system directories
4. **Check file ownership**: Ensure user has write permissions

### Browser Testing Issues

**Issue**: Automated browser tests fail or can't launch Chrome.

**Solutions**:
1. **Manual testing first**: Test manually in browser before automation
2. **Check Chrome installation**: Ensure Chrome is installed and accessible
3. **Use different browsers**: Try Firefox or Edge if Chrome fails
4. **Check headless mode**: Some environments require `--no-sandbox` flag

## Development Best Practices

### When Build Tools Fail
1. **Start simple**: Create HTML files directly without complex tooling
2. **Use CDN libraries**: Load dependencies from CDN (jsDelivr, unpkg)
3. **Fallback servers**: Python HTTP server works reliably across platforms
4. **Manual testing**: Test functionality manually before automation

### Cross-Platform Development
1. **Test on target platform**: Windows, macOS, and Linux behave differently
2. **Use platform-specific commands**: Different commands for Windows vs Unix
3. **Handle path separators**: Use `path.join()` or forward slashes
4. **Check file permissions**: Different permission systems across platforms

### Error Recovery
1. **Graceful degradation**: App should work even if some features fail
2. **Clear error messages**: Tell users what went wrong and how to fix it
3. **Fallback options**: Provide alternatives when primary approach fails
4. **Logging**: Log errors for debugging without exposing sensitive info

## Quick Fixes

### Can't install dependencies?
```bash
# Try yarn instead
yarn install

# Or use simple HTTP server
python3 -m http.server 3000
```

### Port already in use?
```bash
# Kill process on port 3000
# Windows
taskkill /PID $(netstat -ano | findstr :3000 | awk '{print $5}') /F
# Linux/Mac
kill -9 $(lsof -ti:3000)
```

### Build tools failing?
- Create standalone HTML files
- Use CDN for libraries
- Test manually in browser
- Skip complex tooling for simple apps

## Prevention

1. **Test early**: Run builds on clean systems regularly
2. **Document workarounds**: Keep track of platform-specific issues
3. **Use containers**: Docker can isolate environment issues
4. **Version pin**: Lock dependency versions to prevent breakage
5. **Monitor CI/CD**: Catch issues in automated environments

## Getting Help

If issues persist:
1. Check this troubleshooting guide
2. Search for error messages online
3. Try on different platforms/machines
4. Consider simpler approaches for proof-of-concept projects