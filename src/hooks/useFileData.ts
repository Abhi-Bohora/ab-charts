import { useState } from "react";
import Papa from "papaparse";

export const useFileData = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          const parsedData = results.data;
          if (parsedData.length === 0) {
            setError("No valid data found in the file");
            return;
          }

          setData({
            data: parsedData,
          });

          setError(null);
        } catch (err) {
          setError(`Error processing data: Invalid format: ${err}`);
        }
      },
    });
  };

  return { data, error, processFile };
};
