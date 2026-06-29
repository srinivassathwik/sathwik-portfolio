import { useRef, useState } from "react";
import { uploadResume } from "../../hooks/useResumeUpload";

export default function ResumeUploader({ onUploaded }) {

  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const [fileName, setFileName] = useState("");

  const chooseFile = () => {
    inputRef.current.click();
  };

  const handleFile = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setFileName(file.name);

    try {

      setUploading(true);

      const url = await uploadResume(file);

      if (onUploaded) {
        onUploaded(url);
      }

      alert("✅ Resume updated successfully.");

    } catch (err) {

      alert(err.message);

    } finally {

      setUploading(false);

    }

  };

  return (
    <div style={{ marginTop: "20px" }}>


      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      <button
        type="button"
        className="cta-secondary"
        data-cursor-hover
        onClick={chooseFile}
        disabled={uploading}
      >
        <span>
          {uploading ? "Uploading..." : "Update Resume"}
        </span>
      </button>

      {fileName && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "14px"
          }}
        >
          Selected:
          <br />
          {fileName}
        </div>
      )}

    </div>
  );

}