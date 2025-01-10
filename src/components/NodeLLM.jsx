import React from "react";
import { Handle } from "reactflow";
import { useWorkflowContext } from "../context/WorkFlowContext";
import * as Yup from "yup";
import { useFormik } from "formik";

const NodeLLM = () => {
  const { llmConfig, updateLlmConfig } = useWorkflowContext(); // Access context values and updater function

  // Validation schema using Yup
  const validationSchema = Yup.object({
    apiKey: Yup.string().required("API Key is required."),
    model: Yup.string()
      .notOneOf(["-1"], "Model selection is required.")
      .required("Model is required."),
    maxTokens: Yup.number()
      .positive("Max Tokens must be a positive number.")
      .required("Max Tokens is required."),
    temperature: Yup.number()
      .min(0, "Temperature must be between 0 and 1.")
      .max(1, "Temperature must be between 0 and 1.")
      .required("Temperature is required."),
    topK: Yup.number()
      .positive("Top K must be a positive integer.")
      .required("Top K is required."),
    repetition_penalty: Yup.number()
      .min(0, "Repetition Penalty must be a non-negative number.")
      .required("Repetition Penalty is required."),
  });

  // useFormik hook for handling form state
  const formik = useFormik({
    initialValues: llmConfig, // Initial values from context
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // You can handle form submission here if needed
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
    updateLlmConfig({ ...llmConfig, [name]: value }); // Save values immediately on change
  };

  // Helper to check if there are any errors
  const hasError = Object.keys(formik.errors).some(
    (key) => formik.touched[key] && formik.errors[key]
  );

  const hasInteracted = formik.touched.apiKey || formik.touched.model || formik.touched.temperature || formik.touched.topK || formik.touched.repetition_penalty; // To check if the user interacted with the input

  return (
    <div
      className={`bg-white pb-[70px] rounded-[20px] ${
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
          <img src="/llm.svg" alt="LLM" className="h-[20px] w-[20px]" />
          <h4 className="text-lg font-[600] text-black">LLM ENGINE</h4>
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

      <div className="mb-4 w-full p-4 bg-[#EEF4FF]">
        <p className="text-[#666666] opacity-45 text-[14px] font-medium">
          Provide the Configuration to LLM
        </p>
      </div>

      {/* Form Section */}
      <form className="px-6 space-y-4" onSubmit={formik.handleSubmit}>
        {/* API Key */}
        <div >
        <label
          htmlFor="apiKey"
          className="text-left text-sm  font-medium text-gray-700"
        >
          API Key
        </label>
          <input
            type="text"
            name="apiKey"
            placeholder="API Key"
            value={formik.values.apiKey}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 mt-3 border rounded-lg focus:outline-none ${
              formik.touched.apiKey
                ? formik.errors.apiKey
                  ? "border-red-500"
                  : "border-green-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.apiKey && formik.errors.apiKey && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.apiKey}</p>
          )}
        </div>

        {/* Model Dropdown */}
        <div>
        <label
          htmlFor="model"
          className="text-left text-sm  font-medium text-gray-700"
        >
          Modal
        </label>
          <select
            name="model"
            value={formik.values.model}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 mt-3 border rounded-lg focus:outline-none ${
              formik.touched.model
                ? formik.errors.model
                  ? "border-red-500"
                  : "border-green-500"
                : "border-gray-300"
            }`}
          >
            <option value="-1">Select Model</option>
            <option value="meta-llama/Llama-3.3-70B-Instruct-Turbo">
              meta-llama/Llama-3.3-70B-Instruct-Turbo
            </option>
            <option value="Qwen/QwQ-32B-Preview">
              Qwen/QwQ-32B-Preview
            </option>
          </select>
          {formik.touched.model && formik.errors.model && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.model}</p>
          )}
        </div>

        {/* Max Tokens */}
        <div>
        <label
          htmlFor="maxTokens"
          className="text-left text-sm  font-medium text-gray-700"
        >
          Max Tokens
        </label>
          <input
            type="number"
            name="maxTokens"
            placeholder="Max Tokens"
            value={formik.values.maxTokens}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 mt-3 py-2 border rounded-lg focus:outline-none ${
              formik.touched.maxTokens
                ? formik.errors.maxTokens
                  ? "border-red-500"
                  : "border-green-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.maxTokens && formik.errors.maxTokens && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.maxTokens}</p>
          )}
        </div>

        {/* Temperature */}
        <div>
        <label
          htmlFor="temperature"
          className="text-left text-sm  font-medium text-gray-700"
        >
          Temperature
        </label>
          <input
            type="number"
            name="temperature"
            placeholder="Temperature (0-1)"
            value={formik.values.temperature}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 mt-3 py-2 border rounded-lg focus:outline-none ${
              formik.touched.temperature
                ? formik.errors.temperature
                  ? "border-red-500"
                  : "border-green-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.temperature && formik.errors.temperature && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.temperature}</p>
          )}
        </div>

        {/* Top K */}
        <div>

        <label
          htmlFor="topK"
          className="text-left text-sm  font-medium text-gray-700"
        >
          Top K
        </label>
          <input
            type="number"
            name="topK"
            placeholder="Top K"
            value={formik.values.topK}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            className={`w-full mt-3 px-3 py-2 border rounded-lg focus:outline-none ${
              formik.touched.topK
                ? formik.errors.topK
                  ? "border-red-500"
                  : "border-green-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.topK && formik.errors.topK && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.topK}</p>
          )}
        </div>

        {/* Repetition Penalty */}
        <div>
        <label
          htmlFor="repetition_penalty"
          className="text-left text-sm  font-medium text-gray-700"
        >
          Repetition Penalty
        </label>
          <input
            type="number"
            name="repetition_penalty"
            placeholder="Repetition Penalty"
            value={formik.values.repetition_penalty}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            className={`w-full mt-3 px-3 py-2 border rounded-lg focus:outline-none ${
              formik.touched.repetition_penalty
                ? formik.errors.repetition_penalty
                  ? "border-red-500"
                  : "border-green-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.repetition_penalty && formik.errors.repetition_penalty && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.repetition_penalty}</p>
          )}
        </div>
      </form>

      {/* Handles */}
      <Handle
        type="target"
        position="left"
        id="input"
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default NodeLLM;
