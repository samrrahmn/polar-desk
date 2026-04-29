"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function DownloadButton({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const handleDownload = async () => {
    const res = await fetch(url);
    const blob = await res.blob();
    const fileUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(fileUrl);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex justify-between items-center p-4 rounded-lg bg-surface hover:bg-surface-2 transition border border-default w-full cursor-pointer"
    >
      <span className="text-sm font-semibold truncate">{name}</span>

      <FontAwesomeIcon
        icon={faDownload}
        style={{ width: "15px", height: "15px" }}
        className="text-muted"
      />
    </button>
  );
}
