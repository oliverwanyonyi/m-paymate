import React, { useState } from "react";
import { createWorker } from "tesseract.js";

const OCRComponent = () => {
  const [utitlityName, setUtilityName] = useState("");
  const [utitlityAmount, setUtilityAmount] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const worker = await createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(file);
    await worker.terminate();
    // Extract utility name and amount from the OCR data
    const lines = data.text.split("\n");

    const utilityNameRegex = /Rent:\s*(.*)/i;
    const utilityAmountRegex = /Amount:\s*\$?(\d+(\.\d{1,2})?)/i;

    for (const line of lines) {
      const utilityNameMatch = line.match(utilityNameRegex);

      if (utilityNameMatch) {
        setUtilityName(utilityNameMatch[1].trim());
      }

      const utilityAmountMatch = line.match(utilityAmountRegex);
      if (utilityAmountMatch) {
        setUtilityAmount(parseFloat(utilityAmountMatch[1]));
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <p>Utility Name: {utitlityName}</p>
      <p>Utility Amount: {utitlityAmount}</p>
    </div>
  );
};

export default OCRComponent;
