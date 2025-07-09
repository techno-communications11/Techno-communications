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
        className="w-full h-[800px] border-none"
        onError={() => setError("Failed to load resume")}
      />
    );
  }

  // 404 Not Found design for missing UUID or errors
  const notFoundContent = (
    <div className="flex flex-col items-center justify-center mt-8">
      <img
        src="/404.webp"
        alt="404 Not Found"
        className="w-full max-w-md rounded-lg shadow-md mb-4"
      />
      
    </div>
  );

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Resume View</h1>
      {applicant_uuid && (
        <p className="text-gray-800 mb-4">
          Applicant UUID: <strong>{applicant_uuid}</strong>
        </p>
      )}

      {loading && <Loader />}
      {error || (!loading && !resumeContent && !applicant_uuid)
        ? notFoundContent
        : resumeContent}
    </div>
  );
}

export default ResumeView;