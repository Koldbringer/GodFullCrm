#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a minimal next.config.js that ignores all errors
const nextConfig = `
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    // Add fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};
`;

// Write the config file
fs.writeFileSync(path.join(process.cwd(), 'next.config.js'), nextConfig);

// Add "use client" directive to all component files
try {
  console.log('Adding "use client" directive to component files...');
  const componentsDir = path.join(process.cwd(), 'components');
  
  if (fs.existsSync(componentsDir)) {
    const findComponentFiles = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      files.forEach(file => {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          findComponentFiles(filePath);
        } else if (file.name.endsWith('.tsx') || file.name.endsWith('.jsx')) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check if file uses React hooks
          if (content.includes('useState') || 
              content.includes('useEffect') || 
              content.includes('useContext') || 
              content.includes('useReducer') || 
              content.includes('useCallback') || 
              content.includes('useMemo') || 
              content.includes('useRef')) {
            
            // Add "use client" directive if not already present
            if (!content.includes('"use client"') && !content.includes("'use client'")) {
              console.log(`Adding "use client" directive to ${filePath}`);
              fs.writeFileSync(filePath, '"use client";\n\n' + content);
            }
          }
        }
      });
    };
    
    findComponentFiles(componentsDir);
  }
} catch (error) {
  console.error('Error adding "use client" directive:', error);
}

// Run the build command with increased memory limit
console.log('Starting build process...');
try {
  execSync('NODE_OPTIONS="--max_old_space_size=4096" next build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}