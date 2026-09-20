/**
 * Professional HTML Email Templates for Zypcart Store Signups & Buyer Orders.
 * Designed to look elegant, minimalist, and beautifully responsive.
 */

export function getWelcomeEmailTemplate(fullName: string, businessName: string, storeUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Zypcart</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 24px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #111111; padding: 40px 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.05em; text-decoration: none; }
        .logo span { color: #3B82F6; }
        .content { padding: 40px 32px; color: #334155; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em; }
        p { margin-top: 0; margin-bottom: 24px; font-size: 16px; }
        .btn { display: inline-block; background-color: #111111; color: #FFFFFF !important; font-weight: 700; font-size: 16px; padding: 14px 28px; rounded: 12px; text-decoration: none; border-radius: 12px; margin-bottom: 32px; }
        .store-box { background-color: #F1F5F9; border-radius: 16px; padding: 20px; margin-bottom: 32px; border: 1px solid #E2E8F0; }
        .store-label { font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .store-value { font-size: 16px; font-weight: 700; color: #0F172A; }
        .footer { background-color: #F8FAFC; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <a href="https://zypcart.com" class="logo">ZYP<span>CART</span></a>
        </div>
        <div class="content">
          <h1>Welcome aboard, ${fullName}!</h1>
          <p>Congratulations! Your digital storefront <strong>${businessName}</strong> is officially live on Zypcart. You're now equipped to sell across WhatsApp, Instagram, and anywhere else you share your custom link.</p>

          <div class="store-box">
            <div class="store-label">Your Live Store URL</div>
            <div class="store-value"><a href="${storeUrl}" style="color: #3B82F6; text-decoration: none;">${storeUrl}</a></div>
          </div>

          <div style="text-align: center;">
            <a href="https://zypcart.com/login" class="btn">Go to Dashboard</a>
          </div>

          <p style="margin-bottom: 0;">If you have any questions or need setup advice, drop us a line anytime at support@zypcart.com. We're here to help you scale.</p>
        </div>
        <div class="wrapper footer">
          &copy; ${new Date().getFullYear()} Zypcart Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getOrderNotificationEmailTemplate(orderData: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  price: number;
  quantity: number;
  deliveryLocation: string;
  trackingLink: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Confirmed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 24px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #111111; padding: 40px 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.05em; text-decoration: none; }
        .logo span { color: #3B82F6; }
        .content { padding: 40px 32px; color: #334155; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 8px; letter-spacing: -0.02em; }
        .order-id { font-size: 14px; font-weight: 700; color: #64748B; font-mono: monospace; margin-bottom: 32px; }
        .btn { display: inline-block; background-color: #111111; color: #FFFFFF !important; font-weight: 700; font-size: 16px; padding: 14px 28px; rounded: 12px; text-decoration: none; border-radius: 12px; margin-bottom: 32px; }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F1F5F9; }
        .item-details { flex-grow: 1; }
        .item-name { font-size: 16px; font-weight: 700; color: #0F172A; }
        .item-qty { font-size: 13px; color: #64748B; margin-top: 2px; }
        .item-price { font-size: 16px; font-weight: 800; color: #0F172A; }
        .info-grid { background-color: #F8FAFC; border-radius: 16px; padding: 20px; border: 1px solid #E2E8F0; margin-top: 32px; margin-bottom: 32px; }
        .info-title { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 16px; }
        .info-value:last-child { margin-bottom: 0; }
        .footer { background-color: #F8FAFC; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <a href="https://zypcart.com" class="logo">ZYP<span>CART</span></a>
        </div>
        <div class="content">
          <h1>Thank you for your order!</h1>
          <div class="order-id">Order Ref: ${orderData.orderId}</div>

          <p>We've successfully registered your request. Here is a summary of the items ordered:</p>

          <div class="item-row">
            <div class="item-details">
              <div class="item-name">${orderData.productName}</div>
              <div class="item-qty">Quantity: ${orderData.quantity}</div>
            </div>
            <div class="item-price">₹${orderData.price * orderData.quantity}</div>
          </div>

          <div class="info-grid">
            <div class="info-title">Customer Name</div>
            <div class="info-value">${orderData.customerName}</div>

            <div class="info-title">Contact Phone</div>
            <div class="info-value">+91 ${orderData.customerPhone}</div>

            <div class="info-title">Delivery Address</div>
            <div class="info-value" style="margin-bottom: 0;">${orderData.deliveryLocation}</div>
          </div>

          <div style="text-align: center;">
            <a href="${orderData.trackingLink}" class="btn">Track Order Status</a>
          </div>
        </div>
        <div class="wrapper footer">
          &copy; ${new Date().getFullYear()} Zypcart Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
