import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { authorize, userManager } from "../AuthManager";
import { useUser } from "../UserContext";

const Layout = () => {
  const user = useUser();
  const pages = [
    {
      title: "Appointment",
      route: "appointments",
    },
    {
      title: "Documents",
      route: "documents",
    },
  ];
  const [currentPage, setCurrentPage] = useState(-1);
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            LegalConnect Online
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {pages.map((item, index: number) => {
                return (
                  <Link
                    key={index}
                    className={
                      index === currentPage ? "nav-link active" : "nav-link"
                    }
                    to={item.route}
                    onClick={() => setCurrentPage(index)}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </ul>
            {/* Replace with Login Button &|| Client Profile Picture when authenticated */}
            {user ? (
              <button
                className="btn btn-outline-success"
                onClick={() => userManager.signoutPopup()}
              >
                Log Out
              </button>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={() => authorize()}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className="m-5">
        <Outlet />
      </div>
    </>
  );
};
export default Layout;
