const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

// 1. Add fields to formData
code = code.replace(/featured: false\n  \}\);/, 'featured: false,\n    delivery_type: "free",\n    delivery_charge: ""\n  });');

// Also add generatingAI state
code = code.replace(/const \[uploadingImage, setUploadingImage\] = useState\(false\);/, 'const [uploadingImage, setUploadingImage] = useState(false);\n  const [generatingAI, setGeneratingAI] = useState(false);');

// 2. Modify handleAddProduct
const handleAddProductReplacement = `
    const deliveryData = JSON.stringify({ type: formData.delivery_type, charge: formData.delivery_charge });
    const payloadDesc = formData.description + \`\\n\\n---ZYP_DELIVERY:\${deliveryData}---\`;

    const payload = {
      business_id: businessId,
      name: formData.name,
      slug: slug,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      short_description: payloadDesc.substring(0, 100),
      description: payloadDesc,
      category: formData.category,
      availability: formData.availability,
      image: formData.image
    };
`;
code = code.replace(/const payload = \{[\s\S]*?image: formData\.image\n    \};/, handleAddProductReplacement);

// Reset form data in handleAddProduct
code = code.replace(/setFormData\(\{ name: "", description: "", category: "", price: "", sale_price: "", availability: "in_stock", image: "", stock: "50", videoLink: "", published: true, featured: false \}\);/, 'setFormData({ name: "", description: "", category: "", price: "", sale_price: "", availability: "in_stock", image: "", stock: "50", videoLink: "", published: true, featured: false, delivery_type: "free", delivery_charge: "" });');

// 3. Modify edit button deserialization
const editDataReplacement = `
                    let desc = p.description || "";
                    let delType = "free";
                    let delCharge = "";
                    if (desc.includes('---ZYP_DELIVERY:')) {
                      const parts = desc.split('---ZYP_DELIVERY:');
                      desc = parts[0].trim();
                      try {
                        const meta = JSON.parse(parts[1].split('---')[0]);
                        delType = meta.type || "free";
                        delCharge = meta.charge || "";
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
                      videoLink: "",
                      published: true,
                      featured: false,
                      delivery_type: delType,
                      delivery_charge: delCharge
                    });
`;
code = code.replace(/setFormData\(\{\s*name: p\.name,[\s\S]*?featured: false\s*\}\);/, editDataReplacement);

// 4. Update the categories select options
const newCategoriesHTML = `<select required value={formData.category} onChange={(e: any) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 h-14 rounded-xl px-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 appearance-none font-medium">
                  <option value="" disabled>Select category</option>
                  <option value="Home Bakers">Home Bakers</option>
                  <option value="Clothing Sellers">Clothing Sellers</option>
                  <option value="Jewellery Businesses">Jewellery Businesses</option>
                  <option value="Gift Businesses">Gift Businesses</option>
                  <option value="Interior Designers">Interior Designers</option>
                  <option value="Custom Furniture">Custom Furniture</option>
                  <option value="Artists">Artists</option>
                  <option value="Photographers">Photographers</option>
                  <option value="Wedding Vendors">Wedding Vendors</option>
                  <option value="Others">Others</option>
                </select>`;
code = code.replace(/<select required value=\{formData\.category\}[\s\S]*?<\/select>/, newCategoriesHTML);

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
