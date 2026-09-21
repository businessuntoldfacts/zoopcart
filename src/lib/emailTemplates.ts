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
          <img src="https://www.zoopcart.com/logo.jpg" alt="Zoopcart" style="height: 40px; width: auto;">
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
  status?: string;
}) {
  const statusMessages: Record<string, string> = {
    'new': 'Thank you for your order!',
    'pending': 'Thank you for your order!',
    'accepted': 'Your order has been Accepted!',
    'in_progress': 'Your order is now In Progress!',
    'completed': 'Great news! Your order is Completed!',
    'delivered': 'Your order has been Delivered!'
  };

  const statusText = statusMessages[orderData.status || 'new'] || 'Order Status Update';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusText}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 24px; border: 1px solid #E2E8F0; overflow: hidden; }
        .header { background-color: #111111; padding: 40px 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.05em; text-decoration: none; }
        .logo span { color: #3B82F6; }
        .content { padding: 40px 32px; color: #334155; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 8px; }
        .order-id { font-size: 14px; font-weight: 700; color: #64748B; margin-bottom: 32px; }
        .btn { display: inline-block; background-color: #111111; color: #FFFFFF !important; font-weight: 700; font-size: 16px; padding: 14px 28px; text-decoration: none; border-radius: 12px; margin-bottom: 32px; }
        .info-grid { background-color: #F8FAFC; border-radius: 16px; padding: 20px; border: 1px solid #E2E8F0; margin-top: 32px; }
        .info-title { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 16px; }
        .footer { background-color: #F8FAFC; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <img src="https://www.zoopcart.com/logo.jpg" alt="Zoopcart" style="height: 40px; width: auto;">
        </div>
        <div class="content">
          <h1>${statusText}</h1>
          <div class="order-id">Order Ref: ${orderData.orderId}</div>

          <p>Hello ${orderData.customerName}, your order for <strong>${orderData.productName}</strong> has been updated to <b>${orderData.status?.replace('_', ' ').toUpperCase() || 'SUBMITTED'}</b>.</p>

          <div class="info-grid">
            <div class="info-title">Delivery Address</div>
            <div class="info-value">${orderData.deliveryLocation}</div>

            <div class="info-title">Order Total</div>
            <div class="info-value">₹${orderData.price}</div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${orderData.trackingLink}" class="btn">Track Order Live →</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Zoopcart. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

