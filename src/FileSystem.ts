import fs from "fs";
import path from "path";

export default class FileSystem {
  static writeSync(file: string, data: string) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, data);
  }
}
