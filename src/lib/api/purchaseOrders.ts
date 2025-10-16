// Mock API for Purchase Orders

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

// Mock data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poId: 'PO-2024-001',
    vendorName: 'Fresh Farms Pvt Ltd',
    paymentStatus: 'not_paid',
    city: 'Chennai',
    facility: 'B2C_Chennai_FK_FC',
    address: 'No 45, Anna Nagar, Chennai - 600040',
    qtyTarget: 500,
    targetDelivery: '2024-01-25T10:00:00',
    createdTime: '2024-01-20T14:30:00',
    createdUser: 'NC3604'
  },
  {
    id: '2',
    poId: 'PO-2024-002',
    vendorName: 'Green Valley Suppliers',
    paymentStatus: 'paid',
    city: 'Chennai',
    facility: 'B2C_Chennai_FK_FC',
    address: 'Plot 12, Industrial Estate, Chennai - 600058',
    qtyTarget: 750,
    targetDelivery: '2024-01-26T09:00:00',
    createdTime: '2024-01-20T15:45:00',
    createdUser: 'NC3604'
  },
  {
    id: '3',
    poId: 'PO-2024-003',
    vendorName: 'Quality Produce Co',
    paymentStatus: 'pending',
    city: 'Chennai',
    facility: 'B2C_Chennai_FK_FC',
    address: 'No 78, T Nagar, Chennai - 600017',
    qtyTarget: 300,
    targetDelivery: '2024-01-24T11:30:00',
    createdTime: '2024-01-20T16:20:00',
    createdUser: 'NC3604'
  }
];

export const fetchPurchaseOrders = async (params: FetchPOParams): Promise<PurchaseOrder[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter mock data based on params
  let filtered = [...mockPurchaseOrders];
  
  if (params.city) {
    filtered = filtered.filter(po => po.city === params.city);
  }
  
  if (params.facility) {
    filtered = filtered.filter(po => po.facility === params.facility);
  }
  
  if (params.vendor) {
    filtered = filtered.filter(po => 
      po.vendorName.toLowerCase().includes(params.vendor!.toLowerCase())
    );
  }
  
  return filtered;
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
