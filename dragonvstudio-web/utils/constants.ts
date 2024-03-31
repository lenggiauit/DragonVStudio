export enum GlobalKeys {
  LoggedUserKey = 'loggedUserKey_pm',
  EncryptKey = 'encryptKey',
  LanguageSelectedKey = 'naStories-lang',
  NoAvatarUrl = '/assets/images/Avatar.png',
  NoImageUrl = '/static/images/no-image.png',
  ProjectStatus = 'ProjectStatusKey',
  NoTemplateImageUrl = '/assets/images/no_template_image.jpg',
  NoThumbnailUrl = '/assets/images/no_thumbnail_image.jpg',
}
export enum Locale {
  English = 'English',
  VietNam = 'Việt Nam',
}

export enum PermissionKeys {
  Admin = 'Admin',
  CreateEditCategory = 'CreateEditCategory',
  CreateEditBlogPost = 'CreateEditBlogPost',
  ManageUser = 'ManageUser',
  CreateEditBooking = 'CreateEditBooking',
  GetPrivateTalkList = 'GetPrivateTalkList',
  UpdatePrivateTalkStatus = 'UpdatePrivateTalkStatus',
  RemovePrivateTalk = 'RemovePrivateTalk',
}

export enum PrivateTalkEnumStatus {
  Submitted = 'Chờ Email xác nhận',
  RequestPay = 'Chờ thanh toán',
  Paid = 'Đã thanh toán',
  Confirmed = 'Đã xác nhận lịch hẹn',
  Completed = 'Hoàn thành',
  Canceled = 'Đã hủy',
  Pending = 'Chờ xác nhận',
}

export enum MockInterviewEnumStatus {
  Submitted = 'Chờ Email xác nhận',
  RequestPay = 'Chờ thanh toán',
  Paid = 'Đã thanh toán',
  Confirmed = 'Đã xác nhận lịch hẹn',
  Completed = 'Hoàn thành',
  Canceled = 'Đã hủy',
  Pending = 'Chờ xác nhận',
}
