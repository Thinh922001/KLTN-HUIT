import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { stringify } from 'csv-stringify/sync';
// import { Readable } from 'stream';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to, // Người nhận
        subject, // Tiêu đề
        text: content, // Nội dung văn bản
        html: `<p>${content}</p>`, // Nội dung HTML
      });
      console.log('Mail sent successfully!');
    } catch (error) {
      console.error('Error sending mail:', error);
    }
  }

  /**
   * Gửi thông báo đơn hàng mới có hình ảnh sản phẩm và mã giảm giá
   * @param adminEmail - Email người quản trị
   * @param orderDetails - Thông tin đơn hàng
   */
  async sendNewOrderNotification(
    adminEmails: string[],
    orderDetails: {
      userName: string;
      phone: string;
      products: { image: string; name: string; quantity: number; price: number }[];
      totalPrice: number;
      discountCode: string;
      discountAmount: number;
      finalTotal: number;
      orderId: string;
    }
  ) {
    try {
      const { userName, phone, products, totalPrice, discountCode, discountAmount, finalTotal, orderId } = orderDetails;

      // Tạo danh sách sản phẩm
      const productList = products
        .map(
          (product: any, index: number) => `
            <tr>
              <td style="padding: 10px;">
                <img src="${product.image}" alt="${
            product.name
          }" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;" />
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

      // Gửi email thông báo
      await this.mailerService.sendMail({
        to: adminEmails,
        subject: `Đơn hàng mới ${orderId} từ ${userName}`,
        html: `
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
        `,
      });
    } catch (error) {
      console.error('Lỗi khi gửi email thông báo đơn hàng mới:', error);
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
