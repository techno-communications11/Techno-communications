import { useState } from "react";

function ResumeUpload({ setFile }) {
   const [error,setError]=useState(null);
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload only PDF or Word documents.")
        e.target.value = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB.")
        e.target.value = null;
        return;
      }

      setFile(file); // Set the file in parent state
    }
  };

  return (
    <div>
      <label className="d-flex text-start my-1 ms-2">
        Upload Resume (Optional) (PDF/DOC/DOCX - Max Size 5MB)
       {
        error&&<span className="text-danger">{"  "}{error}</span>
       }
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        className="form-control mb-2 border shadow-none"
        onChange={handleFile}
      />
    </div>
  );
}

export default ResumeUpload;
