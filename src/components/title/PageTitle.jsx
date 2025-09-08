import { useEffect } from "react";

const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | BAMX Zamora`; // Formato personalizado
  }, [title]);

  return children;
};

export default PageTitle;