import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bar } from "react-chartjs-2";
import { LinearScale, TimeScale } from "chart.js";
import Chart from "chart.js/auto";

import {
  PackageReportSchema,
  ProductReportSchema,
} from "../../../../../server/trpc/router/reports";
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
import Money from "./ProductTable";
import Spinner from "../../../icons/Spinner";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

Chart.register(LinearScale, TimeScale);
Chart.defaults.backgroundColor = "#ffff";

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

const ProductReport = () => {
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
    resolver: zodResolver(productReportInput),
  });

  const locationInfo = trpc.location.getOfficeLocationsFromWorksFor.useQuery();

  const { data, isLoading, isError, refetch, isSuccess, isFetching } =
    trpc.report.getProductReport.useQuery(
      {
        startDate: watch("startDate"),
        endDate: watch("endDate"),
        postoffice_location_id:
          watch("postoffice_location_id") === "all"
            ? ""
            : watch("postoffice_location_id"),
      },
      {
        enabled: false,
      }
    );
  useEffect(() => {
    if (isSuccess) {
      setChartData(formatChartData(data.report));
      // console.log("HEHE", chartData);
    }
  }, [data, isSuccess]);

  const [chartData, setChartData] = useState<ChartData | null>(null);

  const formatChartData = (chatData: ProductReportSchema[]): ChartData => {
    const groupedData: {
      [key: string]: { labels: string[]; values: number[] };
    } = {};

    // Group data by product
    chatData.forEach((item) => {
      const label =
        item.year +
        "-" +
        (item.month.length === 1 ? "0" + item.month : item.month);
      if (!groupedData[item.product_name]) {
        groupedData[item.product_name] = { labels: [], values: [] };
      }
      groupedData[item.product_name].labels.push(label);
      groupedData[item.product_name].values.push(Number(item.total_revenue));
    });

    // Create a dataset for each product
    const datasets = Object.entries(groupedData).map(
      ([productName, data], index) => {
        const backgroundColor = `rgba(${75 + index * 30}, ${
          192 - index * 30
        }, 192, 0.2)`;
        const borderColor = `rgba(${75 + index * 30}, ${
          192 - index * 30
        }, 192, 1)`;

        return {
          label: `${productName} Sales $ Per Month`,
          data: data.values,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        };
      }
    );

    // Assuming all products have the same set of labels (months)
    const labels = Object.values(groupedData)[0]?.labels || [];

    return {
      labels,
      datasets,
    };
  };
  const onSubmit = handleSubmit(async (data) => {
    // console.log("refetching");
    await refetch();
    // console.log(data);
  });

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
                    Location
                  </label>
                  {locationInfo.isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <select
                      className="font-bold font-xl p-3 bg-transparent border border-calm-yellow outline-none"
                      {...register("postoffice_location_id")}
                    >
                      <option value="">All</option>
                      {locationInfo.data?.locations?.map((location) => (
                        <option
                          value={location.postoffice_location_id}
                          key={location.postoffice_location_id}
                        >
                          {location.locationname}
                        </option>
                      ))}
                    </select>
                  )}
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
                  height: "400px",
                  width: "200px",
                  border: "1px dotted rgba(255, 255, 255, 0.2)",
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: false,
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                      },
                      type: "time",
                      time: {
                        unit: "month",
                      },
                    },
                    y: {
                      stacked: false,
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                      },
                      type: "linear",
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: function (context) {
                          const d = new Date(context[0].parsed.x);
                          const formatedDate = d.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          });
                          return formatedDate;
                        },
                      },
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
        chartData && data?.report && <Money data={data.report} />
      )}
      {}
    </div>
  );
};

export const productReportInput = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  senderID: z.string().optional(),
  postoffice_location_id: z.string().optional(),
  item_ID: z.string().optional(),
});
export default ProductReport;
