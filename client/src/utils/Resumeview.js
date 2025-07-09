import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API_URL from "../Constants/ApiUrl";
import Loader from "./Loader";

function ResumeView() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const applicant_uuid = searchParams.get("applicant_uuid");

  const [resumeUrl, setResumeUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserResume = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/resume/${applicant_uuid}`, {
        method: "GET",
        credentials: "include",
      });
      console.log("Fetch response:", res);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Parsed data:", data);
      if (!data.file_url) {
        throw new Error("No file_url in response");
      }
      setResumeUrl(data.file_url);
    } catch (err) {
      console.error("Error fetching resume:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicant_uuid) getUserResume();
  }, [applicant_uuid]);

  // Render resume inline using Google Docs Viewer
  let resumeContent = null;
  if (resumeUrl) {
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;
    resumeContent = (
      <iframe
        src={googleDocsUrl}
        title="Resume"
        style={{ width: "100%", height: "800px", border: "none" }} // Increased height for better viewing
        onError={() => setError("Failed to load resume")}
      />
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resume View</h1>
      <p className="text-gray-800 mb-2">
        Applicant UUID: <strong>{applicant_uuid}</strong>
      </p>

      {loading && <loader/>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {resumeContent}
    </div>
  );
}

export default ResumeView;