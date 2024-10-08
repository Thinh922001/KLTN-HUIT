import { genSalt } from 'bcrypt';
import { PagingDto } from '../vendors/dto/pager.dto';
import { SelectQueryBuilder } from 'typeorm';

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
  const itemCount = await query.getCount();
  query.take(take).skip(skip);
  const { entities } = await query.getRawAndEntities();
  const paging = new PagingDto(itemCount, { take, skip });
  return {
    data: entities,
    paging,
  };
};
