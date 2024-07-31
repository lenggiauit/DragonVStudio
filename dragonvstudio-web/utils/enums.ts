export enum ResultCode {
  Invalid = -2,
  Unknown = -1,
  UnAuthorized = 0,
  Success = 1,
  Valid = 11,
  Error = 2,
  RegisterExistEmail = 3,
  RegisterExistUserName = 4,
  NotExistUser = 5,
  NotExistEmail = 51,
  Expired = 6,
  DoNotPermission = 7,
  BookingDateIsInvalid = 8,
  ExistingItem = 91,
}

export enum DisplayType {
  Grid = 1,
  List = 2,
}
