import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchProgress,
  getSession,
  isLoggedIn,
  toCareerSlug,
} from "../../utils/api";

/** Redirects to the active career recommendation page */
const CareerRedirect = () => {
  const navigate = useNavigate();
  const { userId } = getSession();
  const [msg, setMsg] = useState("Opening your career recommendation...");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchProgress(userId)
      .then((data) => {
        const slug =
          data?.currentCareer?.slug ||
          toCareerSlug(data?.progress?.recommendedCareer);
        if (slug) navigate(`/career/${slug}`, { replace: true });
        else {
          setMsg("No recommendation found.");
          navigate("/get-started", { replace: true });
        }
      })
      .catch(() => navigate("/get-started", { replace: true }));
  }, [userId, navigate]);

  return <p className="text-slate-500">{msg}</p>;
};

export default CareerRedirect;
