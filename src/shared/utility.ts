import {v4 as uuidV4} from "uuid";

export class Utility {
  static isUndefined(object: any) {
    return object === null || object === undefined
  };

  static isDefined(object: any) {
    return !Utility.isUndefined(object)
  };

  static createUniqueRandomAlphaNumericId() {
    return uuidV4().replace(/-/g, "");
  };
}
