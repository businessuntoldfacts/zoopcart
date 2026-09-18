const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

const replacement = `
    const deliveryData = JSON.stringify({ type: formData.delivery_type, charge: formData.delivery_charge, video: formData.videoLink });
    const payloadDesc = formData.description + \`\\n\\n---ZYP_DELIVERY:\${deliveryData}---\`;
`;
code = code.replace(/const deliveryData = JSON\.stringify\(\{ type: formData\.delivery_type, charge: formData\.delivery_charge \}\);\n\s*const payloadDesc = formData\.description \+ `\\n\\n---ZYP_DELIVERY:\$\{deliveryData\}---`;/, replacement);


const editDataReplacement = `
                    let desc = p.description || "";
                    let delType = "free";
                    let delCharge = "";
                    let vLink = "";
                    if (desc.includes('---ZYP_DELIVERY:')) {
                      const parts = desc.split('---ZYP_DELIVERY:');
                      desc = parts[0].trim();
                      try {
                        const meta = JSON.parse(parts[1].split('---')[0]);
                        delType = meta.type || "free";
                        delCharge = meta.charge || "";
                        vLink = meta.video || "";
                      } catch(e) {}
                    }
                    
                    setFormData({
                      name: p.name,
                      description: desc,
                      category: p.category || "",
                      price: p.price.toString(),
                      sale_price: p.sale_price ? p.sale_price.toString() : "",
                      availability: p.availability || "in_stock",
                      image: p.image || "",
                      stock: "50",
                      videoLink: vLink,
                      published: true,
                      featured: false,
                      delivery_type: delType,
                      delivery_charge: delCharge
                    });
`;
code = code.replace(/let desc = p\.description \|\| "";[\s\S]*?delivery_charge: delCharge\n\s*\}\);/, editDataReplacement);

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
