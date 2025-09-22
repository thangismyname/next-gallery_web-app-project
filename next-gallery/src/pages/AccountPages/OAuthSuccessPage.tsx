// pages/OauthSuccessPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OauthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Save token in localStorage (or cookies if you prefer)
      localStorage.setItem("authToken", token);

      // Redirect to dashboard (or home)
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Finishing login... Please wait.</p>;
};

export default OauthSuccess;
