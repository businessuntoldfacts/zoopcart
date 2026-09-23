/**
 * Professional HTML Email Templates for Zoopcart Store Signups & Buyer Orders.
 * Designed to look elegant, minimalist, and beautifully responsive.
 * All crucial styles are strictly inlined to guarantee perfect rendering across all email clients (Gmail, Outlook, Yahoo).
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
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827;-webkit-font-smoothing:antialiased;">
      <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f3f4f6;">
        <!-- Header -->
        <div style="background: #ffffff; padding: 35px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 45px; width: auto; display: inline-block; border-radius: 6px;">
        </div>

        <!-- Content -->
        <div style="padding: 40px 40px 32px; line-height: 1.6;">
          <h1 style="font-size: 26px; font-weight: 800; color: #111827; margin: 0 0 16px 0; letter-spacing: -0.03em;">Your store is live! 🚀</h1>
          <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0;">Hi ${fullName}, welcome to Zoopcart. Your professional digital storefront <strong>${businessName}</strong> is ready to accept orders from customers around the world.</p>

          <!-- Store Card -->
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; margin: 32px 0; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #9ca3af; font-weight: 700; margin-bottom: 8px;">Store Address</div>
            <a href="${storeUrl}" target="_blank" style="font-size: 18px; font-weight: 700; color: #000000; text-decoration: none; word-break: break-all;">${storeUrl}</a>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://www.zoopcart.com/dashboard" target="_blank" style="display: inline-block; background: #000000; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">Go to Dashboard</a>
          </div>

          <!-- Recommended Next Steps -->
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f3f4f6;">
            <p style="font-weight: 700; font-size: 14px; margin: 0 0 16px 0; color: #111827; text-transform: uppercase; letter-spacing: 0.05em;">Recommended next steps:</p>
            <div style="margin-bottom: 12px; font-size: 14px; color: #4b5563;">⚡ <b>Upload products:</b> Add your first item with beautiful images.</div>
            <div style="margin-bottom: 12px; font-size: 14px; color: #4b5563;">⚡ <b>WhatsApp configuration:</b> Enable direct buyer messaging.</div>
            <div style="margin-bottom: 0; font-size: 14px; color: #4b5563;">⚡ <b>Share link:</b> Put your store URL in your Instagram & WhatsApp bio.</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0 0 8px 0;">&copy; ${currentYear} Zoopcart. All rights reserved.</p>
          <p style="margin: 0;"><a href="https://www.zoopcart.com" target="_blank" style="color: #9ca3af; text-decoration: none; font-weight: 600;">zoopcart.com</a></p>
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
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827;-webkit-font-smoothing:antialiased;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f3f4f6;">
        <!-- Header -->
        <div style="background-color: #ffffff; padding: 35px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 45px; width: auto; display: inline-block; border-radius: 6px;">
        </div>

        <!-- Content -->
        <div style="padding: 40px; color: #374151; line-height: 1.6;">
          <h1 style="font-size: 26px; font-weight: 800; color: #111827; margin: 0 0 6px 0; letter-spacing: -0.02em;">New Order Received! 🛍️</h1>
          <div style="font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.05em;">Order Ref: ${orderData.orderId}</div>

          <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0;">Great news! You have just received a new order from <strong>${orderData.customerName}</strong>.</p>

          <!-- Order Summary Grid Box -->
          <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; border: 1px solid #f3f4f6; margin: 24px 0;">
            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Product Item</div>
            <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 16px;">${orderData.productName} <span style="color: #6b7280; font-weight: 500;">(x${orderData.quantity})</span></div>

            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Customer Details</div>
            <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 16px;">${orderData.customerName} · <a href="tel:${orderData.customerPhone}" style="color: #000000; text-decoration: underline;">${orderData.customerPhone}</a></div>

            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Total Amount</div>
            <div style="font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 16px;">₹${orderData.price}</div>

            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Shipping Address</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 0;">${orderData.deliveryLocation}</div>

            ${orderData.notes ? `
            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-top: 16px; margin-bottom: 4px; letter-spacing: 0.1em;">Buyer Notes</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 0; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${orderData.notes}</div>
            ` : ''}
          </div>

          <!-- Styled Button -->
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://www.zoopcart.com/dashboard/orders" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 16px 32px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">View Order in Dashboard</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
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
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827;-webkit-font-smoothing:antialiased;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f3f4f6;">
        <!-- Header -->
        <div style="background-color: #ffffff; padding: 35px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <img src="https://www.zoopcart.com/logo-black.jpg" alt="Zoopcart" style="height: 45px; width: auto; display: inline-block; border-radius: 6px;">
        </div>

        <!-- Content -->
        <div style="padding: 40px; color: #374151; line-height: 1.6;">
          <h1 style="font-size: 26px; font-weight: 800; color: #111827; margin: 0 0 6px 0; letter-spacing: -0.02em;">${statusText} 🎉</h1>
          <div style="font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.05em;">Order Ref: ${orderData.orderId}</div>

          <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px 0;">Hello ${orderData.customerName}, your order for <strong>${orderData.productName}</strong> has been successfully updated to <span style="background-color: #f3f4f6; color: #111827; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 13px; border: 1px solid #e5e7eb;">${orderData.status?.replace('_', ' ').toUpperCase() || 'CONFIRMED'}</span>.</p>

          <!-- Order Summary Card -->
          <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; border: 1px solid #f3f4f6; margin: 24px 0;">
            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Items Ordered</div>
            <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 16px;">${orderData.productName} <span style="color: #6b7280; font-weight: 500;">(x${orderData.quantity || 1})</span></div>

            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Delivery Address</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px;">${orderData.deliveryLocation}</div>

            <div style="font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.1em;">Total Amount</div>
            <div style="font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 0;">₹${orderData.price}</div>
          </div>

          <!-- Fully Inlined Button that prevents client stripping -->
          <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
            <a href="${orderData.trackingLink}" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 16px 34px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">Track Order Status</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0 0 6px 0;">&copy; ${currentYear} Zoopcart. All rights reserved.</p>
          <p style="margin: 0;">Thank you for shopping with us!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
