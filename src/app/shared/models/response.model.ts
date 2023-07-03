/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

export class UrlBuilder {
  static build(url: string, actionType: ActionType) {
    switch (actionType) {
      case 'LIST':
        return url + '/list';
      case 'CREATE':
        return url + '/create';
      case 'ADD':
        return url + '/add';
      case 'UPDATE':
        return url + '/update';
      case 'EDIT':
        return url + '/edit';
      case 'DELETE':
        return url + '/delete';
      case 'REMOVE':
        return url + '/remove';
      case 'ATTACHMENTS':
        return url + '/attachments';
      case 'DOWNLOAD':
        return url + '/download';
      case 'APPROVE':
        return url + '/approve';
      case 'REJECT':
        return url + '/reject';
      case 'DETAIL':
        return url + '/slave/list';
      case 'SEARCH':
        return url + '/search';
      case 'AMENDMENT':
        return url + '/amendment';
      case 'TREE':
        return url + '/tree';
      case '':
        return url + '';
      case 'REFFER':
        return url + '/reffer';
      default:
        return url + '/list';
    }
  }
}

export type ActionType =
  | 'LIST'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ATTACHMENTS'
  | 'DOWNLOAD'
  | 'APPROVE'
  | 'REJECT'
  | 'DETAIL'
  | 'AMENDMENT'
  | 'SEARCH'
  | 'ADD'
  | 'EDIT'
  | 'REMOVE'
  | 'TREE'
  | 'REFFER'
  | '';

/** اطلاعات صفحه بندی */
export class Pagination {
  /** شماره صفحه مورد نظر */
  pageNumber!: number;

  /** تعداد ردیف مورد درخواست در صفحه */
  pageSize!: number;
}

/** حالت پیش فرض جواب  */
export class BaseResponse<type> {
  /** وضعیت انجام عملیات */
  successed!: boolean;

  /** متن خظا در صورت انجام نشدن عمیات */
  message!: string;

  /** کد خظا در صورت انجام نشدن عمیات */
  errorCode!: number;

  /** نتیجه عملیات */
  data!: {
    /** فهرست فیلدها */
    result?: type;

    /** توکن*/
    token?: string;

    /** تعداد کل اطلاعات */
    totalCount?: number;

    permision?: type;
  };
}

/** ورود */
export class Account {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Account';
}

/** عناوین */
export class Subject {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/master';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** نام لاتین */
  enName!: string;

  localCode!: number;
}

/** اطلاعات پایه */
export class Basics {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/BaseInfo/master';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** کد */
  code!: string;

  /** شناسه نوع */
  masterId!: number;
}

/** اطلاعات پایه */
export class CreateBasics {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/BaseInfo/slave/create';
}

/** تاییدات */
export class Confirmation {
  /** آدرس سرویس */
  static readonly apiAddress = '';

  /** شناسه */
  id!: number;

  /** نماد */
  symbol!: string;

  /** نام شرکت */
  companyName!: string;

  /** عنوان اطلاعیه */
  description!: string;

  /** کد */
  advertisementTypeId!: string;

  /** زمان ارسال */
  sendDate!: string;

  /** وضعیت اطلاعیه */
  adverStatus!: string;
}

/** کاربرها */
export class Person {
  /** آدرس سرویس */
  static readonly apiAddress: string = 'api/v1/info/person/list';

  /** شناسه */
  id!: number;

  /** نام */
  firstName!: string;

  /** نام خانوادگی */
  lastName!: string;

  /** نام پدر */
  fatherName!: string;

  /** جنسیت */
  genderType!: boolean;

  /** کد ملی */
  nationalId!: string;

  /** تاریخ تولد */
  birthDate!: Date;

  /** شماره شناسنامه */
  birthCertificateNumber!: string;

  /** نام کاربری */
  userName!: string;

  /** نام کاربری */
  password!: string;

  /** نام کاربری */
  rePassword!: string;

  /** شناسه شرکت */
  companyId?: number;

  /** نقش */
  role?: number;
}

/** کاربرها */
export class CreatePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/person/create';
}
/** کاربرها */
export class UpdatePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/person/update';
}
/** کاربرها */
export class DeletePerson {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/person/';
}

/** نقش‌ها */
export class Role {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/role/list';

  /** شناسه */
  id!: number;

  /** شرح */
  title!: string;

  /** کد */
  name!: string;

  isNeedCompany!: boolean;
}
/** کاربرها */
export class CreateRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/role/create';
}
/** کاربرها */
export class AssignRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Role/assign';
}
/** مجوزها */
export class RolePermissions {
  /** آدرس سرویس */
  static readonly apiAddress: string = 'api/v1/Role/AllRolePermissionsTree';

  id!: number;
  data!: string;
  hasPermission!: boolean;
  icon!: string;
  label!: string;
  children?: RolePermissions[];
  underCons?: boolean;
  isHidden?: boolean;
}

export class Permission extends RolePermissions {
  /** آدرس سرویس */
  static override readonly apiAddress: string = 'api/v1/Role/permissions';
}

/** اطلاعیه‌ها */
export class Report extends Pagination {
  /** آدرس سرویس */
  static readonly apiAddress: string = 'api/v1/Advertisement';

  /** شناسه */
  id!: number;

  /** کد */
  code!: number | null;

  /** عنوان */
  description!: string;

  /** زمان ارسال */
  sendDate!: Date;
  sendDatePersian!: Date;

  /** زمان انتشار */
  publishDate!: Date;

  /** حسابرسی شده */
  audited!: boolean;

  /** سال منتهی به */
  yearEnding!: Date;

  /** طول دوره */
  courseLength!: number;

  /** شماره پیگیری */
  issueTrackingNo!: number | null;

  /** وضعیت اطلاعیه */
  advertStatus!: boolean | null;

  /** دلیل اطلاعیه */
  amendmentReason!: boolean | null;

  /** دارای اصلاحیه */
  hasAmendment!: boolean;

  /** گروه */
  advertisementGroup!: string;

  /** نوع */
  advertisementTypeModel!: string;

  /** موسسه حسابداری شرکت */
  companyInspectionInstitute!: string;

  /** شرکت */
  company!: string;

  /** شناسه عطف */
  parentAdvertId!: number | null;

  /** شناسه نوع */
  advertisementGroupId!: number;

  /** شناسه گروه */
  advertisementTypeId!: number;

  /** شناسه موسسه حسابداری شرکت */
  companyInspectionInstituteId!: number;

  /** شناسه شرکت */
  companyId!: number;

  /** دلیل عدم تائید */
  rejectedReason!: string | null;

  /** عنوان اطلاعیه */
  subject!: string;

  /** نظر ناظر */
  comment!: string | null;

  /** نام ناظر */
  supervisiorName!: string | null;

  publisherStatus?: PublisherStatus;

  advertisementGroupModel?: AdvertisementGroup;

  companyType?: CompanyType;

  advertisementType?: AdvertisementType;

  companyInspectionInstituteModel?: CompanyInspectionInstitute;

  isNotAudited?: false;

  isAudited?: false;

  isRootAdvert?: false;

  isLeafAdvert?: false;

  isRootCompany?: false;

  isLeafCompany?: false;

  isHolding?: false;

  fromPublishDate?: Date;

  toPublishDate?: Date;

  publisherStatusId?: number;

  companyTypeId?: number;

  companyModel?: Company;

  multiMediaIds?: number[];

  companyName?: string;

  onlineAdvertDefinitionId!: number;

  advertId?: number;

  stateOrder?: number;

  publisherCompanyName?: string;

  advertisementSubject?: string;

  myCheckedDatePersian!: Date;

  myAddedDatePersian!: Date;

  advertStatusTitle!: string;

  advertisementDescription!: string;
}

export class ReportAttachment {
  /** شناسه */
  advertId!: number;

  /** پیوست‌ها */
  attachments!: Attachments[];
}

export class AssetAttachment {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Assets/attachment/upload';

  multiMediaId!: number;
  fileSize!: number;
  fileName!: string;
}

export class Attachments {
  size!: string;
  id!: number;
  type!: AttachmentsType;
  fileName!: string;
  mimeType!: string;
}

export enum AttachmentsType {
  NONE = 0,
  IMAGE,
  VIDEO,
  PDF,
  WORD,
  EXCEL,
}

/** فایل‌ها */
export class Asset {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Assets/attachment';
}

/** فعالیت‌ها */
export class ActivityType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/ActivityType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** شرکت‌ها */
export class CompanyType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/CompanyType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** نوع‌های شرکت */
export class Company {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/company/All';

  id!: number;
  parentId!: number;
  parent?: Company;
  symbol!: string;
  companyName!: string;
  companyType!: string;
  latinName!: string;
  nationalID!: string;
  isic?: string;
  companyISIN?: string;
  registerNumber?: string;
  activitySubject?: string;
  factoryAddress?: string;
  factoryTelephone?: string;
  factoryFax?: string;
  stockAffairsOffice?: string;
  stockAffairsTelephone?: string;
  stockAffairsFax?: string;
  centeralOffice?: string;
  centeralOfficeTelephone?: string;
  centeralOfficeFax?: string;
  managingDirector?: string;
  financialManager?: string;
  boardofDirectors?: string;
  alternateInspector?: string;
  registerDate!: Date;
  yearEnd!: Date;
  registeredCapital?: number;
  nonRegisteredCapital?: number;
  companyTypeId?: number;
  companyTypeModel?: CompanyType;
  activityTypeId?: number;
  activityType?: ActivityType;
  reportingTypeId?: number;
  reportingType?: ReportingType;
  publisherStatusId?: number;
  publisherStatus?: PublisherStatus;
  companyInspectionInstituteId?: number;
  companyInspectionInstitute?: CompanyInspectionInstitute;
  substituteInspector?: string;
}

/** نوع‌های شرکت */
export class CreateCompany {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/company/create';
}
/** نوع‌های شرکت */
export class DeleteCompany {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/company';
}
/** نوع‌های شرکت */
export class ListCompany {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/company/list';
}
/** ماهیت‌ها */
export class ReportingType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/ReportingType';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** وضعیت‌های ناشر */
export class PublisherStatus {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/PublisherStatus';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** گروه‌های اطلاعیه */
export class AdvertisementGroup {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/BaseInfo/AdvertisementGroup';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** نوع‌های اطلاعیه */
export class AdvertisementType {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/BaseInfo/AdvertisementTypeByParent';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** موسسه‌های حسابرسی شرکت */
export class CompanyInspectionInstitute {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/baseinfo/CompanyInspectionInstitute';

  id!: number;
  code!: string;
  title!: string;
  isActive!: boolean;
}
/** کاربران */
export class GeneralPerson extends Person {
  /** آدرس سرویس */
  static override readonly apiAddress: string = 'api/v1/info/GetGeneralPersons';

  userId!: number;
}
/** نوع‌های اطلاعیه */
export class CourseLengths {
  /** آدرس سرویس */
  static readonly apiAddress = '';

  id!: number;
  title!: string;
}

/** نقش کاربران */
export class PersonRole {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/GetAllPersonRoleInfo';

  roleId!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;
  nationalID!: string;
  roleTitle!: string;
}
/** ناظرین */
export class Supervisor {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/info/GetSupervisors';

  userId!: number;
  firstName!: string;
  lastName!: string;
  nationalId!: string;
  fatherName!: string;
  genderType!: number;
  birthDate!: Date;
  birthCertificateNumber!: string;
}

/** ناظرین */
export class AssignCompanyToSupervisor {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Info/AssignCompanyToSupervisor';
}

/** ناظرین */
export class CompanyTree {
  /** آدرس سرویس */
  static readonly apiAddress = 'api/v1/Company/tree';

  id!: number;
  data!: string;
  hasPermission!: boolean;
  icon!: string;
  label!: string;
  children?: CompanyTree[];
}

/** ناظرین */
export class Publisher extends Report {
  /** آدرس سرویس */
  static override readonly apiAddress = 'api/v1/publisher';
}

/** ناظرین */
export class SupervisorSearch extends Report {
  /** آدرس سرویس */
  static override readonly apiAddress = 'api/v1/supervisor';
}

export class FileType {
  static readonly apiAddress = 'api/v1/baseinfo/FileMimeType';
  id!: number;
  type!: string;
  description!: string;
  extention!: string;
}
export class AttachmentType {
  static readonly apiAddress = 'api/v1/baseinfo/AttachmentFileType';
  id!: number;
  title!: string;
  enName!: string;
  tempPath!: string;
  fileMimeTypeId!: number;
}

export class AdvertismentType {
  static readonly apiAddress = 'api/v1/baseinfo/AdvertismentType';
  id!: number;
  title!: string;
  code!: string;
  order!: number;
  parentId!: number;
  childes!: number;
}

export class AdvertismentTypeFileNeeds {
  static readonly apiAddress = 'api/v1/baseinfo/AdverTyeFileNeeds';
  id!: number;
  title!: string;
  extention!: string;
  isAdded!: boolean;
  adverTyeFileNeedsId!: number;
  isRequired!: boolean;
  year!: number;
  month!: number;
  attachmentFileTypeName!: string;
}

export class OnlineAdvertAttachmentNeeds {
  static readonly apiAddress =
    'api/v1/Advertisement/OnlineAdvertAttachmentNeeds';
  onlineAdvertAttachmentNeedsId!: number;
  attachmentFileTypeTitle!: string;
  description!: string;
  extention!: string;
  type!: string;
  isRequired!: boolean;
  title!: string;
  advertAttachmentNeedsYear!: number;
  advertAttachmentNeedsMonth!: number;
}

export class CreateOnlineAdvertDefinition {
  static readonly apiAddress = 'api/v1/Advertisement/OnlineAdvertDefinition';
  id!: number;
  description!: string;
  activeDate!: Date;
  expiredDate!: Date;
  increaseValueScore!: number;
  decreaseValueScore!: number;
  isActive!: boolean;
  advertisementTypeId!: number;
  onlineAdvertNeedsInfos!: AdvertismentTypeFileNeeds;
  activeDatePersian!: Date;
  expiredDatePersian!: Date;
  advertisementTypeName!: string;
}

export interface Product {
  id?: number;
  description?: string;
  activeDate?: Date;
  expiredDate?: Date;
  increaseValueScore?: number;
  decreaseValueScore?: number;
  isActive?: boolean;
  advertisementTypeId?: number;
  onlineAdvertNeedsInfos?: AdvertismentTypeFileNeeds;
  activeDatePersian?: Date;
  expiredDatePersian?: Date;
  advertisementTypeName?: string;
}

export class news {
  static readonly apiAddress = 'api/v1/Rss/feed';
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
}

export class SystemReports extends Pagination {
  static readonly apiAddress = 'api/v1/Report';
  id!: number;
  activeDate!: Date;
  expiredDate!: Date;
  isActive!: boolean;
  description!: string;
  title!: string;
  increaseValueScore!: number;
  decreaseValueScore!: number;
  companyCount!: number;
  totalAdvertCount!: number;
  acceptedAdvertCount!: number;
  disapprovalAdvertCount!: number;
  failedAdvertCount!: number;
  notCheckedAdvertCount!: number;
  advertisementTypeId!: number;
  toDate!: Date;
  fromDate!: Date;
}

export class AdvertDelayAndDefectReport extends Pagination {
  static readonly apiAddress = 'api/v1/Report/AdvertDelayAndDefectReport';

  advertismentId!: number;
  advertAddedDate!: Date;
  advertModifiedDate!: Date;
  advertisementType!: string;
  onlineAdvertDefinitionActiveDate!: Date;
  onlineAdvertDefinitionExpiredDate!: Date;
  increaseValueScore!: number;
  decreaseValueScore!: number;
  onlineAdvertNeedsInfosCount!: number;
  onlineAdvertNeedsInfos!: Array<AdvertNeedsAndMedia>;
  advertMultiMediasCount!: number;
  advertMultiMediasInfo!: Array<AdvertNeedsAndMedia>;
  companyId!: number;
  advertStatus!: string;
  advertStatusColor!: string;
  advertDescription!: string;
  advertCompanyName!: string;
  onlineAdvertId!: number;
  toDate!: Date;
  fromDate!: Date;
}
export class AdvertNeedsAndMedia {
  id!: number;
  name!: string;
  isAdded!: boolean;
}

export class AdvertsByOnlineAdverIdReport extends Pagination {
  static readonly apiAddress = 'api/v1/Report/AdvertsByOnlineAdverIdReport';

  title!: string;
  description!: string;
  activeDate!: string;
  expiredDate!: string;
  advertAddedDate!: Date;
  advertStatus!: string;
  advertStatusColor!: string;
  advertDescription!: string;
  advertModifiedDate!: Date;
  advertCompanyName!: string;
  onlineAdvertId!: number;
  toDate!: Date;
  fromDate!: Date;
  companyId!: number;
}
