import React from "react";

const HamburgerToggle = (props: { sidebarOpen: boolean; setSidebarOpen: (value: boolean) => void }) => {
  return (
      <button
        aria-controls="sidebar"
        onClick={() => {
          props.setSidebarOpen(!props.sidebarOpen); // Pass a boolean directly
        }}
        className=" block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
      >
        
        <span className="relative block h-5.5 w-5.5 cursor-pointer">
          <span className="du-block absolute right-0 h-full w-full">
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-[0] duration-200 ease-in-out ${
                !props.sidebarOpen && "!w-full delay-300"
              }`}
            ></span>
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-150 duration-200 ease-in-out  ${
                !props.sidebarOpen && "delay-400 !w-full"
              }`}
            ></span>
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-dark delay-200 duration-200 ease-in-out  ${
                !props.sidebarOpen && "!w-full delay-500"
              }`}
            ></span>
          </span>
          <span className="absolute right-0 h-full w-full rotate-45">
            <span
              className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-dark delay-300 duration-200 ease-in-out  ${
                !props.sidebarOpen && "!h-0 !delay-[0]"
              }`}
            ></span>
            <span
              className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-dark duration-200 ease-in-out  ${
                !props.sidebarOpen && "!h-0 !delay-200"
              }`}
            ></span>
          </span>
        </span>
      </button>
  );
};

export default HamburgerToggle;
