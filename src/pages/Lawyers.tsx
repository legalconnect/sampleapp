import { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLegalPractitioners } from "../hooks/useLegalPractitioners";
import { useCities } from "../hooks/useCities";
import { useLanguages } from "../hooks/useLanguages";
import { useServices } from "../hooks/useServices";
import InfiniteScroll from "react-infinite-scroll-component";
import { Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_GetLegalPractitionerOutputDto as LegalPractitioner } from "../services";

const Lawyers = () => {
  const [selectedServices, selectService] = useState<string[]>([""]);
  const [selectedCity, selectCity] = useState("");
  const [selectedLang, selectLang] = useState([""]);

  // Fetch Lawyers Page
  const {
    data: lawyerResponse,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useLegalPractitioners(selectedLang, selectedCity, selectedServices);

  const pages = lawyerResponse?.pages ?? [];

  let lawyers: LegalPractitioner[] = [];

  for (let index = 0; index < pages.length; index++) {
    const pagedList = pages[index].data;
    if (pagedList?.data) {
      lawyers = [...lawyers, ...pagedList.data];
    }
  }
  const { data: cities } = useCities();
  const { data: languages } = useLanguages();
  const { data: services } = useServices();

  const [shouldShowCities, showCities] = useState(true);
  const [shouldShowLangauges, showLanguages] = useState(false);
  const [shouldShowService, showServices] = useState(false);

  const sidebarStyles: CSSProperties = {
    position: "fixed",
    top: "95px",
    bottom: 0,
    left: 0,
    width: "250px",
    padding: "20px",
    overflowY: "scroll",
  };
  const mainContentStyle: CSSProperties = {
    marginLeft: "270px" /* Adjust based on sidebar width */,
  };

  const navigate = useNavigate();

  return (
    <div className="row">
      <div className="col-md-2 col-sm-12" style={sidebarStyles}>
        <h2>Filters</h2>
        <div className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#cities"
                aria-expanded="false"
                aria-controls="cities"
                onClick={() => showCities((prev) => !prev)}
              >
                Cities
              </button>
            </h2>
            <div
              id="cities"
              className={
                shouldShowCities
                  ? "accordion-collapse collapse show"
                  : "accordion-collapse collapse"
              }
            >
              <div className="accordion-body">
                <div>
                  {cities?.map((city) => (
                    <div key={city}>
                      <label className="form-check-label" style={{ cursor: "pointer" }}>
                        <input
                        className="form-check-input me-2"
                          type="radio"
                          name="cities"
                          onChange={() => {
                            selectCity(() => city);
                          }}
                        />
                        {city}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#languages"
                aria-expanded="false"
                aria-controls="languages"
                onClick={() => showLanguages((prev) => !prev)}
              >
                Languages
              </button>
            </h2>
            <div
              id="languages"
              className={
                shouldShowLangauges
                  ? "accordion-collapse collapse show"
                  : "accordion-collapse collapse"
              }
            >
              <div className="accordion-body">
                {languages?.map((lang, index) => (
                  <div key={lang + index}>
                    <label className="form-check-label" style={{ cursor: "pointer" }}>
                      <input
                      className="form-check-input me-2"
                        type="checkbox"
                        onChange={(e) => {
                          selectLang((prev) =>
                            e.target.checked
                              ? [...prev, lang]
                              : [...prev].filter((m) => m !== lang)
                          );
                        }}
                      />
                      {lang}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#services"
                aria-expanded="false"
                aria-controls="services-collapseThree"
                onClick={() => showServices((prev) => !prev)}
              >
                Services
              </button>
            </h2>
            <div
              id="services"
              className={
                shouldShowService
                  ? "accordion-collapse collapse show"
                  : "accordion-collapse collapse"
              }
            >
              <div className="accordion-body">
                {services?.data?.map((service) => (
                  <div key={service.id}>
                    <label className="form-check-label" style={{ cursor: "pointer" }}>
                      <input
                      className="form-check-input me-2"
                        type="checkbox"
                        onChange={(e) => {
                          selectService((prev) =>
                            e.target.checked
                              ? [...prev, service.title ?? ""]
                              : [...prev].filter((m) => m !== service.title)
                          );
                        }}
                      />
                      {service.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <InfiniteScroll
        dataLength={lawyerResponse ? lawyerResponse.pages.length : 0}
        next={() => fetchNextPage()}
        loader={<div>Loading</div>}
        hasMore={hasNextPage ?? false}
      >
        <div className="col-md-10 col-sm-12 row" style={mainContentStyle}>
          <h2>List of Lawyers</h2>
          {isLoading ? (
            <p>Loading</p>
          ) : lawyers && lawyers.length ? (
            lawyers.map((item) => {
              return (
                <div
                  key={item.userId}
                  onClick={() => {
                    navigate("/laywer-details", { state: { item } });
                  }}
                  className="card col-md-3 col-sm-4 col-xs-6 m-2"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.avatar ?? ""}
                    className="card-img-top p-2"
                    style={{ aspectRatio: 1, objectFit: "cover" }}
                    alt="..."
                  />
                  <div className="card-body">
                    <p className="card-text">
                      {item.firstName} {item.lastName}
                    </p>
                    <p>Rating: {item.averageRating}/5</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No Lawyers Found</p>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );

};

export default Lawyers;
