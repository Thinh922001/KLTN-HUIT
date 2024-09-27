export enum AUTH_TYPE {
  USER_PASSWORD = 1,
  PHONE = 2,
  SNS = 3,
}

export enum SNS_TYPE {
  FACEBOOK = 1,
  GOOGLE = 2,
  APPLE = 3,
  LINE = 4,
}

export enum GENDERS {
  FEMALE = 0,
  MALE = 1,
  OTHER = 2,
}

export interface IItemInfo {
  /*
  trans Vn : Quy cách
  */
  specifications?: string;

  /*
  trans Vn : sản xuất tại
  */
  madeIn?: string;

  /*
  trans Vn : thương hiệu
  */
  tradeMark?: string;
}

export enum ERoles {
  DOCTOR = 1,
  USER = 2,
}

export interface IChatInfo {
  [date: string]: {
    message: string;
    role: ERoles;
  };
}
