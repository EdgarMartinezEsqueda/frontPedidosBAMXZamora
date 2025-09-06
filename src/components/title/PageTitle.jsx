import { useEffect } from "react";

const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | BAMX Tepatitlán`; // Formato personalizado
  }, [title]);

  return children;
};

export default PageTitle;