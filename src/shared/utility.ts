export class Utility {
  static isUndefined(object: any) {
    return object === null || object === undefined
  };

  static isDefined(object: any) {
    return !Utility.isUndefined(object)
  };
}
