/**
 * Professional HTML Email Templates for Zoopcart Store Signups & Buyer Orders.
 * Designed to look elegant, minimalist, and beautifully responsive.
 */

export function getWelcomeEmailTemplate(fullName: string, businessName: string, storeUrl: string) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Zoopcart</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f4f7fa;
          margin: 0;
          padding: 0;
          color: #1a1a1a;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }
        .header {
          background: #ffffff;
          padding: 30px 20px;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
        }
        .content {
          padding: 40px 40px 30px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 24px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 25px;
        }
        .store-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin: 30px 0;
          text-align: center;
        }
        .store-name {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #718096;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .store-url {
          font-size: 18px;
          font-weight: 700;
          color: #000000;
          text-decoration: none;
          word-break: break-all;
        }
        .cta-button {
          display: inline-block;
          background: #000000;
          color: #ffffff !important;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .features {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #edf2f7;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 14px;
          color: #4a5568;
        }
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
        }
        .footer a { color: #4a5568; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.zoopcart.com/logo.jpg" alt="Zoopcart" style="height: 45px; width: auto; display: inline-block; vertical-align: middle;">
        </div>
        <div class="content">
          <h1 class="greeting">Hi ${fullName}, your store is live! 🚀</h1>
          <p class="text">We're thrilled to have you on board. Your professional digital storefront <strong>${businessName}</strong> is ready to start accepting orders.</p>

          <div class="store-card">
            <div class="store-name">Your Store Link</div>
            <a href="${storeUrl}" class="store-url">${storeUrl}</a>
          </div>

          <p class="text">You can now share this link on your Instagram bio, WhatsApp status, or Facebook page to start selling instantly.</p>

          <div style="text-align: center;">
            <a href="https://www.zoopcart.com/dashboard" class="cta-button">Manage Your Store</a>
          </div>

          <div class="features">
            <p style="font-weight: 700; font-size: 14px; margin-bottom: 15px; color: #000000;">What's next?</p>
            <div class="feature-item">✅ Add your first 5 products</div>
            <div class="feature-item">✅ Set up your WhatsApp for customer chats</div>
            <div class="feature-item">✅ Share your store link with your customers</div>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${currentYear} Zoopcart. All rights reserved.</p>
          <p>You received this because you signed up for Zoopcart.<br>
          <a href="https://www.zoopcart.com">www.zoopcart.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getSellerOrderNotificationEmailTemplate(orderData: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  price: number;
  quantity: number;
  deliveryLocation: string;
  notes?: string;
}) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received! 🛍️</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 40px; color: #334155; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 8px; }
        .order-id { font-size: 14px; font-weight: 700; color: #64748B; margin-bottom: 32px; }
        .cta-button { display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 700; font-size: 16px; padding: 16px 32px; text-decoration: none; border-radius: 12px; margin-bottom: 32px; }
        .info-grid { background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-top: 32px; }
        .info-title { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 16px; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 12px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.zoopcart.com/logo.jpg" alt="Zoopcart" style="height: 45px; width: auto; display: inline-block; vertical-align: middle;">
        </div>
        <div class="content">
          <h1>You've got a new order! 🛍️</h1>
          <div class="order-id">Order Ref: ${orderData.orderId}</div>

          <p>Great news! <strong>${orderData.customerName}</strong> just placed an order from your store.</p>

          <div class="info-grid">
            <div class="info-title">Customer Details</div>
            <div class="info-value">${orderData.customerName} (${orderData.customerPhone})</div>

            <div class="info-title">Items Ordered</div>
            <div class="info-value">${orderData.productName} (x${orderData.quantity})</div>

            <div class="info-title">Order Total</div>
            <div class="info-value">₹${orderData.price}</div>

            <div class="info-title">Delivery Address</div>
            <div class="info-value">${orderData.deliveryLocation}</div>

            ${orderData.notes ? `
            <div class="info-title">Notes</div>
            <div class="info-value">${orderData.notes}</div>
            ` : ''}
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://www.zoopcart.com/dashboard/orders" class="cta-button">View Order in Dashboard</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${currentYear} Zoopcart. All rights reserved.
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
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusText}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; }
        .content { padding: 40px; color: #334155; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin-top: 0; margin-bottom: 8px; }
        .order-id { font-size: 14px; font-weight: 700; color: #64748B; margin-bottom: 32px; }
        .cta-button { display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 700; font-size: 16px; padding: 16px 32px; text-decoration: none; border-radius: 12px; margin-bottom: 32px; }
        .info-grid { background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-top: 32px; }
        .info-title { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 16px; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 12px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.zoopcart.com/logo.jpg" alt="Zoopcart" style="height: 45px; width: auto; display: inline-block; vertical-align: middle;">
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
            <a href="${orderData.trackingLink}" class="cta-button">Track Order Status</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${currentYear} Zoopcart. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
