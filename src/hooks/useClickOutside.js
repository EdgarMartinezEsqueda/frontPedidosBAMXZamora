import { useEffect } from "react";

const useClickOutside = (refs, callback) => {
  const handleClick = (e) => {
    if (refs.every(ref => 
      ref.current && !ref.current.contains(e.target)
    )) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};

export default useClickOutside;