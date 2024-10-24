import { FileUpload } from "./components/DataInput/FileUpload";
import { useFileData } from "./hooks/useFileData";
function App() {
  const { data, error, processFile } = useFileData();
  return (
    <>
      <FileUpload onFileSelect={processFile} />
      {data ? console.log(data) : error}
    </>
  );
}

export default App;
