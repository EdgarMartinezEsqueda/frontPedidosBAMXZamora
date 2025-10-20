import { FiPrinter } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";

const Print = ({ contentRef }) => {
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <section className="w-full flex justify-center items-center p-4">
      <button onClick={reactToPrintFn} className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-700 text-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium" >
        <FiPrinter className="text-lg" />
      </button>
    </section>
  );
}

export default Print;