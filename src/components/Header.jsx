import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const Header = ({ handleRunWorkflow }) => {
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const toast = useRef(null); // Reference to the Toast component

  const handleRun = async () => {
    console.log("Logging from the handle flow");

    setIsLoading(true);

    try {
      await handleRunWorkflow();
      // Show success toast with green color
      toast.current.show({
        severity: "success",
        summary: "Flow Ran Successfully",
        detail: "The flow ran successfully without any issues.",
        life: 3000, // Duration in ms
      });
    } catch (error) {
      // Show error toast with red color
      toast.current.show({
        severity: "error",
        summary: "Error while running the flow",
        detail: `${error.message || "An unknown error occurred"}`,
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-md">
      <div className="flex gap-2 items-center">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className="h-[33px] w-[33px]" 
        />
        <span className="font-[700] text-[18px] leading-[21px]">OpenAGI</span>
      </div>

      <button
        onClick={handleRun}
        className={`flex ${isLoading ? "opacity-45" : ""} items-center bg-[#44924C] px-4 gap-2 py-2 rounded-[8px]`}
        disabled={isLoading}
      >
        <img 
          src="/run.svg" 
          alt="Run" 
          className="h-[14px] w-[14px]" 
        />
        <span className="font-[700] text-[14px] text-white">Run</span>
      </button>

      {/* PrimeReact Toast component */}
      <Toast ref={toast} />
    </header>
  );
};

export default Header;
