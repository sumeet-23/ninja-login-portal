// Purchase Orders API - Updated to use real API

import { getPurchaseOrders as fetchPurchaseOrdersAPI, PurchaseOrder as APIPurchaseOrder, FetchPurchaseOrderParams } from './PurchaseOrder';

// Legacy interface for backward compatibility
export interface PurchaseOrder {
  id: string;
  poId: string;
  vendorName: string;
  paymentStatus: 'paid' | 'not_paid' | 'pending';
  city: string;
  facility: string;
  address: string;
  qtyTarget: number;
  targetDelivery: string;
  createdTime: string;
  createdUser: string;
}

export interface FetchPOParams {
  city?: string;
  facility?: string;
  orderType?: string;
  vendor?: string;
  date?: string;
}

// Helper function to convert API data to legacy format
const convertAPIToLegacy = (apiPO: APIPurchaseOrder): PurchaseOrder => {
  // Get payment status from GRN
  const grn = apiPO.gRN && apiPO.gRN.length > 0 ? apiPO.gRN[0] : null;
  const paymentStatus = grn?.paymentStatus === 1 ? 'paid' : 'not_paid';
  
  // Calculate total quantity from purchase order details
  const totalQuantity = apiPO.purchaseOrderDetails.reduce((sum, detail) => sum + detail.skuQuantity, 0);
  
  // Format dates
  const formatDate = (timestamp: number) => new Date(timestamp).toISOString();
  
  return {
    id: apiPO.id.toString(),
    poId: `PO-${apiPO.id}`,
    vendorName: apiPO.vendor.name,
    paymentStatus: paymentStatus as 'paid' | 'not_paid' | 'pending',
    city: apiPO.city.name,
    facility: apiPO.facility.name,
    address: apiPO.vendor.address,
    qtyTarget: totalQuantity,
    targetDelivery: formatDate(apiPO.deliveryDate),
    createdTime: formatDate(apiPO.createdAt),
    createdUser: apiPO.createdByName
  };
};

// Helper function to get city and facility IDs from names
const getCityId = async (cityName: string): Promise<number | null> => {
  try {
    const { getCities } = await import('./City');
    const cities = await getCities();
    const city = cities.find(c => c.name === cityName);
    return city ? city.id : null;
  } catch (error) {
    console.error('Error fetching city ID:', error);
    return null;
  }
};

const getFacilityId = async (facilityName: string): Promise<number | null> => {
  try {
    const { getFacilities } = await import('./Facility');
    const facilities = await getFacilities();
    const facility = facilities.find(f => f.name === facilityName);
    return facility ? facility.id : null;
  } catch (error) {
    console.error('Error fetching facility ID:', error);
    return null;
  }
};

export const fetchPurchaseOrders = async (params: FetchPOParams): Promise<PurchaseOrder[]> => {
  try {
    // Convert city and facility names to IDs
    const cityId = params.city ? await getCityId(params.city) : null;
    const facilityId = params.facility ? await getFacilityId(params.facility) : null;
    
    // Format delivery date
    const deliveryDate = params.date ? new Date(params.date).toISOString().split('T')[0] : undefined;
    
    // Convert order type to purchase order type
    const purchaseOrderType = params.orderType === 'interfacility' ? 2 : 1;
    
    // Prepare API parameters
    const apiParams: FetchPurchaseOrderParams = {
      cityId: cityId || undefined,
      facilityId: facilityId || undefined,
      deliveryDate,
      offset: 0,
      limit: 1000000000,
      purchaseOrderType
    };
    
    // Fetch data from API
    const apiPurchaseOrders = await fetchPurchaseOrdersAPI(apiParams);
    
    // Convert to legacy format
    const legacyPurchaseOrders = apiPurchaseOrders.map(convertAPIToLegacy);
    
    // Apply additional filters
    let filtered = [...legacyPurchaseOrders];
    
    if (params.vendor) {
      filtered = filtered.filter(po => 
        po.vendorName.toLowerCase().includes(params.vendor!.toLowerCase())
      );
    }
    
    return filtered;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    // Return empty array on error
    return [];
  }
};

export const exportToCSV = (data: PurchaseOrder[]) => {
  const headers = ['PO ID', 'Vendor Name', 'Payment Status', 'City', 'Facility', 'Address', 'Qty Target', 'Target Delivery', 'Created Time', 'Created User'];
  const csvContent = [
    headers.join(','),
    ...data.map(po => [
      po.poId,
      `"${po.vendorName}"`,
      po.paymentStatus,
      po.city,
      po.facility,
      `"${po.address}"`,
      po.qtyTarget,
      po.targetDelivery,
      po.createdTime,
      po.createdUser
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `purchase-orders-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
