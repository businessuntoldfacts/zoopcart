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
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
          color: #111827;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
        }
        .header {
          background: #ffffff;
          padding: 40px 20px;
          text-align: center;
          border-bottom: 1px solid #f3f4f6;
        }
        .content {
          padding: 48px 40px 32px;
          line-height: 1.6;
        }
        .greeting {
          font-size: 26px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }
        .text {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 24px;
        }
        .store-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 32px 24px;
          margin: 32px 0;
          text-align: center;
        }
        .store-name {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #9ca3af;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .store-url {
          font-size: 20px;
          font-weight: 700;
          color: #000000;
          text-decoration: none;
          word-break: break-all;
        }
        .cta-button {
          display: inline-block;
          background: #000000;
          color: #ffffff !important;
          padding: 18px 36px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
        }
        .features {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid #f3f4f6;
        }
        .feature-item {
          margin-bottom: 12px;
          font-size: 14px;
          color: #6b7280;
          display: flex;
          align-items: center;
        }
        .footer {
          background: #f9fafb;
          padding: 32px;
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
          border-top: 1px solid #f3f4f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 50px; width: auto; display: inline-block;">
        </div>
        <div class="content">
          <h1 class="greeting">Your store is live! 🚀</h1>
          <p class="text">Hi ${fullName}, welcome to Zoopcart. Your professional digital storefront <strong>${businessName}</strong> is ready for customers.</p>

          <div class="store-card">
            <div class="store-name">Store Address</div>
            <a href="${storeUrl}" class="store-url">${storeUrl}</a>
          </div>

          <div style="text-align: center;">
            <a href="https://www.zoopcart.com/dashboard" class="cta-button">Go to Dashboard</a>
          </div>

          <div class="features">
            <p style="font-weight: 700; font-size: 14px; margin-bottom: 16px; color: #111827;">Recommended next steps:</p>
            <div class="feature-item">✓ Upload your first product</div>
            <div class="feature-item">✓ Add your WhatsApp number for orders</div>
            <div class="feature-item">✓ Share your link on social media</div>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${currentYear} Zoopcart. All rights reserved.</p>
          <p><a href="https://www.zoopcart.com" style="color: #9ca3af; text-decoration: none;">zoopcart.com</a></p>
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
      <title>New Order Received!</title>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; }
        .header { background-color: #ffffff; padding: 35px 20px; text-align: center; border-bottom: 1px solid #f3f4f6; }
        .content { padding: 40px; color: #374151; line-height: 1.6; }
        h1 { font-size: 26px; font-weight: 800; color: #111827; margin: 0 0 8px 0; letter-spacing: -0.02em; }
        .order-id { font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 32px; letter-spacing: 0.05em; }
        .cta-button { display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 700; font-size: 16px; padding: 16px 32px; text-decoration: none; border-radius: 14px; margin-top: 24px; }
        .info-grid { background-color: #f9fafb; border-radius: 20px; padding: 24px; border: 1px solid #f3f4f6; margin-top: 24px; }
        .info-title { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em; }
        .info-value { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 18px; }
        .footer { background-color: #f9fafb; padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 50px; width: auto; display: inline-block;">
        </div>
        <div class="content">
          <h1>New Order Received! 🛍️</h1>
          <div class="order-id">ID: ${orderData.orderId}</div>

          <p>Great news! You have a new sale from <strong>${orderData.customerName}</strong>.</p>

          <div class="info-grid">
            <div class="info-title">Product</div>
            <div class="info-value">${orderData.productName} (x${orderData.quantity})</div>

            <div class="info-title">Customer</div>
            <div class="info-value">${orderData.customerName} (${orderData.customerPhone})</div>

            <div class="info-title">Total Amount</div>
            <div class="info-value">₹${orderData.price}</div>

            <div class="info-title">Shipping To</div>
            <div class="info-value">${orderData.deliveryLocation}</div>

            ${orderData.notes ? `
            <div class="info-title">Customer Notes</div>
            <div class="info-value">${orderData.notes}</div>
            ` : ''}
          </div>

          <div style="text-align: center;">
            <a href="https://www.zoopcart.com/dashboard/orders" class="cta-button">View Order Details</a>
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
    'new': 'Order Received!',
    'pending': 'Order Received!',
    'accepted': 'Order Accepted!',
    'in_progress': 'Order Processing!',
    'completed': 'Order Completed!',
    'delivered': 'Order Delivered!'
  };

  const statusText = statusMessages[orderData.status || 'new'] || 'Order Update';
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusText}</title>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f3f4f6; }
        .header { background-color: #ffffff; padding: 35px 20px; text-align: center; border-bottom: 1px solid #f3f4f6; }
        .content { padding: 40px; color: #374151; line-height: 1.6; }
        h1 { font-size: 26px; font-weight: 800; color: #111827; margin: 0 0 8px 0; letter-spacing: -0.02em; }
        .order-id { font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 32px; letter-spacing: 0.05em; }
        .cta-button { display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 700; font-size: 16px; padding: 18px 36px; text-decoration: none; border-radius: 14px; margin-top: 24px; }
        .info-grid { background-color: #f9fafb; border-radius: 20px; padding: 24px; border: 1px solid #f3f4f6; margin-top: 24px; }
        .info-title { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em; }
        .info-value { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 18px; }
        .footer { background-color: #f9fafb; padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 50px; width: auto; display: inline-block;">
        </div>
        <div class="content">
          <h1>${statusText}</h1>
          <div class="order-id">Ref: ${orderData.orderId}</div>

          <p>Hi ${orderData.customerName}, your order for <strong>${orderData.productName}</strong> has been updated to <b>${orderData.status?.replace('_', ' ').toUpperCase() || 'CONFIRMED'}</b>.</p>

          <div class="info-grid">
            <div class="info-title">Delivery Address</div>
            <div class="info-value">${orderData.deliveryLocation}</div>

            <div class="info-title">Total Amount</div>
            <div class="info-value">₹${orderData.price}</div>
          </div>

          <div style="text-align: center;">
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
