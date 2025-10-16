import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PurchaseOrder } from "@/lib/api/purchaseOrders";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface DataTableProps {
  data: PurchaseOrder[];
  onEdit: (po: PurchaseOrder) => void;
  onCreateGRN: (po: PurchaseOrder) => void;
  onPrint: (po: PurchaseOrder) => void;
}

export function DataTable({ data, onEdit, onCreateGRN, onPrint }: DataTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
          <span className="text-xs">{t('po.table.rowNo')}</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <span className="text-xs text-muted-foreground">{row.index + 1}</span>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "poId",
      header: t('po.table.poId'),
    },
    {
      accessorKey: "vendorName",
      header: t('po.table.vendorName'),
    },
    {
      accessorKey: "paymentStatus",
      header: t('po.table.payment'),
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string;
        const variant = status === 'paid' ? 'default' : status === 'pending' ? 'secondary' : 'destructive';
        return (
          <Badge variant={variant}>
            {status === 'paid' ? t('po.status.paid') : status === 'pending' ? t('po.status.pending') : t('po.status.notPaid')}
          </Badge>
        );
      },
    },
    {
      id: "otherDetails",
      header: t('po.table.otherDetails'),
      cell: ({ row }) => (
        <div className="text-xs space-y-1">
          <div>{row.original.city}</div>
          <div className="text-muted-foreground">{row.original.facility}</div>
          <div className="text-muted-foreground truncate max-w-xs">{row.original.address}</div>
        </div>
      ),
    },
    {
      accessorKey: "qtyTarget",
      header: t('po.table.qtyTarget'),
    },
    {
      accessorKey: "targetDelivery",
      header: t('po.table.targetDelivery'),
      cell: ({ row }) => {
        const date = new Date(row.getValue("targetDelivery"));
        return format(date, "dd/MM/yyyy HH:mm");
      },
    },
    {
      id: "createdInfo",
      header: t('po.table.createdTime'),
      cell: ({ row }) => (
        <div className="text-xs space-y-1">
          <div>{format(new Date(row.original.createdTime), "dd/MM/yyyy HH:mm")}</div>
          <div className="text-muted-foreground">{row.original.createdUser}</div>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-end gap-2">
          <span>{t('po.table.actions')}</span>
          <Settings className="h-4 w-4 cursor-pointer" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
            {t('po.actions.editOrder')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onCreateGRN(row.original)}>
            {t('po.actions.createGRN')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onPrint(row.original)}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl shadow-md overflow-hidden border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('po.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => table.setPageIndex(page - 1)}
                isActive={table.getState().pagination.pageIndex === page - 1}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
