import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bar } from "react-chartjs-2";
import { LinearScale, TimeScale } from "chart.js";
import Chart from "chart.js/auto";

import { PackageReportSchema } from "../../../../server/trpc/router/reports";
import "chartjs-adapter-date-fns";
Chart.register(LinearScale, TimeScale);

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
      senderID: "",
      receiverID: "",
      employeeID: "",
      postoffice_location_id: "",
      status: "",
      type: "",
      size: "",
    },
    resolver: zodResolver(packageReportInput),
  });

  const { data, isLoading, isError, refetch, isSuccess } =
    trpc.report.getPackageReport.useQuery(
      {
        startDate: watch("startDate"),
        endDate: watch("endDate"),
        senderID: watch("senderID"),
        receiverID: watch("receiverID"),
        employeeID: watch("employeeID"),
        postoffice_location_id: watch("postoffice_location_id"),
        status: watch("status"),
        type: watch("type"),
        size: watch("size"),
      },
      {
        enabled: false,
      }
    );

  useEffect(() => {
    if (isSuccess) {
      setChartData(formatChartData(data.packageReport));
      console.log("HEHE", chartData);
    }
  }, [data, isSuccess]);

  const [chartData, setChartData] = useState<ChartData | null>(null);

  const formatChartData = (chatData: PackageReportSchema[]): ChartData => {
    const labels = chatData.map((item) => item.month);
    const values = chatData.map((item) => item.package_count);

    console.log("labels", labels);
    console.log("values", values);
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
    console.log("refetching");
    await refetch();
    console.log(data);
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error</div>;
  // }

  return (
    <div>
      <h1>Packages Report</h1>
      <div>
        <h1>filter</h1>
        {/* add filters 1. package type(envelopoe, box, other, all) 2. package size( small, medium, large, all), 3. from date to date */}
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="package-type">package type</label>
            <select {...register("type")}>
              <option value="envelope">envelope</option>
              <option value="box">box</option>
              <option value="other">other</option>
              <option value="all">all</option>
            </select>

            <label htmlFor="package-size">package size</label>
            <select name="package-size" id="package-size">
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="large">large</option>
              <option value="all">all</option>
            </select>

            <label htmlFor="from-date">from date</label>
            <input type="date" {...register("startDate")} />

            <label htmlFor="to-date">to date</label>
            <input type="date" {...register("endDate")} />
          </div>

          <button>generate</button>
        </form>
      </div>
      <div className="w-1/2 bg-neutral-50 px-5 py-3 dark:bg-neutral-700 dark:text-neutral-200">
        {chartData && (
          <Bar
            data={chartData}
            style={{
              width: "100%",
              height: "100%",
            }}
            options={{
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "month",
                  },
                },
                y: {
                  type: "linear",
                },
              },
            }}
          />
        )}
        <h1>table</h1>
      </div>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
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
