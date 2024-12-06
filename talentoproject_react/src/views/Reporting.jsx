import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axiosClient from "../axiosClient";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const timezoneName = "Asia/Manila";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function PerformerBooking() {
  const { isSidebarOpen } = useOutletContext();
  const [summary, setSummary] = useState({
    total_users: [],
    users_created_today: [],
    total_bookings: [],
    bookings_today: [],
    cancelled_bookings: [],
    approved_bookings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/admin/summary-report")
      .then((response) => {
        if (response.data.status === "success") {
          setSummary(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching summary data:", error))
      .finally(() => setLoading(false));
  }, []);

  const labels = Array.from({ length: 30 }, (_, i) => {
    return dayjs()
      .tz(timezoneName)
      .subtract(29 - i, "day")
      .format("MMM D");
  });

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#555",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#555", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grace: "10%",
        ticks: {
          stepSize: 1,
          color: "#555",
          font: { size: 12 },
        },
        grid: {
          color: "#eaeaea",
        },
      },
    },
  };

  const generateChartData = (label, data, backgroundColor) => ({
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor,
      },
    ],
  });

  if (loading) {
    return <div className="text-center text-gray-600">Loading data...</div>;
  }

  if (!summary) {
    return (
      <div className="text-center text-red-600">
        Error loading data. Please try again.
      </div>
    );
  }

  // Summarize data
  const totalUsers = summary.total_users[summary.total_users.length - 1];
  const usersCreatedToday = summary.users_created_today[summary.users_created_today.length - 1];
  const totalBookings = summary.total_bookings[summary.total_bookings.length - 1];
  const bookingsToday = summary.bookings_today[summary.bookings_today.length - 1];
  const cancelledBookings = summary.cancelled_bookings[summary.cancelled_bookings.length - 1];
  const approvedBookings = summary.approved_bookings[summary.approved_bookings.length - 1];

  const approvalRate = ((approvedBookings / totalBookings) * 100).toFixed(2);
  const cancellationRate = ((cancelledBookings / totalBookings) * 100).toFixed(2);

  // Data for charts
  const totalUsersData = generateChartData("Total Users", summary.total_users, "rgba(54, 162, 235, 0.6)");
  const usersCreatedTodayData = generateChartData(
    "Users Created Today",
    summary.users_created_today,
    "rgba(255, 99, 132, 0.6)"
  );
  const totalBookingsData = generateChartData(
    "Total Bookings",
    summary.total_bookings,
    "rgba(75, 192, 192, 0.6)"
  );
  const bookingsTodayData = generateChartData(
    "Bookings Created Today",
    summary.bookings_today,
    "rgba(255, 206, 86, 0.6)"
  );
  const cancelledBookingsData = generateChartData(
    "Cancelled Bookings Trend",
    summary.cancelled_bookings,
    "rgba(255, 99, 132, 0.6)"
  );
  const approvedBookingsData = generateChartData(
    "Approved Bookings Trend",
    summary.approved_bookings,
    "rgba(75, 192, 192, 0.6)"
  );

  const bookingComparisonData = {
    labels: ["Approved Bookings", "Cancelled Bookings"],
    datasets: [
      {
        data: [approvedBookings, cancelledBookings],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <main className="flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metrics Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
            <ul className="mt-4 text-gray-600 space-y-2">
              <li>Total Users: <span className="font-bold">{totalUsers}</span></li>
              <li>New Users Today: <span className="font-bold">{usersCreatedToday}</span></li>
              <li>Total Bookings: <span className="font-bold">{totalBookings}</span></li>
              <li>Bookings Today: <span className="font-bold">{bookingsToday}</span></li>
              <li>Approval Rate: <span className="font-bold">{approvalRate}%</span></li>
              <li>Cancellation Rate: <span className="font-bold">{cancellationRate}%</span></li>
            </ul>
          </div>

          {/* Booking Breakdown */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Booking Breakdown</h2>
            <Pie data={bookingComparisonData} />
          </div>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white shadow rounded-lg p-6 h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Users Trend (Last 30 Days)</h2>
            <Bar data={totalUsersData} options={chartOptions} />
          </div>
          <div className="bg-white shadow rounded-lg p-6 h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Users Created Today Trend (Last 30 Days)</h2>
            <Bar data={usersCreatedTodayData} options={chartOptions} />
          </div>
          <div className="bg-white shadow rounded-lg p-6 h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookings Created Today (Last 30 Days)</h2>
            <Bar data={bookingsTodayData} options={chartOptions} />
          </div>
          <div className="bg-white shadow rounded-lg p-6 h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancelled Bookings Trend (Last 30 Days)</h2>
            <Bar data={cancelledBookingsData} options={chartOptions} />
          </div>
          <div className="bg-white shadow rounded-lg p-6 h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Approved Bookings Trend (Last 30 Days)</h2>
            <Bar data={approvedBookingsData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}


