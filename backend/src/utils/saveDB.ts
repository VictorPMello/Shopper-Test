import { readFile, writeFileSync, existsSync, readFileSync } from "fs";
import { join } from 'path';

const filePath = join(process.cwd(), '../datasbase.json')

export const loadData = () => {
  if (!existsSync(filePath)) return []

  const data = readFileSync(filePath, 'utf-8');

  return JSON.parse(data)
}

export const saveData = (data: any): void => writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")

