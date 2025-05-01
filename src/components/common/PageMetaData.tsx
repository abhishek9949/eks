import React, { useEffect } from "react";

const PageMetaData = ({ title = "The Teachers Table" }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <></>;
};

export default PageMetaData;
