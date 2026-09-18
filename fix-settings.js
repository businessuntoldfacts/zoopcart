const fs = require('fs');

function removeLoading(path) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/if \(loading\) return <div className=".*?">Loading settings\.\.\.<\/div>;\s*/g, '');
  code = code.replace(/if \(globalLoading\) return <div className=".*?">Loading settings\.\.\.<\/div>;\s*/g, '');
  fs.writeFileSync(path, code);
}

removeLoading('src/app/dashboard/settings/payment/page.tsx');
removeLoading('src/app/dashboard/settings/theme/page.tsx');
removeLoading('src/app/dashboard/settings/store/page.tsx');

