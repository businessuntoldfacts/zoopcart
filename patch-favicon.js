const fs = require('fs');
let code = fs.readFileSync('src/app/layout.tsx', 'utf8');
const replacement = `export const metadata: Metadata = {
  title: "Zoopcart",
  description: "Turn conversations into orders.",
  icons: {
    icon: '/icon.jpg',
    apple: '/icon.jpg',
  },
};`;
code = code.replace(/export const metadata: Metadata = \{[\s\S]*?\};/, replacement);
fs.writeFileSync('src/app/layout.tsx', code);
