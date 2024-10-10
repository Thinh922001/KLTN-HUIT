import { ISpecifications } from '../../vendors/base/type';
import { IBreadCrumb } from '../../vendors/types';

export const BaseBreadCrumb: IBreadCrumb[] = [
  {
    link: '/',
    name: 'Trang chủ',
  },
];

export const SpecData: ISpecifications[] = [
  {
    name: 'Màn hình',
    values: [
      {
        name: 'Công nghệ màn hình',
        desc: ['Chính: Dynamic AMOLED 2X Phụ: Super AMOLED'],
      },
      {
        name: 'Độ phân giải',
        desc: ['Chính: FHD+ (1080 x 2640 Pixels) Phụ: HD+ (720 x 748 Pixels)'],
      },
      {
        name: 'Màn hình rộng',
        desc: ['6.7" - Tần số quét 120 Hz'],
      },
      {
        name: 'Độ sáng tối đa',
        desc: ['2000 nits'],
      },
      {
        name: 'Mặt kính cảm ứng',
        desc: ['Kính cường lực Ceramic Shield'],
      },
    ],
  },
  {
    name: 'Camera sau',
    values: [
      {
        name: 'Độ phân giải',
        desc: ['Chính 48 MP & Phụ 12 MP, 12 MP'],
      },
      {
        name: 'Quay phim',
        desc: [
          'HD 720p@30fps',
          'FullHD 1080p@60fps',
          'FullHD 1080p@30fps',
          'FullHD 1080p@25fps',
          'FullHD 1080p@240fps',
          'FullHD 1080p@120fps',
          '4K 2160p@60fps',
          '4K 2160p@30fps',
          '4K 2160p@25fps',
          '4K 2160p@24fps',
        ],
      },
      {
        name: 'Đèn Flash',
        desc: ['Có'],
      },
      {
        name: 'Tính năng',
        desc: [
          'Ảnh Raw',
          'Zoom quang học',
          'Zoom kỹ thuật số',
          'Xóa phông',
          'Trôi nhanh thời gian (Time Lapse)',
          'Toàn cảnh (Panorama)',
          'Smart HDR 5',
          'Siêu độ phân giải',
          'Siêu cận (Macro)',
          'Quay video ProRes',
          'Quay chậm (Slow Motion)',
          'Live Photos',
          'Góc siêu rộng (Ultrawide)',
          'Dolby Vision HDR',
          'Deep Fusion',
          'Cinematic',
          'Chống rung quang học (OIS)',
          'Chân dung đêm',
          'Bộ lọc màu',
          'Ban đêm (Night Mode)',
          'Photonic Engine',
        ],
      },
    ],
  },
  {
    name: 'Camera trước',
    values: [
      {
        name: 'Độ phân giải',
        desc: ['12Mp'],
      },
      {
        name: 'Tính năng',
        desc: [
          'Smart HDR 5',
          'Xóa phông',
          'Trôi nhanh thời gian (Time Lapse)',
          'Retina Flash',
          'Quay video ProRes',
          'Quay video Full HD',
          'Quay video 4K',
          'Quay chậm (Slow Motion)',
          'Nhãn dán (AR Stickers)',
          'Live Photos',
          'Deep Fusion',
          'Cinematic',
          'Chụp đêm',
          'Chống rung điện tử kỹ thuật số (EIS)',
          'Bộ lọc màu',
          'TrueDepth',
          'Photonic Engine',
        ],
      },
    ],
  },
  {
    name: 'Hệ điều hành & CPU',
    values: [
      {
        name: 'Hệ điều hành',
        desc: ['IOS 17'],
      },
      {
        name: 'Chip xử lý (CPU)',
        desc: ['Apple A17 Pro 6 nhân'],
      },
      {
        name: 'Tốc độ CPU',
        desc: ['3.78 GHz'],
      },
      {
        name: 'Chip đồ họa (GPU)',
        desc: ['Apple GPU 6 nhân'],
      },
    ],
  },
  {
    name: 'Bộ nhớ & lưu trữ',
    values: [
      {
        name: 'RAM',
        desc: ['8GB'],
      },
      {
        name: 'Dung lượng lưu trữ',
        desc: ['256GB'],
      },
      {
        name: 'Dung lượng còn lại (khả dụng) khoảng',
        desc: ['241 GB'],
      },
      {
        name: 'Danh bạ',
        desc: ['Không giới hạn'],
      },
    ],
  },
  {
    name: 'Kết nối',
    values: [
      {
        name: 'Mạng di động',
        desc: ['Hỗ trợ 5G'],
      },
      {
        name: 'SIM',
        desc: ['1 Nano SIM & 1 eSIM'],
      },
      {
        name: 'Wifi',
        desc: ['Wi-Fi MIMO', 'Wi-Fi 802.11 a/b/g/n/ac/ax', '6 GHz'],
      },
      {
        name: 'GPS',
        desc: ['QZSS', 'NavIC', 'GPS', 'GLONASS', 'GALILEO', 'BEIDOU'],
      },
      {
        name: 'Bluetooth',
        desc: ['v5.3'],
      },
      {
        name: 'Cổng kết nối/sạc',
        desc: ['Type-C'],
      },
      {
        name: 'Jack tai nghe',
        desc: ['Type-C'],
      },
      {
        name: 'Kết nối khác',
        desc: ['NFC'],
      },
    ],
  },
  {
    name: 'Pin & sạc',
    values: [
      {
        name: 'Dung lượng pin',
        desc: ['4422 mAh'],
      },
      {
        name: 'Loại Pin',
        desc: ['Li-Ion'],
      },
      {
        name: 'Hỗ trợ sạc tối đa',
        desc: ['20 W'],
      },
      {
        name: 'Công nghệ pin',
        desc: ['Tiết kiệm pin', 'Sạc pin nhanh', 'Sạc ngược qua cáp', 'Sạc không dây MagSafe', 'Sạc không dây'],
      },
    ],
  },
  {
    name: 'Tiện ích',
    values: [
      {
        name: 'Bảo mật nâng cao',
        desc: ['Mở khoá khuôn mặt Face ID'],
      },
      {
        name: 'Tính năng đặc biệt',
        desc: [
          'Âm thanh Dolby Atmos',
          'Phát hiện va chạm (Crash Detection)',
          'Màn hình luôn hiển thị AOD',
          'Loa kép',
          'HDR10',
          'DCI-P3',
          'Công nghệ True Tone',
          'Công nghệ hình ảnh Dolby Vision',
          'Công nghệ',
          'Chạm 2 lần sáng màn hình',
          'Apple Pay',
        ],
      },
      {
        name: 'Kháng nước, bụi',
        desc: ['IP68'],
      },
      {
        name: 'Ghi âm',
        desc: ['Ghi âm mặc định'],
      },
      {
        name: 'Xem phim',
        desc: ['H.264(MPEG4-AVC)', 'AV1', 'ProRes', 'HEVC'],
      },
      {
        name: 'Nghe nhạc',
        desc: ['MP3', 'FLAC', 'AAC'],
      },
    ],
  },
  {
    name: 'Thông tin chung',
    values: [
      {
        name: 'Thiết kế',
        desc: ['Nguyên khối'],
      },
      {
        name: 'Chất liệu',
        desc: ['Khung Titan & Mặt lưng kính cường lực'],
      },
      {
        name: 'Kích thước, khối lượng',
        desc: ['Dài 159.9 mm - Ngang 76.7 mm - Dày 8.25 mm - Nặng 221 g'],
      },
      {
        name: 'Thời điểm ra mắt',
        desc: ['09/2023'],
      },
      {
        name: 'Hãng',
        desc: ['Apple'],
      },
    ],
  },
];
