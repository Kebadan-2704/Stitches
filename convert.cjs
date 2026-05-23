const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await convertDir(fullPath);
    } else if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const ext = path.extname(file);
      const webpPath = fullPath.replace(ext, '.webp');
      console.log(`Converting ${fullPath}...`);
      await sharp(fullPath).webp({ quality: 80 }).toFile(webpPath);
      fs.unlinkSync(fullPath);
    }
  }
}

const publicDir = path.join(__dirname, 'public');
convertDir(publicDir).then(() => console.log('Done')).catch(console.error);
