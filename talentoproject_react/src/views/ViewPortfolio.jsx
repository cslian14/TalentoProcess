import React, { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Rating, TextField, Button } from "@mui/material";
import profilePlaceholder from "../assets/logotalentos.png";
import { useStateContext } from "../context/contextprovider";
import "react-toastify/dist/ReactToastify.css";

export default function ViewPortfolio() {
    const { portfolioId } = useParams(); // Get portfolioId from URL
    const [performer, setPerformer] = useState(null); // Holds the performer data
    const [activeTab, setActiveTab] = useState("overview");
    const [feedback, setFeedback] = useState([]); // Stores feedback for the performer
    const [newFeedback, setNewFeedback] = useState({ rating: 0, review: "" });
    const [canLeaveReview, setCanLeaveReview] = useState(false); // Check if the user can leave a review
    const { user } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure portfolioId exists before making the request
        if (!portfolioId) {
            navigate("/customer"); // Redirect if portfolioId is missing
            return;
        }

        // Fetch performer portfolio data based on portfolioId
        axiosClient
            .get(`/portfolio/${portfolioId}`) // Fetch based on portfolioId
            .then((response) => {
                const { portfolio, user, highlights, average_rating, feedback } = response.data;

                // Set performer details in state
                setPerformer({
                    ...portfolio,
                    user,
                    highlights,
                    average_rating,
                });

                // Store feedback in state
                setFeedback(feedback || []);
            })
            .catch((error) => {
                console.error("Error fetching portfolio:", error);
                toast.error("Failed to load portfolio data.");
                navigate("/customer"); // Redirect if error occurs
            });

        // Check if the user has a completed booking with the performer
        if (user) {
            axiosClient
                .get(`/performers/${portfolioId}/can-leave-review`)
                .then((response) => {
                    setCanLeaveReview(response.data.can_leave_review);
                })
                .catch((error) => {
                    console.error("Error checking review eligibility:", error);
                });
        }
    }, [portfolioId, navigate, user]);

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setNewFeedback((prevFeedback) => ({
            ...prevFeedback,
            [name]: value,
        }));
    };

    const handleFeedbackSubmit = () => {
        if (newFeedback.rating < 1) {
            toast.error("Please provide a rating of at least 1 star.");
            return;
        }

        axiosClient
            .post(`/performers/${portfolioId}/rate`, newFeedback)
            .then((response) => {
                toast.success("Feedback submitted successfully!");
                const newFeedbackWithUser = {
                    ...response.data.feedback,
                    user: {
                        id: user.id,
                        name: user.name,
                        image_profile: user.image_profile,
                    },
                };
                setFeedback((prevFeedback) => [...prevFeedback, newFeedbackWithUser]);
                setNewFeedback({ rating: 0, review: "" });
            })
            .catch((error) => {
                console.error("Error submitting feedback:", error);
                toast.error("Failed to submit feedback.");
            });
    };

    if (!performer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <ToastContainer />
            <main className="flex-1 p-4 sm:p-6 w-full max-w-5xl mx-auto">
                <section>
                    <div className="bg-gray-200 shadow rounded-lg overflow-hidden">
                        <h2 className="text-center text-4xl font-bold mb-5 mt-3 text-black">Portfolio</h2>
                        <div className="relative">
                            <img
                                src={profilePlaceholder}
                                alt="Cover Photo"
                                className="w-full h-80 md:h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-4 md:left-6 transform translate-y-1/2">
                                <img
                                    src={
                                        performer.user?.image_profile
                                            ? `http://192.168.254.114:8000/storage/${performer.user.image_profile}`
                                            : profilePlaceholder
                                    }
                                    alt="Profile Photo"
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white"
                                />
                            </div>
                        </div>

                        <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row items-start justify-between">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold mt-8">
                                        {performer.user?.name || "Performer Name Not Available"}
                                    </h2>
                                    <p className="text-sm text-gray-900">{performer.talent_name}</p>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-6 border-t border-b border-yellow-900">
                                <nav className="flex overflow-x-auto space-x-4 text-center">
                                    <button
                                        onClick={() => setActiveTab("overview")}
                                        className={`py-4 text-gray-900 font-semibold ${
                                            activeTab === "overview"
                                                ? "border-b-2 border-yellow-600"
                                                : "hover:border-b-2 hover:border-yellow-600"
                                        }`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("reviews")}
                                        className={`py-4 text-gray-900 font-semibold ${
                                            activeTab === "reviews"
                                                ? "border-b-2 border-yellow-600"
                                                : "hover:border-b-2 hover:border-yellow-600"
                                        }`}
                                    >
                                        Reviews
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("media")}
                                        className={`py-4 text-gray-900 font-semibold ${
                                            activeTab === "media"
                                                ? "border-b-2 border-yellow-600"
                                                : "hover:border-b-2 hover:border-yellow-600"
                                        }`}
                                    >
                                        Highlights Video
                                    </button>
                                </nav>
                            </div>

                            <div className="mt-4 md:mt-6">
                                {activeTab === "overview" && (
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            About {performer.user?.name || "Performer"}
                                        </h3>
                                        <p className="text-gray-800">{performer.description}</p>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-4">
                                            <p className="text-sm text-gray-800">Location: {performer.location}</p>
                                            <p className="text-sm text-gray-800">
                                                Email: {performer.user?.email || "Email Not Available"}
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                Phone: {performer.phone || "Phone Not Available"}
                                            </p>
                                            <p className="text-sm text-gray-800">Experience: {performer.experience} years</p>
                                            <p className="text-sm text-gray-800">Genres: {performer.genres}</p>
                                            <p className="text-sm text-gray-800">Type of Performer: {performer.performer_type}</p>
                                        </div>

                                        <div className="flex items-center mt-2 md:mt-4">
                                            <Rating
                                                value={Number(performer?.average_rating) || 0}
                                                readOnly
                                                precision={0.1}
                                                className="text-yellow-500"
                                            />
                                            <span className="ml-2 text-gray-600">
                                                ({Number(performer?.average_rating)?.toFixed(1) || "0.0"}/5,{" "}
                                                {feedback.length} reviews)
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="flex flex-col">
                                        <div className="max-h-80 overflow-y-auto border p-4 rounded-lg bg-gray-50 mb-6">
                                            {feedback.length > 0 ? (
                                                feedback.map((review) => (
                                                    <div key={review.id} className="border-b border-gray-200 py-4">
                                                        <div className="flex items-center mb-2">
                                                            <img
                                                                src={
                                                                    review.user?.image_profile
                                                                        ? `http://192.168.254.114:8000/storage/${review.user.image_profile}`
                                                                        : profilePlaceholder
                                                                }
                                                                alt="User Profile"
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                            <div className="ml-4">
                                                                <p className="font-semibold">
                                                                    {review.user?.name || "User"}{" "}
                                                                    {review.user?.lastname || ""}
                                                                </p>
                                                                <Rating
                                                                    value={Number(review.rating)}
                                                                    readOnly
                                                                    precision={0.1}
                                                                    className="text-yellow-500"
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600">{review.review}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">No reviews available.</p>
                                            )}
                                        </div>

                                        {canLeaveReview && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold">Leave a Review</h4>
                                                <Rating
                                                    name="rating"
                                                    value={newFeedback.rating}
                                                    onChange={(e, newValue) =>
                                                        setNewFeedback({ ...newFeedback, rating: newValue })
                                                    }
                                                />
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    name="review"
                                                    label="Write your review"
                                                    value={newFeedback.review}
                                                    onChange={handleFeedbackChange}
                                                    variant="outlined"
                                                    className="mt-4"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className="mt-4"
                                                    onClick={handleFeedbackSubmit}
                                                >
                                                    Submit Review
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "media" && (
                                    <div>
                                        <h3 className="font-semibold text-lg">Highlights Video</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                            {performer.highlights?.length > 0 ? (
                                                performer.highlights.map((video, index) => (
                                                    <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
                                                        <video className="w-full h-40 object-cover rounded-lg" controls>
                                                            <source
                                                                src={`http://192.168.254.114:8000/storage/${video.highlight_video}`}
                                                                type="video/mp4"
                                                            />
                                                        </video>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">No videos uploaded yet.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
