export default function PDFViewer({ pdf }) {
  return (
    <div className="fixed top-0 mt-[50px] left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white w-[100%] h-[100%] rounded-lg p-4">
        <iframe src={pdf} className="w-full h-full"></iframe>
      </div>
    </div>
  );
}
