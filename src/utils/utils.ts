import { genSalt } from 'bcrypt';
import { PagingDto } from '../vendors/dto/pager.dto';
import { SelectQueryBuilder } from 'typeorm';
import { Variant } from '../vendors/base/type';
import { CouponEntity } from '../entities';
import { EntityTarget } from 'typeorm';
import dataSource from '../../typeOrm.config';

export async function saltHasPassword(num: number = 10) {
  const salt = await genSalt(num);
  return salt;
}

export const isJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

export const convertAnyTo = <T extends Object>(str: T) => {
  let obj: T;
  if (typeof str === 'string' && isJSON(str)) {
    obj = JSON.parse(str);
  }

  if (typeof str === 'object') {
    obj = str;
  }

  return (obj as T) || ({} as T);
};

export const applyPagination = async <T>(
  query: SelectQueryBuilder<T>,
  take: number,
  skip: number
): Promise<{ data: T[]; paging: PagingDto }> => {
  query.take(take).skip(skip);
  const [entities, itemCount] = await query.getManyAndCount();

  const paging = new PagingDto(itemCount, { take, skip });
  return {
    data: entities,
    paging,
  };
};

export const removeVietnameseTones = (str) => {
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
  return str;
};

export const formatString = (str) => {
  let formattedStr = str.replace(/\s+/g, '-');

  formattedStr = removeVietnameseTones(formattedStr);

  formattedStr = formattedStr.toUpperCase();

  return formattedStr;
};

export const generateCombinationsVariant = (variations: Variant[]) => {
  let combinations = [{}];

  variations.forEach((variation) => {
    const newCombinations = [];

    combinations.forEach((combination) => {
      variation.options.forEach((option) => {
        const newCombination = {
          ...combination,
          [variation.name]: option,
        };
        newCombinations.push(newCombination);
      });
    });

    combinations = newCombinations;
  });

  return combinations;
};

export const generateSKUCode = (combination) => {
  return Object.values(combination).join('-').toUpperCase();
};

export const convertHttpToHttps = (url) => {
  if (typeof url !== 'string') {
    console.error('URL phải là một chuỗi.');
    return url;
  }
  // Kiểm tra xem URL có bắt đầu bằng "http://" hay không
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

export const generateRandomCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPMsg = (code: string): string => {
  if (!code) {
    throw new Error('Mã OTP không hợp lệ');
  }

  const msg = `Mã OTP của bạn là ${code}. Mã có hiệu lực trong 1 phút. Vui lòng không chia sẻ mã này với người khác.`;
  return msg;
};

export const hidePhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length < 4) {
    return phoneNumber;
  }
  const lastFourDigits = phoneNumber.slice(-4);
  const hiddenPart = phoneNumber.slice(0, -4).replace(/\d/g, 'x');
  return hiddenPart + lastFourDigits;
};

export const calculateDiscountedAmount = (coupon: CouponEntity, totalAmount: number): number => {
  if (coupon.discount_type === 'percentage') {
    return totalAmount * (1 - coupon.discount_value / 100);
  } else if (coupon.discount_type === 'amount') {
    return totalAmount - coupon.discount_value;
  }
  return totalAmount;
};

export const getTableName = <Entity>(entity: EntityTarget<Entity>): string => {
  if (!dataSource.isInitialized) {
    throw new Error('DataSource chưa được khởi tạo');
  }
  return dataSource.getMetadata(entity).tableName;
};
