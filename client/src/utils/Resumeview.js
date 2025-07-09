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
      <div className="card">
        <div className="card-body p-0">
          <iframe
            src={googleDocsUrl}
            title="Resume"
            className="w-100 border-0"
            style={{ height: "800px" }}
            onError={() => setError("Failed to load resume")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header Section */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h1 className="h3 mb-0">
                <i className="fas fa-file-alt me-2"></i>
                Resume View
              </h1>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <span className="badge bg-secondary me-2">Applicant UUID:</span>
                <span className="fw-bold text-dark">{applicant_uuid}</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="text-center">
                <Loader />
                <p className="mt-3 text-muted">Loading resume...</p>
              </div>
            </div>
          )}

          {/* Error State */}
         {error && (
  <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-6">
    <div className="max-w-md mx-auto">
    
      
      <h2 className="text-3xl font-bold text-gray-800 mb-3">
        No Resume Found
      </h2>
      
      <p className="text-lg text-gray-600 mb-6">
        We couldn't find a resume for this applicant.
      </p>
      
     
      
      
    </div>
  </div>
)}

          {/* Resume Content */}
          {resumeContent && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-eye me-2"></i>
                      Resume Preview
                    </h5>
                    <div className="btn-group" role="group">
                      <button 
                        type="button" 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => window.open(resumeUrl, '_blank')}
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Open in New Tab
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = resumeUrl;
                          link.download = `resume_${applicant_uuid}.pdf`;
                          link.click();
                        }}
                      >
                        <i className="fas fa-download me-1"></i>
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    {resumeContent}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !resumeUrl && (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-file-alt fa-4x text-muted mb-4"></i>
                <h2 className="fw-bold text-dark mb-3" style={{ fontSize: '2.5rem' }}>
                  No Resume
                </h2>
                <p className="text-muted fs-5 mb-0">
                  No resume is available for this applicant.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeView;