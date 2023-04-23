import React from "react";
import ReactDOM from "react-dom/client";
import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import {
  PackageTableData,
  ProductReportSchema,
} from "../../../../../server/trpc/router/reports";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function Money({ data }: { data: ProductReportSchema[] }) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<ProductReportSchema>[]>(
    () => [
      {
        accessorKey: "product_name",
        header: () => <span>Product</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "price",
        header: "Price Of one",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "month",
        header: "Month",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "year",
        header: "Year",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "locationname",
        header: "Location Sold",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "orders_count",
        header: "Orders Made",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "total_sold",
        header: "Total Items Sold",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "total_revenue",
        header: "Total Revenue",
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });
  return (
    <div className="p-2 w-full overflow-scroll">
      <div>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block bg-[#3a3a38]/50"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table className="border border-[#41413E]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-4 border-b border-r  border-[#41413E] font-bold uppercase  cursor-pointer overflow-hidden"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex flex-col "
                              : " flex flex-col",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="text-gray-100 text-center text-xs">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="
                  hover:bg-[#c0bcbc] hover:text-[#1D1D1C] cursor-pointer h-2 even:bg-[#3A3A38] bg-[#2F2F2E]"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className=" border-[#41413E] md:px-6 md:py-4 border h-2 overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex flex-row justify-center">
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1 border-calm-yellow"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="border rounded p-1 border-calm-yellow"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 bg-transparent border border-calm-yellow rounded p-1"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="bg-transparent border border-calm-yellow rounded p-1"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize} className="">
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* <div className="flex justify-center p-10">
        <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
        <div>
          <button onClick={() => rerender()}>Force Rerender</button>
        </div>
      </div> */}
    </div>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
