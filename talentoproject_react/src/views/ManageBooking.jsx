import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Chip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data for booking requests
const mockBookings = [
  {
    id: 1,
    client: "John Tumulak",
    eventName: "Wedding Ceremony",
    eventDate: "2024-10-15",
    location: "New York, NY",
    description: "A beautiful wedding ceremony at Central Park.",
    status: "Pending",
  },
  {
    id: 2,
    client: "Kris Justin Oporto",
    eventName: "Corporate Gala",
    eventDate: "2024-11-05",
    location: "Los Angeles, CA",
    description: "A high-profile corporate gala in Los Angeles.",
    status: "Pending",
  },
  {
    id: 3,
    client: "James Garthcliff Albejos",
    eventName: "Charity Concert",
    eventDate: "2024-12-12",
    location: "Chicago, IL",
    description: "A charity concert to raise funds for local NGOs.",
    status: "Accepted",
  },
  {
    id: 4,
    client: "Ian Jeoffrey G. Casul",
    eventName: "Birthday",
    eventDate: "2024-08-10",
    location: "Cordova, Cebu",
    description: "ALAWABALU",
    status: "Done",
  },
  {
    id: 5,
    client: "Alex Johnson",
    eventName: "Anniversary Celebration",
    eventDate: "2024-09-25",
    location: "San Francisco, CA",
    description: "A lovely anniversary celebration.",
    status: "Rejected",
  },
];

export default function ManageBooking() {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState(null); // To track selected booking for details
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state

  // Open the dialog with full details of the selected booking
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Filter bookings by status
  const bookingHistory = bookings.filter((booking) => booking.status === "Done");
  const rejectedBookings = bookings.filter((booking) => booking.status === "Rejected");
  const pendingBookings = bookings.filter((booking) => booking.status === "Pending");

  // Quick Metrics
  const totalBookings = bookings.length;
  const pendingCount = pendingBookings.length;
  const acceptedCount = bookings.filter((booking) => booking.status === "Accepted").length;
  const rejectedCount = rejectedBookings.length;

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Total Bookings</h2>
          <p className="text-3xl font-semibold text-blue-600">{totalBookings}</p>
        </div>
        <div className="bg-yellow-100 shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Pending</h2>
          <p className="text-3xl font-semibold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-green-100 shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Accepted</h2>
          <p className="text-3xl font-semibold text-green-600">{acceptedCount}</p>
        </div>
        <div className="bg-red-100 shadow-md rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Rejected</h2>
          <p className="text-3xl font-semibold text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Pending Bookings Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Pending Bookings</h2>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-600">No pending bookings available.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{booking.client}</td>
                  <td className="px-4 py-2">{booking.eventName}</td>
                  <td className="px-4 py-2">{booking.eventDate}</td>
                  <td className="px-4 py-2">{booking.location}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Booking History Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        {bookingHistory.length === 0 ? (
          <p className="text-gray-600">No booking history available.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{booking.client}</td>
                  <td className="px-4 py-2">{booking.eventName}</td>
                  <td className="px-4 py-2">{booking.eventDate}</td>
                  <td className="px-4 py-2">{booking.location}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Dialog for viewing booking details */}
      {selectedBooking && (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>{selectedBooking.eventName}</DialogTitle>
          <DialogContent>
            <p>
              <strong>Client: </strong> {selectedBooking.client}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.eventDate}
            </p>
            <p>
              <strong>Location:</strong> {selectedBooking.location}
            </p>
            <p>
              <strong>Description:</strong> {selectedBooking.description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Chip
                label={selectedBooking.status}
                color={
                  selectedBooking.status === "Rejected"
                    ? "error"
                    : selectedBooking.status === "Accepted"
                    ? "success"
                    : "default"
                }
              />
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}


