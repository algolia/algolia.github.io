// Glob
const glob = require('glob').sync;
const size = require('image-size');
const fs = require('fs');

const allIcons = glob('build/img/icons/*.png');

console.log(allIcons);

const parsedIcons = allIcons.reduce((arr,img) => {
  console.log(img);
  arr.push(readImage(img));
  return arr;
},[])

const manifest = {
 "name": "Algolia Community",
 "short_name": "Algolia",
 "theme_color": "#00aeff",
 "background_color": "#f7f7ff",
 "display": "standalone",
 "start_url": "/",
 "icons": parsedIcons
}

console.log(manifest);

fs.writeFileSync('build/manifest.json',JSON.stringify(manifest))

function readImage(img){
  const dimensions = size(img);
  return {
    "src": img.replace('build',''),
    "sizes": `${dimensions.width}x${dimensions.height}`,
    "type": `image\/${dimensions.type}`
  }
}