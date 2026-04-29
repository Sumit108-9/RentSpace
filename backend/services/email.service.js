import { transporter } from '../config/email.config.js';

const FROM_EMAIL = process.env.EMAIL_USER || 'sumitdevv416@gmail.com';
const FROM_NAME = 'RentSpace';

/**
 * Send email helper function
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      text,
      html
    });
    
    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Welcome Email - Sent when user registers
 */
export const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to RentSpace, ${user.name}!`;
  
  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F4ED; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td style="background-color: #2A7F74; padding: 30px 40px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold; letter-spacing: 1px;">RentSpace</h1>
                <p style="margin: 5px 0 0 0; color: #E9DFD2; font-size: 14px;">Premium Furniture, Flexible Living</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #FFFFFF; padding: 40px; border: 1px solid #D8CFBF; border-top: none;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <div style="width: 60px; height: 60px; background-color: #2A7F74; border-radius: 50%; display: inline-block; line-height: 60px; text-align: center;">
                        <span style="color: #FFFFFF; font-size: 36px; font-weight: bold;">✓</span>
                      </div>
                    </td>
                  </tr>
                </table>
                <h2 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 24px; font-weight: bold; text-align: center;">Welcome to RentSpace!</h2>
                <p style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 15px; line-height: 1.7; text-align: center;">Your account is ready. Discover premium furniture on flexible rental plans — no long-term commitments, no hassle.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                  <tr>
                    <td style="width: 33%; padding: 20px; background-color: #F8F4ED; border: 1px solid #E9DFD2; border-radius: 8px; text-align: center; vertical-align: top;">
                      <p style="margin: 0 0 10px 0; color: #2A7F74; font-size: 24px;">🚚</p>
                      <p style="margin: 0; color: #1A1A1A; font-size: 14px; font-weight: bold;">Free Delivery</p>
                      <p style="margin: 5px 0 0 0; color: #7A7A7A; font-size: 12px;">on all orders</p>
                    </td>
                    <td style="width: 1%;"></td>
                    <td style="width: 33%; padding: 20px; background-color: #F8F4ED; border: 1px solid #E9DFD2; border-radius: 8px; text-align: center; vertical-align: top;">
                      <p style="margin: 0 0 10px 0; color: #2A7F74; font-size: 24px;">📅</p>
                      <p style="margin: 0; color: #1A1A1A; font-size: 14px; font-weight: bold;">Flexible Plans</p>
                      <p style="margin: 5px 0 0 0; color: #7A7A7A; font-size: 12px;">short & long term</p>
                    </td>
                    <td style="width: 1%;"></td>
                    <td style="width: 33%; padding: 20px; background-color: #F8F4ED; border: 1px solid #E9DFD2; border-radius: 8px; text-align: center; vertical-align: top;">
                      <p style="margin: 0 0 10px 0; color: #2A7F74; font-size: 24px;">↩️</p>
                      <p style="margin: 0; color: #1A1A1A; font-size: 14px; font-weight: bold;">Easy Returns</p>
                      <p style="margin: 5px 0 0 0; color: #7A7A7A; font-size: 12px;">hassle free</p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background-color: #2A7F74; border-radius: 6px;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" style="display: inline-block; padding: 12px 28px; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: bold;">Start Exploring</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #E9DFD2; padding: 30px 40px; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #7A7A7A; font-size: 13px;">© 2025 RentSpace. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
  
  const text = `Welcome to RentSpace, ${user.name}!\n\nYour account is ready. Discover premium furniture on flexible rental plans — no long-term commitments, no hassle.\n\nFeatures:\n- Free Delivery on all orders\n- Flexible Plans — short & long term\n- Easy Returns — hassle free\n\nStart exploring at ${process.env.FRONTEND_URL || 'http://localhost:5173'}/products`;
  
  return await sendEmail({ to: user.email, subject, html, text });
};

/**
 * Order Status Update Email - Sent when order status changes
 */
export const sendOrderStatusEmail = async (user, order, newStatus) => {
  const statusMessages = {
    'processing': 'Your order is being processed!',
    'in-transit': 'Your order is on the way!',
    'delivered': 'Your order has been delivered!',
    'cancelled': 'Your order has been cancelled',
    'rejected': 'Your order has been rejected'
  };
  
  const statusColors = {
    'processing': '#f59e0b',
    'in-transit': '#3b82f6',
    'delivered': '#22c55e',
    'cancelled': '#ef4444',
    'rejected': '#6b7280'
  };
  
  const subject = `Order Update - ${order._id}`;
  const message = statusMessages[newStatus] || `Your order status: ${newStatus}`;
  const color = statusColors[newStatus] || '#333';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${color}; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Update</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size: 18px; color: ${color}; font-weight: bold;">${message}</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="color: ${color}; font-weight: bold;">${newStatus}</span></p>
          <p style="margin: 5px 0;"><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
           style="display: inline-block; background: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          View Order
        </a>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
        <p>&copy; 2024 Furniture Rental. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const text = `${message}\n\nOrder ID: ${order._id}\nNew Status: ${newStatus}\n\nView your order at ${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile`;
  
  return await sendEmail({ to: user.email, subject, html, text });
};

/**
 * Admin Notification - New Order
 */
export const sendAdminNewOrderNotification = async (order) => {
  const subject = `[RentSpace Admin] New order received — #${order._id}`;
  
  const itemsList = order.orderItems?.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E9DFD2;">${item.product?.name || 'Product'} × ${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E9DFD2; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}/month</td>
    </tr>
  `).join('') || '';
  
  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F4ED; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td style="background-color: #1A1A1A; padding: 30px 40px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: bold;">RentSpace — Admin Notification</h1>
              </td>
            </tr>
            <tr>
              <td style="background-color: #FFF3CD; padding: 20px 40px; border: 1px solid #D8CFBF; border-top: none;">
                <p style="margin: 0; color: #856404; font-size: 15px; font-weight: bold;">New order received — review and process.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #FFFFFF; padding: 40px; border: 1px solid #D8CFBF; border-top: none;">
                <h3 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 18px; font-weight: bold;">Order Details</h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                  <tr>
                    <td style="padding: 8px 0; color: #7A7A7A; font-size: 13px; width: 120px;">Order ID</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-size: 15px;">#${order._id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #7A7A7A; font-size: 13px;">Date</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-size: 15px;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #7A7A7A; font-size: 13px;">Customer</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-size: 15px;">${order.user?.name || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #7A7A7A; font-size: 13px;">Email</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-size: 15px;">${order.user?.email || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #7A7A7A; font-size: 13px;">Phone</td>
                    <td style="padding: 8px 0; color: #1A1A1A; font-size: 15px;">${order.user?.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #7A7A7A; font-size: 13px;">Payment</td>
                    <td style="padding: 8px 0; color: #2A7F74; font-size: 15px; font-weight: bold;">Paid — ${order.paymentMethod || 'UPI'} ✓</td>
                  </tr>
                </table>
                <h3 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 18px; font-weight: bold;">Items Ordered</h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                  ${itemsList}
                  <tr>
                    <td style="padding: 20px 0 0 0; color: #1A1A1A; font-size: 18px; font-weight: bold;">Total Collected</td>
                    <td style="padding: 20px 0 0 0; text-align: right; color: #2A7F74; font-size: 20px; font-weight: bold;">₹${order.totalPrice?.toLocaleString() || '0'}</td>
                  </tr>
                </table>
                <h3 style="margin: 0 0 15px 0; color: #1A1A1A; font-size: 18px; font-weight: bold;">Shipping Address</h3>
                <p style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 15px; line-height: 1.7;">${order.shippingAddress?.street || ''}<br>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background-color: #2A7F74; border-radius: 6px;">
                      <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/orders" style="display: inline-block; padding: 12px 28px; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: bold;">View in Dashboard</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #E9DFD2; padding: 30px 40px; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #7A7A7A; font-size: 13px;">Internal notification — do not forward.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
  
  const text = `[RentSpace Admin] New order received — #${order._id}\n\nOrder Details:\nOrder ID: #${order._id}\nDate: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}\nCustomer: ${order.user?.name}\nEmail: ${order.user?.email}\nPhone: ${order.user?.phone || 'N/A'}\nPayment: Paid — ${order.paymentMethod || 'UPI'}\n\nItems:\n${order.orderItems?.map(item => `- ${item.product?.name} × ${item.quantity} — ₹${item.price * item.quantity}/month`).join('\n') || ''}\n\nTotal Collected: ₹${order.totalPrice?.toLocaleString() || '0'}\n\nShipping Address:\n${order.shippingAddress?.street || ''}\n${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}\n\nView in dashboard at ${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/orders`;
  
  return await sendEmail({ to: FROM_EMAIL, subject, html, text });
};

/**
 * Password Reset Email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const subject = 'Reset your RentSpace password';
  
  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F4ED; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td style="background-color: #2A7F74; padding: 30px 40px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold; letter-spacing: 1px;">RentSpace</h1>
                <p style="margin: 5px 0 0 0; color: #E9DFD2; font-size: 14px;">Premium Furniture, Flexible Living</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #FFFFFF; padding: 40px; border: 1px solid #D8CFBF; border-top: none;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <div style="width: 60px; height: 60px; background-color: #E9DFD2; border-radius: 50%; display: inline-block; line-height: 60px; text-align: center;">
                        <span style="color: #2A7F74; font-size: 36px; font-weight: bold;">🔒</span>
                      </div>
                    </td>
                  </tr>
                </table>
                <h2 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 24px; font-weight: bold; text-align: center;">Reset your password</h2>
                <p style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 15px; line-height: 1.7; text-align: center;">Hi ${user.name}, we received a request to reset the password on your RentSpace account. Click below to set a new password.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
                  <tr>
                    <td style="background-color: #2A7F74; border-radius: 6px;">
                      <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: bold;">Reset Password</a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 20px 0; color: #7A7A7A; font-size: 13px; text-align: center;">This link expires in 24 hours.</p>
                <p style="margin: 0; color: #7A7A7A; font-size: 13px; text-align: center;">If you didn't request this, you can safely ignore this email — your password will not change.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #E9DFD2; padding: 30px 40px; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #7A7A7A; font-size: 13px;">© 2025 RentSpace. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
  
  const text = `Reset your RentSpace password\n\nHi ${user.name},\n\nWe received a request to reset the password on your RentSpace account. Click below to set a new password:\n\n${resetUrl}\n\nThis link expires in 24 hours.\n\nIf you didn't request this, you can safely ignore this email — your password will not change.`;
  
  return await sendEmail({ to: user.email, subject, html, text });
};

/**
 * New Collection Email - Newsletter for new arrivals
 */
export const sendNewCollectionEmail = async (user, collectionName = 'Summer 2025 Collection') => {
  const subject = `New arrival — ${collectionName} is here!`;
  
  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F4ED; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td style="background-color: #2A7F74; padding: 30px 40px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold; letter-spacing: 1px;">RentSpace</h1>
                <p style="margin: 5px 0 0 0; color: #E9DFD2; font-size: 14px;">Premium Furniture, Flexible Living</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #FFFFFF; padding: 40px; border: 1px solid #D8CFBF; border-top: none;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                  <tr>
                    <td style="background-color: #2A7F74; padding: 8px 20px; border-radius: 20px;">
                      <span style="color: #FFFFFF; font-size: 13px; font-weight: bold;">New Arrival</span>
                    </td>
                  </tr>
                </table>
                <h2 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 24px; font-weight: bold; text-align: center;">${collectionName}</h2>
                <p style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 15px; line-height: 1.7; text-align: center;">Fresh styles are in. Light fabrics, bold designs, and pieces built for the season — explore before they're gone.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                  <tr>
                    <td style="width: 50%; padding: 10px; vertical-align: top;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #F8F4ED; padding: 20px; border: 1px solid #D8CFBF; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px; font-weight: bold;">Linen Sofa Set</p>
                            <p style="margin: 0; color: #2A7F74; font-size: 14px; font-weight: bold;">From ₹1,899/month</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="width: 50%; padding: 10px; vertical-align: top;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #F8F4ED; padding: 20px; border: 1px solid #D8CFBF; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px; font-weight: bold;">Rattan Accent Chair</p>
                            <p style="margin: 0; color: #2A7F74; font-size: 14px; font-weight: bold;">From ₹699/month</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 50%; padding: 10px; vertical-align: top;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #F8F4ED; padding: 20px; border: 1px solid #D8CFBF; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px; font-weight: bold;">Marble Coffee Table</p>
                            <p style="margin: 0; color: #2A7F74; font-size: 14px; font-weight: bold;">From ₹499/month</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="width: 50%; padding: 10px; vertical-align: top;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #F8F4ED; padding: 20px; border: 1px solid #D8CFBF; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px; font-weight: bold;">Wooden Study Desk</p>
                            <p style="margin: 0; color: #2A7F74; font-size: 14px; font-weight: bold;">From ₹799/month</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background-color: #2A7F74; border-radius: 6px;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" style="display: inline-block; padding: 12px 28px; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: bold;">Shop the Collection</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #E9DFD2; padding: 30px 40px; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #7A7A7A; font-size: 13px;">© 2025 RentSpace. All rights reserved.</p>
                <p style="margin: 15px 0 0 0; color: #7A7A7A; font-size: 12px;">
                  <a href="#" style="color: #7A7A7A; text-decoration: underline;">Unsubscribe</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
  
  const text = `New arrival — ${collectionName} is here!\n\nFresh styles are in. Light fabrics, bold designs, and pieces built for the season — explore before they're gone.\n\nFeatured Products:\n- Linen Sofa Set — From ₹1,899/month\n- Rattan Accent Chair — From ₹699/month\n- Marble Coffee Table — From ₹499/month\n- Wooden Study Desk — From ₹799/month\n\nShop the collection at ${process.env.FRONTEND_URL || 'http://localhost:5173'}/products`;
  
  return await sendEmail({ to: user.email, subject, html, text });
};

/**
 * Verification OTP Email - Sent for email verification
 */
export const sendVerificationEmail = async (email, otp) => {
  const subject = 'Verify your RentSpace email';

  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F4ED; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td style="background-color: #2A7F74; padding: 30px 40px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold; letter-spacing: 1px;">RentSpace</h1>
                <p style="margin: 5px 0 0 0; color: #E9DFD2; font-size: 14px;">Premium Furniture, Flexible Living</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #FFFFFF; padding: 40px; border: 1px solid #D8CFBF; border-top: none;">
                <h2 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 24px; font-weight: bold;">Verify Your Email</h2>
                <p style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;">
                  Your RentSpace verification OTP is <strong style="color: #2A7F74; font-size: 20px;">${otp}</strong>.
                </p>
                <p style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;">
                  This OTP is valid for 5 minutes.
                </p>
                <p style="margin: 0; color: #7A7A7A; font-size: 14px; line-height: 1.5;">
                  If you didn't request this OTP, please ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #E9DFD2; padding: 30px 40px; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #7A7A7A; font-size: 13px;">© 2025 RentSpace. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const text = `Verify Your Email\n\nYour RentSpace verification OTP is ${otp}.\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this OTP, please ignore this email.`;

  return await sendEmail({ to: email, subject, html, text });
};

/**
 * Order Confirmation Email - PART 5: Send order confirmation with invoice
 */
export const sendOrderConfirmationEmail = async (user, order) => {
  const subject = 'RentSpace Order Confirmation';
  const { _id, orderItems, totalPrice, status, createdAt, paymentMethod, shippingAddress, rentalDuration } = order;
  
  const itemsHtml = orderItems?.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product?.name || 'Product'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.monthlyRent || item.price || 0).toLocaleString()}/mo</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${((item.monthlyRent || item.price || 0) * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('') || '';

  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F4ED; font-family: Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background-color: #2A7F74; padding: 30px 40px;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: bold;">RentSpace</h1>
                <p style="margin: 5px 0 0 0; color: #E9DFD2; font-size: 14px;">Premium Furniture, Flexible Living</p>
              </td>
            </tr>
            
            <!-- Success Message -->
            <tr>
              <td style="background-color: #E8F5E9; padding: 20px 40px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
                <h2 style="margin: 0; color: #1D9E75; font-size: 24px; font-weight: bold;">Order Placed Successfully!</h2>
                <p style="margin: 10px 0 0 0; color: #555;">Hi ${user?.name || 'Customer'}, your furniture rental order has been confirmed.</p>
              </td>
            </tr>
            
            <!-- Order Details -->
            <tr>
              <td style="background-color: #FFFFFF; padding: 30px 40px; border-left: 1px solid #D8CFBF; border-right: 1px solid #D8CFBF;">
                <h3 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 18px; border-bottom: 2px solid #2A7F74; padding-bottom: 10px;">Order Details</h3>
                <table width="100%" style="margin-bottom: 20px;">
                  <tr><td style="padding: 8px 0; color: #666;">Order ID</td><td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1A1A1A;">#${_id?.slice(-8)?.toUpperCase()}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Payment Status</td><td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1D9E75;">PAID</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Rental Duration</td><td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1A1A1A;">${rentalDuration || '3 months'}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Payment Method</td><td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1A1A1A;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td></tr>
                </table>
                
                <h3 style="margin: 30px 0 15px 0; color: #1A1A1A; font-size: 18px; border-bottom: 2px solid #2A7F74; padding-bottom: 10px;">Items Ordered</h3>
                <table width="100%" style="border-collapse: collapse;">
                  <tr style="background-color: #f5f5f5;">
                    <th style="padding: 12px; text-align: left;">Item</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                    <th style="padding: 12px; text-align: right;">Total</th>
                  </tr>
                  ${itemsHtml}
                </table>
              </td>
            </tr>
            
            <!-- Receipt Summary -->
            <tr>
              <td style="background-color: #F8F4ED; padding: 30px 40px; border-left: 1px solid #D8CFBF; border-right: 1px solid #D8CFBF;">
                <h3 style="margin: 0 0 15px 0; color: #1A1A1A; font-size: 18px;">Receipt Summary</h3>
                <table width="100%">
                  <tr><td style="padding: 8px 0; color: #666;">Subtotal</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">₹${(totalPrice * 0.9).toLocaleString()}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Delivery Fee</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${totalPrice > 5000 ? 'FREE' : '₹299'}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Security Deposit (Refundable)</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">₹${(totalPrice * 0.1).toLocaleString()}</td></tr>
                  ${discount > 0 ? `<tr><td style="padding: 8px 0; color: #1D9E75;">Discount</td><td style="padding: 8px 0; text-align: right; font-weight: 500; color: #1D9E75;">-₹'0'</td></tr>` : ''}
                  <tr><td colspan="2" style="border-top: 2px solid #2A7F74; padding-top: 15px;"></td></tr>
                  <tr><td style="padding: 10px 0; font-size: 18px; font-weight: bold; color: #1A1A1A;">TOTAL AMOUNT</td><td style="padding: 10px 0; text-align: right; font-size: 20px; font-weight: bold; color: #1D9E75;">₹${totalPrice.toLocaleString()}</td></tr>
                </table>
              </td>
            </tr>
            
            <!-- Delivery Address -->
            <tr>
              <td style="background-color: #FFFFFF; padding: 30px 40px; border-left: 1px solid #D8CFBF; border-right: 1px solid #D8CFBF;">
                <h3 style="margin: 0 0 15px 0; color: #1A1A1A; font-size: 18px; border-bottom: 2px solid #2A7F74; padding-bottom: 10px;">Delivery Address</h3>
                <p style="margin: 0; color: #555; line-height: 1.6;">
                  ${user?.name || 'Customer'}<br>
                  ${shippingAddress?.houseNo || ''}, ${shippingAddress?.street || ''}<br>
                  ${shippingAddress?.city || ''}, ${shippingAddress?.state || ''} - ${shippingAddress?.pincode || ''}<br>
                  Phone: ${user?.phone || ''}
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #E9DFD2; padding: 30px 40px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #7A7A7A; font-size: 13px;">© 2025 RentSpace. All rights reserved.</p>
                <p style="margin: 0; color: #7A7A7A; font-size: 12px;">Questions? Contact us at support@rentspace.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const text = `RentSpace Order Confirmation\n\nHi ${user?.name || 'Customer'},\n\nYour order #${_id?.slice(-8)} has been placed successfully!\n\nOrder Details:\n${orderItems?.map(i => `- ${i.product?.name || 'Product'} x${i.quantity}: ₹${((i.monthlyRent || i.price || 0)*i.quantity).toLocaleString()}`).join('\n') || ''}\n\nTotal: ₹${totalPrice?.toLocaleString()}\nDelivery Address: ${shippingAddress?.houseNo || ''}, ${shippingAddress?.street || ''}, ${shippingAddress?.city || ''}, ${shippingAddress?.state || ''} - ${shippingAddress?.pincode || ''}\n\nThank you for choosing RentSpace!`;

  return await sendEmail({ to: user?.email, subject, html, text });
};
