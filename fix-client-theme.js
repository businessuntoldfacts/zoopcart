const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

const replacement = `
  let theme = 'light';
  if (business?.instagram_profile_url) {
    try {
      if (business.instagram_profile_url.startsWith('{')) {
        theme = JSON.parse(business.instagram_profile_url).theme || 'light';
      } else {
        theme = business.instagram_profile_url;
      }
    } catch(e) {}
  }
`;
code = code.replace(/const theme = business\?\.theme \|\| 'light';/, replacement);

fs.writeFileSync('src/components/StorefrontClient.tsx', code);
