const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('src/pages/admin', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    content = content.replace(/<table className="([^"]*)"/g, function(match, classes) {
      if (!classes.includes('whitespace-nowrap')) {
        return '<table className="' + classes + ' whitespace-nowrap"';
      }
      return match;
    });

    content = content.replace(/<Table size="small">/g, '<Table size="small" className="whitespace-nowrap">');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Updated: ' + filePath);
    }
  }
});
