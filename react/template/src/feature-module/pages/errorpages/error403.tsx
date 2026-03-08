import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";

const Error403 = () => {
  const route = all_routes;

  return (
    <div className="main-wrapper">
      <div className="error-box">
        <div className="error-img">
          <img
            src="/src/assets/img/authentication/error-403.svg"
            className="img-fluid"
            alt="403 Forbidden"
            onError={(e) => {
              // Fallback if image doesn't exist
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <h3 className="h2 mb-3">
          <i className="fas fa-ban me-2 text-danger"></i>403 - Access Forbidden
        </h3>
        <p className="text-muted mb-4">
          Sorry, you don't have permission to access this page.
          <br />
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to={route.newdashboard} className="btn btn-primary">
            <i className="ti ti-home me-2"></i>
            Back to Dashboard
          </Link>
          <button
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            <i className="ti ti-arrow-left me-2"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error403;

