import * as bcrypt from "bcrypt";

export async function generatePasswordHash(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswordAndHashe(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
