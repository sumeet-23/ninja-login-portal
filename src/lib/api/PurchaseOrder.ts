// src/lib/api/PurchaseOrder.ts
// Purchase Order API service for fetching purchase order data from Asgard operations

export interface VendorType {
  id: number;
  vendorType: string;
  createdAt: number;
  updatedAt: number;
  createdBy: number;
  updatedBy: number;
  deleted: number;
}

export interface Vendor {
  id: number;
  active: number;
  address: string;
  alternateContactNumber: number;
  contactNumber: number;
  createdAt: number;
  deleted: number;
  latitude: number;
  longitude: number;
  name: string;
  updatedAt: number;
  createdBy: number;
  vendorRepresentativeId: number;
  updatedBy: number;
  havingBankAccount: number;
  languageId: number;
  speakingLanguageId: number;
  vendorType: VendorType;
  city: {
    id: number;
    name: string;
    languageId: number;
    cityType: number;
  };
  locality: {
    id: number;
    cityId: number;
    name: string;
    localityClusterId: number | null;
  };
  creditCycle: number;
  pricePerKgLogistics: number;
  age: number;
  version: number;
  shortName: string | null;
}

export interface Facility {
  id: number;
  name: string;
  city: {
    id: number;
    name: string;
    languageId: number;
    cityType: number;
  };
  facilityType: {
    id: number;
    name: string;
    deleted: number;
  };
  parentFacilityId: number;
  shortName: string | null;
  latitude: number;
  longitude: number;
  combinePicknRun: boolean;
  address: string;
  contactNumber: string;
  alternateContactNumber: string;
  deleted: number;
  activeStatus: number;
  clusterId: number | null;
  facilityTypeGroupId: number;
}

export interface City {
  id: number;
  name: string;
  languageId: number;
  cityType: number;
}

export interface SkuCategory {
  id: number;
  name: string;
  deliveryDaysThreshold: number;
  imageUrl: string;
  deleted: number;
  layoutType: number;
}

export interface SkuSubCategory {
  id: number;
  skuCategoryId: number;
  name: string;
  deleted: number;
}

export interface PurchaseWeight {
  id: number;
  weightUnit: string;
  weightTypeId: number;
  conversionToBase: number;
  conversionToCrate: number;
  baseWeight: number;
  deleted: number;
  small: boolean;
  big: boolean;
  medium: boolean;
}

export interface SkuConfiguration {
  id: number;
  marketSkuId: number | null;
  deliveryClassificationId: number;
  batchingClassificationId: number;
  skuCustomizationParentSkuId: number | null;
  checkQuality: number;
  checkDailyTonnage: number;
  isPriority: number | null;
  barcodeScanRequired: number;
  conversionToKgs: number;
  lottingLossMultiplier: number;
  createdBy: number;
  updatedBy: number;
  deleted: number;
  farmerSku: number;
  checkPresentInBasket: number;
  assetId: number;
  resellSkuId: number | null;
  hardnessClassificationId: number;
  shelfSku: boolean;
}

export interface Sku {
  id: number;
  name: string;
  imageUrl: string;
  barcode: string;
  skuSubCategory: SkuSubCategory;
  skuCategory: SkuCategory;
  subCategoryClassification: any;
  purchaseWeight: PurchaseWeight;
  gradingLoss: any;
  deleted: number;
  pickNRunPriority: number;
  lowVolumePickPriority: number;
  skuVariantId: number;
  hsnCode: string | null;
  hazardous: number;
  cratePackaging: number;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  cessPercent: number | null;
  conversionToBox: number | null;
  conversionToInnerBox: number | null;
  skuClassificationId: number | null;
  rcmApplicable: boolean;
  skuAlias: any[];
  configuration: SkuConfiguration;
  shortName: string | null;
}

export interface SkuType {
  id: number;
  name: string;
  brand: string | null;
  subBrand: string | null;
  deleted: number;
}

export interface PurchaseOrderDetail {
  id: number;
  sku: Sku;
  skuType: SkuType;
  warehouseTracker: any;
  skuQuantity: number;
  indentQuantity: number;
  weight: PurchaseWeight;
  purchaseOrderId: number;
  shortFallClassificationId: number;
  comments: string | null;
  deleted: number;
  purchasePrice: number;
  origPurchasePrice: number;
  subLineTotal: number;
  expectedArrivalTime: number;
  actualArrivalTime: number | null;
  suppliedQuantity: number | null;
  sackQuantity: number | null;
  weightPerPiece: number | null;
  consumptionDate: number;
  receivingMode: any;
  gradingReturnAccepted: boolean;
  updatedAt: number;
  version: number;
  fulfilled: boolean | null;
  parentSkuId: number | null;
  parentPodId: number | null;
  manufacturingDate: number | null;
  expiryDate: number | null;
  carryForward: number;
  poSubType: number;
  notDeleted: boolean;
}

export interface GRN {
  id: number;
  facilityDepartment: {
    id: number;
    type: number;
    typeText: string;
    name: string;
    previousDepartment: number;
    deleted: number;
    facility: Facility;
  };
  status: number;
  processingCharge: number;
  createdAt: number;
  gRNUrl: string | null;
  paymentStatus: number;
  paymentStatusText: string;
  outStandingAmount: number;
  totalGRNAmount: number;
  freightCharge: number;
  deleted: number;
  waivedAmount: number | null;
  invoiceImageUrl: string | null;
  invoiceId: string | null;
  auctioneerCharges: number | null;
  moistureLossCharges: number | null;
  unloadingLabourType: any;
  waivedOffReason: string | null;
  withholdReason: string | null;
  totalPenaltyAmount: number;
  grndetails: any[];
  allPOIds: any[];
}

export interface CityGstDetails {
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
  gstNumber: string;
  pinCode: string;
  address: string;
  addressLocality: string;
}

export interface TargetAchievementsDTO {
  quantityTargetPercentage: number;
  skuWiseTotalPercentage: number;
  skuWiseTargetDTOList: any[];
  daysMissed: number;
}

export interface PurchaseOrder {
  id: number;
  vendor: Vendor;
  city: City;
  facility: Facility;
  createdAt: number;
  status: number;
  updatedAt: number;
  createdBy: number;
  createdByName: string;
  updatedBy: number;
  deleted: number;
  poPayment: boolean;
  freightCharge: number;
  deliveryDate: number;
  totalPrice: number;
  orderUrl: string | null;
  expectedDeliveryTime: number | null;
  type: number;
  subType: number;
  sourceType: number | null;
  sourceReferenceId: number | null;
  refType: number | null;
  refId: number | null;
  purchaseOrderDetails: PurchaseOrderDetail[];
  purchaseOrderAdditionalPaymentList: any[];
  gRN: GRN[];
  version: number;
  skuAttribProvided: number;
  interFacilityId: number;
  initialDeliveryDate: number;
  targetTotalQuantity: number;
  targetAchievementsDTOs: TargetAchievementsDTO;
  tripId: number;
  mappingTripId: number;
  saleOrder: any;
  purchaseOrderComments: string | null;
  tripProcurementVendorMapId: number;
  poTypeFlag: number;
  saleOrderSubType: number | null;
  sglStatus: any;
  gradingLossGrn: boolean;
  deliverySlotId: number | null;
  grnStatus: string;
  cityGstDetailsDTO: CityGstDetails;
  vehicleNoForConsignment: string | null;
  payableAmount: number;
  multipleGrnAllowed: boolean;
}

export interface PurchaseOrderResponse extends Array<PurchaseOrder> {}

export interface FetchPurchaseOrderParams {
  cityId?: number;
  facilityId?: number;
  deliveryDate?: string;
  offset?: number;
  limit?: number;
  purchaseOrderType?: number;
}

export class PurchaseOrderService {
  private static baseUrl = 'http://ops.ninjacart.in/asgard_ops/operations';
  
  static async getPurchaseOrders(params: FetchPurchaseOrderParams): Promise<PurchaseOrderResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.cityId) queryParams.append('cityId', params.cityId.toString());
      if (params.facilityId) queryParams.append('facilityId', params.facilityId.toString());
      if (params.deliveryDate) queryParams.append('deliveryDate', params.deliveryDate);
      if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
      if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params.purchaseOrderType !== undefined) queryParams.append('purchaseOrderType', params.purchaseOrderType.toString());

      const response = await fetch(`${PurchaseOrderService.baseUrl}/purchaseOrder?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Application': 'biFrost',
          'Authorization': 'Basic TkMzNjA0OjEyMzQ1Ng==',
          'Connection': 'keep-alive',
          'Origin': 'http://bifrost.ops.ninjacart.in',
          'Referer': 'http://bifrost.ops.ninjacart.in/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'appVersion': '7',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const purchaseOrders = await response.json();
      
      // Validate response structure
      if (!Array.isArray(purchaseOrders)) {
        throw new Error('Invalid response format: expected array of purchase orders');
      }

      return purchaseOrders;
    } catch (error) {
      console.error('Purchase Order API error:', error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const getPurchaseOrders = PurchaseOrderService.getPurchaseOrders;
