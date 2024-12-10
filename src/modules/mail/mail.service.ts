import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import { stringify } from 'csv-stringify/sync';
// import { Readable } from 'stream';

@Injectable()
export class MailService {
  constructor() {}

  async sendOrderEmail(orderDetails: any) {
    const { userName, phone, products, totalPrice, discountCode, discountAmount, finalTotal, orderId, adminEmails } =
      orderDetails;

    // Tạo danh sách sản phẩm
    const productList = products
      .map(
        (product: any) => `
          <tr>
            <td style="padding: 10px;">
              <img src="${product.image}" alt="${product.name}" 
                style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;" />
            </td>
            <td style="padding: 10px;">${product.name}</td>
            <td style="padding: 10px;">${product.quantity}</td>
            <td style="padding: 10px;">${product.price.toLocaleString()} VND</td>
          </tr>
        `
      )
      .join('');

    // Thông tin mã giảm giá (nếu có)
    const discountInfo = discountCode
      ? `
        <p><strong>Mã giảm giá:</strong> ${discountCode}</p>
        <p><strong>Giá trị giảm:</strong> ${discountAmount.toLocaleString()} VND</p>
      `
      : '';

    // Nội dung HTML của email
    const emailHtml = `
      <h2>Thông báo đơn hàng mới</h2>
      <p><strong>Khách hàng:</strong> ${userName}</p>
      <p><strong>SĐT khách hàng:</strong> ${phone}</p>
      <h3>Chi tiết đơn hàng:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border-bottom: 2px solid #ccc; text-align: left; padding: 10px;">Hình ảnh</th>
            <th style="border-bottom: 2px solid #ccc; text-align: left; padding: 10px;">Sản phẩm</th>
            <th style="border-bottom: 2px solid #ccc; text-align: left; padding: 10px;">Số lượng</th>
            <th style="border-bottom: 2px solid #ccc; text-align: left; padding: 10px;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${productList}
        </tbody>
      </table>
      <p><strong>Tổng giá trị đơn hàng:</strong> ${totalPrice.toLocaleString()} VND</p>
      ${discountInfo}
      <p><strong>Tổng giá trị cuối cùng:</strong> ${finalTotal.toLocaleString()} VND</p>
      <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
      <p>Vui lòng đăng nhập vào hệ thống để xử lý đơn hàng.</p>
    `;

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        'https://kltnservicemail-production.up.railway.app/send-email',
        {
          to: adminEmails.join(','),
          subject: `Đơn hàng mới ${orderId} từ ${userName}`,
          text: emailHtml,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.your_secure_api_key,
          },
        }
      );
    } catch (error) {
      console.error('Lỗi khi gửi email:', error.response?.data || error.message);
    }
  }

  // private async generateCsvBuffer(data: any[]): Promise<Buffer> {
  //   try {
  //     const csvContent = stringify(data, {
  //       header: true,
  //       columns: {
  //         name: 'Tên Sản Phẩm',
  //         quantity: 'Số Lượng',
  //         revenue: 'Doanh Thu (VND)',
  //       },
  //     });

  //     return Buffer.from(csvContent, 'utf-8');
  //   } catch (error) {
  //     console.error('Lỗi khi tạo CSV buffer:', error);
  //     throw error;
  //   }
  // }

  // async sendDailyRevenueReport(emails: string[], reportData: any) {
  //   const { totalSales, totalOrders, date, topProducts } = reportData;

  //   // Tạo buffer CSV từ dữ liệu sản phẩm
  //   const csvBuffer = await this.generateCsvBuffer(topProducts);

  //   const htmlContent = `
  //     <h2>Báo Cáo Doanh Thu Ngày ${date}</h2>
  //     <p><strong>Tổng Doanh Thu:</strong> ${totalSales.toLocaleString()} VND</p>
  //     <p><strong>Tổng Số Đơn Hàng:</strong> ${totalOrders}</p>
  //     <p>Báo cáo chi tiết được đính kèm trong file CSV.</p>
  //   `;

  //   try {
  //     await this.mailerService.sendMail({
  //       to: emails,
  //       subject: `Báo Cáo Doanh Thu Ngày ${date}`,
  //       html: htmlContent,
  //       attachments: [
  //         {
  //           filename: `daily_report_${date}.csv`,
  //           content: csvBuffer, // Đính kèm buffer CSV
  //         },
  //       ],
  //     });

  //     console.log('Email báo cáo đã được gửi thành công!');
  //   } catch (error) {
  //     console.error('Lỗi khi gửi email báo cáo doanh thu:', error);
  //   }
  // }
}
