import React from "react";
import { Handle } from "reactflow";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useWorkflowContext } from "../context/WorkFlowContext"; // Accessing the context

const NodeInput = () => {
  const { inputText, updateInputText } = useWorkflowContext(); // Using context to store the input value

  const formik = useFormik({
    initialValues: { inputText: inputText },
    validationSchema: Yup.object({
      inputText: Yup.string().required("Input is required."),
    }),
    validateOnChange: true, // Validate on every change
    onSubmit: (values) => {
      // You can handle form submission here if needed
    },
  });

  // Handle change for the input field
  const handleInputChange = (e) => {
    const { value } = e.target;
    
    formik.handleChange(e); // Call formik's handleChange to update formik state
    updateInputText(value); // Update the context state
  };

  const hasError = formik.touched.inputText && formik.errors.inputText;
  const hasInteracted = formik.touched.inputText; // To check if the user interacted with the input

  return (
    <div
      className={`bg-white pb-[70px] rounded-[20px]  ${
        hasInteracted
          ? hasError
            ? "border-red-500"
            : "border-green-500"
          : "border-none"
      }`}
      style={{ borderWidth: hasInteracted ? "1px" : "0px" }}
    >
      {/* Title */}
      <div className="flex px-6 py-3 gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/input.svg" alt="Run" className="h-[20px] w-[20px]" />
          <h4 className="text-lg font-[600] text-black">INPUT</h4>
        </div>
        {/* Status Circle */}
        <div
          className={`h-3 w-3 rounded-full ${
            hasInteracted
              ? hasError
                ? "bg-red-500"
                : "bg-green-500"
              : "bg-gray-400"
          }`}
        ></div>
      </div>

      {/* Instruction Box */}
      <div className="mb-4 w-full p-4 bg-[#EEF4FF]">
        <p className="text-[#666666] opacity-45 text-[14px] font-medium">
          Write the input/question you want to ask
        </p>
      </div>

      {/* Input Field */}
      <div className="px-6">
        <label
          htmlFor="inputText"
          className="text-left text-sm font-medium text-gray-700"
        >
          Input Text
        </label>
        <input
          id="inputText"
          name="inputText"
          type="text"
          value={formik.values.inputText}
          onChange={handleInputChange} // Use custom handler for both formik and context updates
          onBlur={formik.handleBlur}
          placeholder="Type Something..."
          className={`mt-1 w-full px-3 py-2 border text-black text-[14px] rounded-[4px] focus:outline-none ${
            hasInteracted
              ? hasError
                ? "border-red-500"
                : "border-green-500"
              : "border-gray-300"
          }`}
        />
        {hasError ? (
          <p className="mt-1 text-sm text-red-500">{formik.errors.inputText}</p>
        ) : null}
      </div>

      {/* Output handle for connecting to the next node */}
      <Handle
        type="source"
        position="right"
        id="output"
        className="mt-10"
        style={{ background: "#555", marginTop: "15px" }}
      />
    </div>
  );
};

export default NodeInput;
