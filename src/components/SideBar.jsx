import React from "react";


const Sidebar = () => {
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData("nodeType", nodeType);
  };

  return (
    <div className="w-64 ml-5 my-5 min-h-[82vh] rounded-[20px] bg-white p-4 shadow-md">
      {/* Title Section */}
      <h3 className="text-lg font-[500] mb-2">Components</h3>
      <hr className="mb-4 border-gray-200" />

      <h3 className="text-[14px] text-gray-300  mb-4  font-[400] ">Drag and Drop</h3>

      {/* Node List */}
      {["input", "llm", "output"].map((nodeType) => (
        <div
          key={nodeType}
          draggable
          onDragStart={(e) => handleDragStart(e, nodeType)}
          className="mb-4 flex items-center justify-between p-3 border-black border rounded-[5px] cursor-grab "
        >
          {/* Left Section: Image and Title */}
          <div className="flex items-center space-x-1">
            <img
              src={`/${nodeType}.svg`} // Update with the actual path to your SVG files.
              alt={`${nodeType} icon`}
              className="h-[12px] w-[12px]"
            />
            <span className=" text-[12px] font-[400] text-black">
              {nodeType.toUpperCase()}
            </span>
          </div>

          {/* Right Section: Hamburger Icon */}
          <img
              src={`/burger.svg`} // Update with the actual path to your SVG files.
              alt={`hamburger icon`}
              className="h-[7px] w-[10px]"
            />
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
