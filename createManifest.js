const glob = require('glob').sync;
const size = require('image-size');
const fs = require('fs');

// Icons glob
const allIcons = glob('build/img/icons/*.png');

// Prepare img arr
const parsedIcons = allIcons.reduce((arr, img) => {
  arr.push(readImage(img));
  return arr;
}, []);

// Create entry in manifest file
function readImage(img) {
  const dimensions = size(img);
  return {
    src: img.replace('build', ''),
    sizes: `${dimensions.width}x${dimensions.height}`,
    type: `image/${dimensions.type}`,
  };
}

// Manifest
const manifest = {
  name: 'Algolia Community',
  short_name: 'Algolia', // eslint-disable-line camelcase
  theme_color: '#00aeff', // eslint-disable-line camelcase
  background_color: '#f7f7ff', // eslint-disable-line camelcase
  display: 'standalone',
  start_url: '/', // eslint-disable-line camelcase
  icons: parsedIcons,
};

// Write to dir
fs.writeFileSync('build/manifest.json', JSON.stringify(manifest));
