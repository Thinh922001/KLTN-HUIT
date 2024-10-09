import { genSalt } from 'bcrypt';
import { PagingDto } from '../vendors/dto/pager.dto';
import { SelectQueryBuilder } from 'typeorm';
import { Variant } from '../vendors/base/type';

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
