import React, { useState } from "react";
import axios from "axios";

const Meeting = ({ courseId }) => {
  // Destructure courseId from props
  const [meetingLink, setMeetingLink] = useState("");
  const [timing, setTiming] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to validate URL format
  const isValidUrl = (url) => {
    // Regular expression to validate URL format
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current date and time
    const currentDate = new Date();
    const currentTime = currentDate.toISOString().slice(0, 16);

    // Combine the selected date and time
    const selectedDateTime = new Date(`${date}T${timing}`);

    // Check if the selected date and time are in the past
    if (selectedDateTime <= currentDate) {
      setError("Meeting date and time cannot be in the past.");
      return;
    }

    // Check if any field is empty
    if (!meetingLink || !timing || !date) {
      setError("Please fill in all fields.");
      return;
    }

    // Check if the URL format is valid
    if (!isValidUrl(meetingLink)) {
      setError("Invalid URL format");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("got the courseId", courseId);
      await axios.post("http://localhost:8080/api/schedule-meeting", {
        courseId,
        meetingLink,
        timing,
        date,
      });
      alert("Meeting scheduled and email successfully!");
      setMeetingLink("");
      setTiming("");
      setDate("");
    } catch (error) {
      setError("An error occurred while scheduling the meeting.");
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-white justify-center">
      <div className="w-1/2 container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="meetingLink" className="block">
              Meeting Link:
            </label>
            <input
              type="text"
              id="meetingLink"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className={`mt-1 p-2 w-full border ${
                !isValidUrl(meetingLink) ? "border-red-500" : ""
              }`}
              required
            />
            {/* Display error message if URL format is invalid */}
            {!isValidUrl(meetingLink) && (
              <p className="text-red-500 text-sm">Invalid URL format</p>
            )}
          </div>
          <div>
            <label htmlFor="timing" className="block">
              Timing:
            </label>
            <input
              type="time"
              id="timing"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="mt-1 p-2 w-full border"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 w-full border"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Loading..." : "Schedule Meeting"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Meeting;
