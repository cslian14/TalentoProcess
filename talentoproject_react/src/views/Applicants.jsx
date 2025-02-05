import React, { useEffect, useState } from "react";
import axios from "../axiosClient";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("/getApplicants", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications.");
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      const response = await axios.put(
        `/applications/${applicationId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Application approved.");
        fetchApplications();
      } else {
        toast.error("Failed to approve application. Unexpected response.");
      }
    } catch (error) {
      console.error("Error approving application:", error.response || error);
      toast.error(
        error.response?.data?.error || "Failed to approve application."
      );
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const response = await axios.put(
        `/applications/${applicationId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Application rejected.");
        fetchApplications();
      } else {
        toast.error("Failed to reject application. Unexpected response.");
      }
    } catch (error) {
      console.error("Error rejecting application:", error.response || error);
      toast.error(
        error.response?.data?.error || "Failed to reject application."
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 3,
        backgroundColor: "#f59e0b", // Match Dashboard style
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: 600,
          color: "white",
          mb: 2,
        }}
      >
        Performer Applications
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "10px",
          overflow: "auto",
          maxHeight: "400px",
        }}
      >
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {applications.length > 0 ? (
              applications.map((application) => (
                <Box
                  key={application.id}
                  sx={{
                    padding: 2,
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                  }}
                >
                  <Typography>
                    <strong>Performer Name:</strong> {application.performer_name}
                  </Typography>
                  <Typography>
                    <strong>Posts Event:</strong> {application.posts_event}
                  </Typography>
                  <Typography>
                    <strong>Posts Theme:</strong> {application.posts_theme}
                  </Typography>
                  <Typography>
                    <strong>Talent:</strong> {application.performer_talent}
                  </Typography>
                  <Typography>
                    <strong>Requested On:</strong>{" "}
                    {dayjs(application.requested_on).format(
                      "MMM DD, YYYY h:mm A"
                    )}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        backgroundColor: "#FBBF24",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "0.8em",
                      }}
                    >
                      {application.status}
                    </span>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(application.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleReject(application.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography align="center">No applications found.</Typography>
            )}
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Performer Name</TableCell>
                <TableCell>Posts Event</TableCell>
                <TableCell>Posts Theme</TableCell>
                <TableCell>Talent</TableCell>
                <TableCell>Requested On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.performer_name}</TableCell>
                    <TableCell>{application.posts_event}</TableCell>
                    <TableCell>{application.posts_theme}</TableCell>
                    <TableCell>{application.performer_talent}</TableCell>
                    <TableCell>
                      {dayjs(application.requested_on).format(
                        "MMM DD, YYYY h:mm A"
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          backgroundColor: "#FBBF24",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          fontSize: "0.8em",
                        }}
                      >
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(application.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleReject(application.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}
