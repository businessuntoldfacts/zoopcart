/**
 * Ultra-Premium Professional HTML Email Templates for Zoopcart.
 * Dark Mode Theme with White Logo Box - Designed for Maximum Impact.
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
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 0; color: #ffffff; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 20px auto; background: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
        <!-- White Logo Box (Patla & Professional) -->
        <div style="background: #ffffff; padding: 18px 20px; text-align: center; margin: 12px; border-radius: 16px;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 55px; width: auto; display: inline-block;">
        </div>

        <!-- Content -->
        <div style="padding: 30px 40px 40px; line-height: 1.6;">
          <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.03em;">Your store is live! 🚀</h1>
          <p style="font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0;">Hi ${fullName}, welcome to the elite circle of Zoopcart sellers. Your professional storefront <strong>${businessName}</strong> is now open for business.</p>

          <!-- Store Card -->
          <div style="background: #111111; border: 1px solid #222222; border-radius: 20px; padding: 32px 24px; margin: 32px 0; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #71717a; font-weight: 700; margin-bottom: 12px;">Store Link</div>
            <a href="${storeUrl}" target="_blank" style="font-size: 20px; font-weight: 700; color: #ffffff; text-decoration: none; word-break: break-all;">${storeUrl}</a>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://www.zoopcart.com/dashboard" target="_blank" style="display: inline-block; background: #ffffff; color: #000000 !important; padding: 18px 40px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 16px;">Manage Store</a>
          </div>

          <!-- Steps -->
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #1a1a1a;">
            <p style="font-weight: 700; font-size: 12px; margin: 0 0 16px 0; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em;">Next Steps</p>
            <div style="margin-bottom: 12px; font-size: 14px; color: #d4d4d8;">✅ List your first 5 premium products</div>
            <div style="margin-bottom: 12px; font-size: 14px; color: #d4d4d8;">✅ Connect your WhatsApp for instant orders</div>
            <div style="margin-bottom: 0; font-size: 14px; color: #d4d4d8;">✅ Share your link to start earning</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #000000; padding: 32px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1a1a1a;">
          <p style="margin: 0 0 8px 0;">&copy; ${currentYear} Zoopcart. All rights reserved.</p>
          <a href="https://www.zoopcart.com" target="_blank" style="color: #71717a; text-decoration: none;">zoopcart.com</a>
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
      <title>New Order!</title>
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 0; color: #ffffff; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
        <!-- White Logo Box (Patla & Professional) -->
        <div style="background: #ffffff; padding: 18px 20px; text-align: center; margin: 12px; border-radius: 16px;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 55px; width: auto; display: inline-block;">
        </div>

        <!-- Content -->
        <div style="padding: 30px 40px 40px; color: #ffffff; line-height: 1.6;">
          <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0; letter-spacing: -0.02em;">New Order Received! 🛍️</h1>
          <div style="font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.1em;">Order ID: ${orderData.orderId}</div>

          <p style="font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0;">Congratulations! You just made a sale from <strong>${orderData.customerName}</strong>.</p>

          <!-- Order Summary Card -->
          <div style="background-color: #111111; border-radius: 20px; padding: 24px; border: 1px solid #222222; margin: 24px 0;">
            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Item</div>
            <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 20px;">${orderData.productName} <span style="color: #71717a; font-weight: 500;">(x${orderData.quantity})</span></div>

            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Customer Details</div>
            <div style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 20px;">${orderData.customerName} · <a href="tel:${orderData.customerPhone}" style="color: #ffffff; text-decoration: underline;">${orderData.customerPhone}</a></div>

            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Total Amount</div>
            <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 20px;">₹${orderData.price}</div>

            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Shipping Address</div>
            <div style="font-size: 15px; font-weight: 600; color: #a1a1aa; margin-bottom: 0;">${orderData.deliveryLocation}</div>

            ${orderData.notes ? `
            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-top: 20px; margin-bottom: 6px; letter-spacing: 0.1em;">Notes</div>
            <div style="font-size: 14px; font-weight: 500; color: #d4d4d8; background: #1a1a1a; padding: 12px; border-radius: 8px;">${orderData.notes}</div>
            ` : ''}
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://www.zoopcart.com/dashboard/orders" target="_blank" style="display: inline-block; background-color: #ffffff; color: #000000 !important; font-weight: 800; font-size: 15px; padding: 18px 40px; text-decoration: none; border-radius: 14px;">Process Order</a>
          </div>
        </div>

        <div style="background-color: #000000; padding: 32px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1a1a1a;">
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
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 0; color: #ffffff; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
        <!-- White Logo Box (Patla & Professional) -->
        <div style="background: #ffffff; padding: 18px 20px; text-align: center; margin: 12px; border-radius: 16px;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 55px; width: auto; display: inline-block;">
        </div>

        <!-- Content -->
        <div style="padding: 30px 40px 40px; color: #ffffff; line-height: 1.6;">
          <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0; letter-spacing: -0.02em;">${statusText} 🎉</h1>
          <div style="font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.1em;">Order ID: ${orderData.orderId}</div>

          <p style="font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0;">Hello ${orderData.customerName}, your order for <strong>${orderData.productName}</strong> has been updated to <span style="background-color: #222222; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; border: 1px solid #333333;">${orderData.status?.replace('_', ' ').toUpperCase() || 'CONFIRMED'}</span>.</p>

          <!-- Order Summary Card -->
          <div style="background-color: #111111; border-radius: 20px; padding: 24px; border: 1px solid #222222; margin: 24px 0;">
            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Items Ordered</div>
            <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 20px;">${orderData.productName} <span style="color: #71717a; font-weight: 500;">(x${orderData.quantity || 1})</span></div>

            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Delivery Address</div>
            <div style="font-size: 15px; font-weight: 600; color: #a1a1aa; margin-bottom: 20px;">${orderData.deliveryLocation}</div>

            <div style="font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.1em;">Total Paid</div>
            <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 0;">₹${orderData.price}</div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${orderData.trackingLink}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #000000 !important; font-weight: 800; font-size: 15px; padding: 18px 40px; text-decoration: none; border-radius: 14px;">Track Status</a>
          </div>
        </div>

        <div style="background-color: #000000; padding: 32px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1a1a1a;">
          &copy; ${currentYear} Zoopcart. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPlatformAnnouncementEmailTemplate(title: string, content: string, link?: string) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 0; color: #ffffff; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
        <div style="background: #ffffff; padding: 18px 20px; text-align: center; margin: 12px; border-radius: 16px;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 55px; width: auto; display: inline-block;">
        </div>

        <div style="padding: 30px 40px 40px; color: #ffffff; line-height: 1.6;">
          <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.02em;">${title}</h1>

          <div style="font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0; white-space: pre-wrap;">${content}</div>

          ${link ? `
          <div style="text-align: center; margin-top: 32px;">
            <a href="${link}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #000000 !important; font-weight: 800; font-size: 15px; padding: 18px 40px; text-decoration: none; border-radius: 14px;">Learn More</a>
          </div>
          ` : ''}
        </div>

        <div style="background-color: #000000; padding: 32px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1a1a1a;">
          &copy; ${currentYear} Zoopcart. All rights reserved.
          <br>
          <p style="margin-top: 8px;">You're receiving this as a registered seller on Zoopcart.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getSuspensionEmailTemplate(businessName: string, reason: string) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Suspended</title>
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 0; color: #ffffff; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
        <div style="background: #ffffff; padding: 18px 20px; text-align: center; margin: 12px; border-radius: 16px;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 55px; width: auto; display: inline-block;">
        </div>
        <div style="padding: 30px 40px 40px; color: #ffffff; line-height: 1.6;">
          <h1 style="font-size: 24px; font-weight: 800; color: #ef4444; margin: 0 0 16px 0;">Account Suspended ⚠️</h1>
          <p style="font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0;">Hello, the store <strong>${businessName}</strong> has been suspended by the platform administration.</p>
          <div style="background: #111; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 8px;">Reason for Suspension</div>
            <div style="font-size: 15px; color: #ffffff; font-weight: 500;">${reason}</div>
          </div>
          <p style="font-size: 14px; color: #71717a;">If you believe this is a mistake, please contact our support team at support@zoopcart.com.</p>
        </div>
        <div style="background-color: #000000; padding: 32px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1a1a1a;">
          &copy; ${currentYear} Zoopcart. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getActivationEmailTemplate(businessName: string) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Reactivated</title>
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 0; color: #ffffff; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
        <div style="background: #ffffff; padding: 18px 20px; text-align: center; margin: 12px; border-radius: 16px;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 55px; width: auto; display: inline-block;">
        </div>
        <div style="padding: 30px 40px 40px; color: #ffffff; line-height: 1.6;">
          <h1 style="font-size: 24px; font-weight: 800; color: #22c55e; margin: 0 0 16px 0;">Account Reactivated! ✅</h1>
          <p style="font-size: 16px; color: #a1a1aa; margin: 0 0 24px 0;">Great news! Your store <strong>${businessName}</strong> has been reactivated. You can now access your dashboard and your products are visible to customers again.</p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://www.zoopcart.com/dashboard" target="_blank" style="display: inline-block; background-color: #ffffff; color: #000000 !important; font-weight: 800; font-size: 15px; padding: 18px 40px; text-decoration: none; border-radius: 14px;">Go to Dashboard</a>
          </div>
        </div>
        <div style="background-color: #000000; padding: 32px; text-align: center; font-size: 12px; color: #52525b; border-top: 1px solid #1a1a1a;">
          &copy; ${currentYear} Zoopcart. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}


