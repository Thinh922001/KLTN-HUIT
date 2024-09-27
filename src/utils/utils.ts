import { genSalt } from "bcrypt";

export async function saltHasPassword(num: number = 10) {
    const salt = await genSalt(num);
    return salt;
  }