import { useCallback, useState } from "react";
import Papa from "papaparse";

export default function CsvUploader() {
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.meta.fields) {
          setHeaders(result.meta.fields);
          setCsvData(result.data);
        }
      },
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="app-container">
      <div className="page-wrapper">
        <h1 className="title">Аналитика расходов</h1>
        <div
          className={`drop-zone ${isDragActive ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleChange}
          />

          <p>
            {isDragActive
              ? "Бросьте файл сюда"
              : "Перетащите файл сюда или нажмите"}
          </p>
        </div>

        {headers.length > 0 && (
          <div className="results-card">
            <p>Найденные заголовки:</p>
            <div className="badges-container">
              {headers.map((h, i) => (
                <span key={i} className="badge">
                  {h}
                </span>
              ))}
            </div>
            <p>Строк в файле: {csvData.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
