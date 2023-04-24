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
  postOfficeLocationReport,
} from "../../../../../server/trpc/router/reports";
import "chartjs-adapter-date-fns";

import { FilterFn } from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import Spinner from "../../../icons/Spinner";
import EmployeeTableReport from "./EmployeeTable";

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

const EmployeeReport = () => {
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
      postoffice_location_id: "",
      role: 0,
    },
    resolver: zodResolver(employeeReportInput),
  });

  const { data, isLoading, isError, refetch, isSuccess, isFetching } =
    trpc.report.getLocationEmployeeReport.useQuery(
      {
        endDate: watch("endDate"),
        startDate: watch("startDate"),
        postoffice_location_id: watch("postoffice_location_id"),
        role: watch("role"),
      },
      {
        enabled: false,
      }
    );

  // const employeeReport = trpc.employee.getAllEmployee.useQuery(undefined, {
  //   onSuccess: (data) => {
  //     // console.log("MONEY");
  //   },
  // });

  const locationInfo = trpc.location.getOfficeLocationsFromWorksFor.useQuery();

  useEffect(() => {
    if (isSuccess) {
      setChartData(formatChartData(data.employeeHoursReport));
      // console.log("HEHE", chartData);
    }
  }, [data, isSuccess]);

  const [chartData, setChartData] = useState<ChartData | null>(null);

  const formatChartData = (chatData: postOfficeLocationReport[]): ChartData => {
    const labels = chatData.map((item) => {
      console.log("HERE", item.year, item.month);
      return item.year + "-" + item.month;
    });
    console.log(labels);
    const values = chatData.map((item) => Number(item.total_hours));

    // console.log("labels", labels);
    // console.log("values", values);
    return {
      labels,
      datasets: [
        {
          label: "Hours Worked Per Month Per Location",
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

  // console.log(typeof watch("role"));

  return (
    <div className="">
      <div className="flex flex-col gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-full">
        <div className="grow gap-2 items-center">
          <h1 className="font-bold text-2xl pb-3">Employee Report</h1>
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
                  <h1 className="text-xl font-bold uppercase">Start date</h1>
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
              {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
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
                  height: "50%",
                  width: "50%",
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
                        displayFormats: {
                          month: "yyyy-MM",
                        },
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
          <div>{/* <pre>{JSON.stringify(data, null, 2)}</pre> */}</div>
        </div>
      </div>
      {isFetching ? (
        <Spinner />
      ) : (
        chartData &&
        data?.employeeHoursReport && (
          <EmployeeTableReport data={data?.employeeHoursReport} />
        )
      )}
      {isError && (
        <div className="flex flex-col gap-4 mt-10 bg-[#3a3a38]/50 p-12 rounded-md border-2 border-[#41413E] shadow-2xl w-full">
          <div className="grow gap-2 items-center">
            <div className="font-bold text-2xl pb-3">Error</div>
            <div className="text-xl font-bold pb-3">Error</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const employeeReportInput = z.object({
  startDate: z.string().optional(),
  hoursMin: z.number().optional(),
  hoursMax: z.number().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  postoffice_location_id: z.string().optional(),
  role: z.number().optional(),
  clerkPackages: z.number().optional(),
});
export default EmployeeReport;
