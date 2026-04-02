import { useState } from "react";

export const Parser = (text) => {
  const result = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char == '"') {
      inQuotes = !inQuotes;
    } else if ((char == "," || char == ";") && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if (char == "\n" && !inQuotes) {
      currentRow.push(currentCell.trim());
      result.push(currentRow);
      currentCell = "";
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell) currentRow.push(currentCell.trim());
  if (currentRow.length > 0) result.push(currentRow);

  const validRows = result.filter((r) => r.join("").trim() !== "");
  if (validRows.length < 2) return { headers: [], data: [] };

  const headers = validRows[0];
  console.log(headers);
  const data = validRows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((header, index) => {
      let value = r[index] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      obj[header] = value;
    });
    return obj;
  });

  return { headers, data };
};

export default function CsvUploader() {
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const result = Parser(text);
      console.log("Результат парсера:", result.headers);
      if (result.headers.length > 0) {
        setHeaders(result.headers);
        setCsvData(result.data);
      }
    };

    reader.readAsText(file);
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
              : "Перетащите файл или нажмите, чтобы выбрать"}
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
