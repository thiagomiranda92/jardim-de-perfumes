// Gera a versão leve (`-640.webp`) de cada foto em public/images/products que ainda não tem uma.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const pasta = path.join(__dirname, '..', 'public', 'images', 'products');

(async () => {
  const fotos = fs.readdirSync(pasta).filter(nome => nome.endsWith('.jpg'));
  let criadas = 0;
  for (const nome of fotos) {
    const destino = path.join(pasta, nome.replace(/\.jpg$/, '-640.webp'));
    if (fs.existsSync(destino)) continue;
    await sharp(path.join(pasta, nome)).resize({ width: 640 }).webp({ quality: 74 }).toFile(destino);
    criadas += 1;
    console.log(`Criada: ${path.basename(destino)}`);
  }
  console.log(`${fotos.length} fotos verificadas, ${criadas} versões leves criadas.`);
})();
