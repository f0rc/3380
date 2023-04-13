import React, { useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { employeeList } from "../../../../server/trpc/router/employee";

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

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export default function EmployeeTable({ data }: { data: employeeList[] }) {
  const rerender = React.useReducer(() => ({}), {})[1];

  const handlePackageClick = (employee: any) => {
    // console.log("NAV", employee);
    navigate(`/employee/${employee.employee_id}`, {
      state: { data: employee },
    });
  };
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<employeeList>[]>(
    () => [
      {
        accessorKey: "firstname",
        header: () => <span>First Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "lastname",
        header: "Last Name",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "role",
        header: "role",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "hours",
        header: "hours",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "salary",
        header: "salary",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "manager_lastname",
        header: "Supervisor",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "locationname",
        header: "Work Location",
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
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
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

  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="max-w-5xl">
        <div className="flex justify-center items-center">
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
                  <>
                    <tr key={headerGroup.id} className="">
                      {headerGroup.headers.map((header) => {
                        return (
                          <>
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
                                      onClick:
                                        header.column.getToggleSortingHandler(),
                                    }}
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                    {{
                                      asc: " 🔼",
                                      desc: " 🔽",
                                    }[header.column.getIsSorted() as string] ??
                                      null}
                                  </div>
                                </>
                              )}
                            </th>
                          </>
                        );
                      })}
                    </tr>
                  </>
                ))}
              </thead>
              <tbody className="text-gray-100 text-center text-md">
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr
                      onClick={() => handlePackageClick(row.original)}
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
                {/* <button
            className="border rounded p-1 border-calm-yellow"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button> */}
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
                {/* <button
            className="border rounded p-1 border-calm-yellow"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button> */}
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
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
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
            <div className="flex justify-center p-10">
              <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
              {/* <div>
                <button onClick={() => rerender()}>Force Rerender</button>
              </div> */}
              {/* <div>
          <button onClick={() => refreshData()}>Refresh Data</button>
        </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
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
