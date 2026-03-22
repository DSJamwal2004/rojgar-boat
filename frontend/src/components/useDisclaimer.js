import { useEffect, useState } from "react";

const useDisclaimer = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const status = sessionStorage.getItem("rojgarDisclaimerAccepted");
    if (!status) {
      setAccepted(false);
    }
  }, []);

  const acceptDisclaimer = () => {
    sessionStorage.setItem("rojgarDisclaimerAccepted", "true");
    setAccepted(true);
  };

  return { accepted, acceptDisclaimer };
};

export default useDisclaimer;