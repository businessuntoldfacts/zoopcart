const fs = require('fs');
let code = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf8');

const oldInsert = `.insert({
        business_id: business.id,
        product_id: product.id,
        customer_name: name,
        customer_phone: phone,
        delivery_location: address,
        quantity: quantity,
        notes: "Total Amount: ₹" + totalAmount,
        status: 'pending'
      })`;

const newInsert = `.insert({
        business_id: business.id,
        product_id: product.id,
        customer_name: name,
        customer_phone: phone,
        delivery_location: address,
        quantity: quantity,
        tracking_token: Math.random().toString(36).substring(2, 10).toUpperCase(),
        notes: "Total Amount: ₹" + totalAmount,
        status: 'pending'
      })`;

code = code.replace(oldInsert, newInsert);
fs.writeFileSync('src/components/CheckoutModal.tsx', code);
