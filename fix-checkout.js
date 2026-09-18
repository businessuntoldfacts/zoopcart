const fs = require('fs');
let code = fs.readFileSync('src/components/CheckoutModal.tsx', 'utf8');

// 1. Add quantity state
code = code.replace('const [success, setSuccess] = useState(false);', 'const [success, setSuccess] = useState(false);\n  const [quantity, setQuantity] = useState(1);');

// 2. Fix handleSubmit
const oldHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    
    setLoading(true);

    const { data, error } = await supabase
      .from('orders')
      .insert({
        business_id: business.id,
        product_id: product.id,
        customer_name: name,
        customer_phone: phone,
        delivery_location: address,
        quantity: 1,
        notes: "Order Amount: ₹" + product.price,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error || !data) {
      alert("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to WhatsApp after 2 seconds
    setTimeout(() => {
      const message = \`*New Order Placed!* 🛍️%0A%0A*Order ID:* #%0A*Product:* %0A*Price:* ₹%0A%0A*Customer Details:*%0AName: %0APhone: %0AAddress: %0A%0AI have placed this order on your website.\`;
      const waUrl = \`https://wa.me/\${business.whatsapp_country_code}\${business.whatsapp_number}?text=\${message}\`;
      window.location.href = waUrl;
      setIsOpen(false);
      setSuccess(false);
    }, 2000);
  };`;

const newHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    
    setLoading(true);

    const totalAmount = (product.price || 0) * quantity;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        business_id: business.id,
        product_id: product.id,
        customer_name: name,
        customer_phone: phone,
        delivery_location: address,
        quantity: quantity,
        notes: "Total Amount: ₹" + totalAmount,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error || !data) {
      alert("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to WhatsApp after 2 seconds
    setTimeout(() => {
      const message = \`*New Order Placed!* 🛍️%0A%0A*Order ID:* #\${data.id.substring(0,6).toUpperCase()}%0A*Product:* \${encodeURIComponent(product.name)}%0A*Quantity:* \${quantity}%0A*Total Price:* ₹\${totalAmount}%0A%0A*Customer Details:*%0AName: \${encodeURIComponent(name)}%0APhone: \${encodeURIComponent(phone)}%0AAddress: \${encodeURIComponent(address)}%0A%0AI have placed this order on your website.\`;
      
      let number = business.whatsapp_number || '';
      if (!number) return;
      let waUrl = \`https://wa.me/\${business.whatsapp_country_code || '91'}\${number}?text=\${message}\`;
      window.location.href = waUrl;
      setIsOpen(false);
      setSuccess(false);
    }, 2000);
  };`;

code = code.replace(oldHandleSubmit, newHandleSubmit);

// 3. Inject quantity selector in the UI before Name
const addressField = `                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>`;
                    
const withQuantity = `                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">Quantity</label>
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-1 w-max">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm font-bold text-xl transition-all">-</button>
                        <span className="w-8 text-center font-extrabold text-slate-900">{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm font-bold text-xl transition-all">+</button>
                      </div>
                    </div>
                    <div>`;
                    
code = code.replace(addressField, withQuantity);

fs.writeFileSync('src/components/CheckoutModal.tsx', code);
