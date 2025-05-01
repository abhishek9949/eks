import { FAQConstants } from "@/constants/landingPageConstants";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";

const FAQComponent = () => {
  return (
    <div className="bg-white p-6 mt-10 mb-15" id="faq-section">
      <div className="flex flex-col items-center gap-4 text-gray-17">
        <p className="text-4xl font-bold mb-5">Frequently Asked Questions</p>
        {FAQConstants?.map((faq, index) => (
          <div key={faq?.title}>
            <hr className="!border-gray-300" />
            <Accordion className="!shadow-none !p-2">
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined className="text-black" />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <span className="px-3 text-xl font-semibold">{faq?.title}</span>
              </AccordionSummary>
              <AccordionDetails className="!px-7 text-sm font-light">
                {faq?.description}
              </AccordionDetails>
            </Accordion>
            {index === (FAQConstants?.length - 1) && <hr className="!border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;