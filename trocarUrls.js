const fs = require('fs');
const path = require('path');

const pastaBase = './src'; // ajuste se seu código estiver em outra pasta
const antigo = 'http://localhost:8000';
const novo = 'https://csaruto96.pythonanywhere.com';

function trocarURLEmArquivo(caminhoArquivo) {
  let conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
  if (conteudo.includes(antigo)) {
    conteudo = conteudo.replaceAll(antigo, novo);
    fs.writeFileSync(caminhoArquivo, conteudo, 'utf-8');
    console.log(`✅ Atualizado: ${caminhoArquivo}`);
  }
}

function percorrerPastas(pasta) {
  fs.readdirSync(pasta).forEach((item) => {
    const caminhoCompleto = path.join(pasta, item);
    const stats = fs.statSync(caminhoCompleto);
    if (stats.isDirectory()) {
      percorrerPastas(caminhoCompleto);
    } else if (/\.(js|jsx)$/.test(item)) {
      trocarURLEmArquivo(caminhoCompleto);
    }
  });
}

console.log(`🔍 Procurando e substituindo URLs em: ${pastaBase}`);
percorrerPastas(pastaBase);
console.log('🚀 Substituição concluída!');
