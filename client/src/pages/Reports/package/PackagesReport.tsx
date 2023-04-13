import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bar } from "react-chartjs-2";
import { LinearScale, TimeScale } from "chart.js";
import Chart from "chart.js/auto";

import { PackageReportSchema } from "../../../../../server/trpc/router/reports";
import "chartjs-adapter-date-fns";

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
  FilterFns,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import Money from "./PackageTable";
import Spinner from "../../../icons/Spinner";

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

Chart.register(LinearScale, TimeScale);
Chart.defaults.backgroundColor = "#ffff";

type ChatDataItem = {
  month: string;
  package_count: string;
};

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

const PackagesReport = () => {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      type: "all",
      size: "all",
      senderID: "", // todo
      receiverID: "", // todo
      employeeID: "", // todo
      postoffice_location_id: "", // TODO
      status: "all", //todo
    },
    resolver: zodResolver(packageReportInput),
  });

  const { data, isLoading, isError, refetch, isSuccess, isFetching } =
    trpc.report.getPackageReportChart.useQuery(
      {
        startDate: watch("startDate"),
        endDate: watch("endDate"),
        senderID: watch("senderID"),
        receiverID: watch("receiverID"),
        employeeID: watch("employeeID"),
        postoffice_location_id:
          watch("postoffice_location_id") === "all"
            ? ""
            : watch("postoffice_location_id"),
        status: watch("status") === "all" ? "" : watch("status"),
        type: watch("type") === "all" ? "" : watch("type"),
        size: watch("size") === "all" ? "" : watch("size"),
      },
      {
        enabled: false,
      }
    );
  useEffect(() => {
    if (isSuccess) {
      setChartData(formatChartData(data.packageReport));
      // console.log("HEHE", chartData);
    }
  }, [data, isSuccess]);

  const [chartData, setChartData] = useState<ChartData | null>(null);

  const formatChartData = (chatData: PackageReportSchema[]): ChartData => {
    const labels = chatData.map((item) => item.month);
    const values = chatData.map((item) => item.package_count);

    // console.log("labels", labels);
    // console.log("values", values);
    return {
      labels,
      datasets: [
        {
          label: "Package Count",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };
  const onSubmit = handleSubmit(async (data) => {
    // console.log("refetching");
    await refetch();
    // console.log(data);
  });

  // TABLE:

  // if (isError) {
  //   return <div>Error</div>;
  // }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-full">
        <div className="grow gap-2 items-center">
          <h1 className="font-bold text-2xl pb-3">Package Report</h1>
          <h1 className="text-xl font-bold pb-3">Select Filters:</h1>
          <div className="pb-3 ">
            <form onSubmit={onSubmit} className="">
              <div className="flex flex-row mb-3">
                <div className="flex flex-col grow gap-3 items-start">
                  <label htmlFor="type" className="text-xl font-bold \">
                    Package Type:
                  </label>
                  <select
                    {...register("type")}
                    className="font-bold font-xl p-3 bg-transparent border border-calm-yellow outline-none"
                    placeholder="type"
                  >
                    <option value="envelope">envelope</option>
                    <option value="box">box</option>
                    <option value="other">other</option>
                    <option value="all">all</option>
                  </select>
                </div>
                <div className="flex flex-col grow gap-3 items-start">
                  <label
                    htmlFor="package-size"
                    className="text-xl font-bold uppercase"
                  >
                    package size
                  </label>
                  <select
                    {...register("size")}
                    className="font-bold font-xl p-3 bg-transparent border border-calm-yellow outline-none"
                  >
                    <option value="small">small</option>
                    <option value="medium">medium</option>
                    <option value="large">large</option>
                    <option value="all">all</option>
                  </select>
                </div>
                <div className="flex flex-col grow gap-3 items-start">
                  <h1 className="text-xl font-bold uppercase">from date</h1>
                  <input
                    type="date"
                    className="font-bold font-xl p-3 bg-transparent border border-calm-yellow outline-none"
                    {...register("startDate")}
                  />
                </div>
                <div className="flex flex-col grow gap-3 items-start">
                  <label
                    htmlFor="to-date"
                    className="text-xl font-bold uppercase"
                  >
                    to date
                  </label>
                  <input
                    type="date"
                    className="font-bold font-xl p-3 bg-transparent border border-calm-yellow outline-none"
                    {...register("endDate")}
                  />
                </div>
              </div>
              <div className="flex justify-start pt-5">
                <button className="font-bold font-xl bg-calm-yellow rounded-lg p-2 text-black uppercase">
                  generate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-full">
        <div className="grow gap-2 items-center">
          <div className="">
            {chartData && (
              <Bar
                data={chartData}
                style={{
                  height: "100%",
                  width: "100%",
                  border: "1px dotted rgba(255, 255, 255, 0.2)",
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                      },
                      type: "time",
                      time: {
                        unit: "month",
                      },
                    },
                    y: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                      },
                      type: "linear",
                    },
                  },
                }}
              />
            )}
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      </div>
      {isFetching ? (
        <Spinner />
      ) : (
        chartData &&
        data?.packageReportTable && <Money data={data.packageReportTable} />
      )}
      {}
    </div>
  );
};

export const packageReportInput = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  senderID: z.string().optional(),
  receiverID: z.string().optional(),
  employeeID: z.string().optional(),
  postoffice_location_id: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  size: z.string().optional(),
});
export default PackagesReport;
