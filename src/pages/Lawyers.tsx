import { CSSProperties, useState } from "react";
import { useLegalPractitioners } from "../hooks/useLegalPractitioners";
import { useCities } from "../hooks/useCities";
import { useLanguages } from "../hooks/useLanguages";
import { useServices } from "../hooks/useServices";
import { useQueryClient } from "react-query";
import { LAWAYERS_QUERY_KEY } from "../constants";

const Lawyers = () => {
  const [selectedServices, selectService] = useState<string[]>([""]);
  const [selectedCity, selectCity] = useState("");
  const [selectedLang, selectLang] = useState([""]);

  const queryClient = useQueryClient();
  const {
    data: lawyerResponse,
    isLoading,
  } = useLegalPractitioners(selectedLang, selectedCity, selectedServices);
  const { data: cities } = useCities();
  const { data: languages } = useLanguages();
  const { data: services } = useServices();

  const [shouldShowCities, showCities] = useState(true);
  const [shouldShowLangauges, showLanguages] = useState(false);
  const [shouldShowService, showServices] = useState(false);

  const sidebarStyles: CSSProperties =  {
    position: "fixed",
    top: "95px",
    bottom: 0,
    left: 0,
    width: "250px",
    padding: "20px",
    overflowY: "scroll"
  }
  const mainContentStyle: CSSProperties = {
      marginLeft: "270px" /* Adjust based on sidebar width */
  }
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
                  {cities?.result?.map((city) => (
                    <div>
                      <label key={city} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="cities"
                          onChange={(e) => {
                            selectCity((_) => {
                              e.target.checked;
                              return city;
                            });
                            queryClient.invalidateQueries({
                              queryKey: [LAWAYERS_QUERY_KEY],
                            });
                          }}
                        />
                        {city}
                      </label>
                    </div>
                  ))}
                  {cities?.result?.length && (
                    <a
                      href=""
                      onClick={() => {
                        selectCity("");
                      }}
                    >
                      Clear
                    </a>
                  )}
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
                {languages?.result?.map((lang) => (
                  <div>
                    <label key={lang} style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          selectLang((prev) =>
                            e.target.checked
                              ? [...prev, lang]
                              : [...prev].filter((m) => m !== lang)
                          );
                          queryClient.invalidateQueries({
                            queryKey: [LAWAYERS_QUERY_KEY],
                          });
                        }}
                      />
                      {lang}
                    </label>
                  </div>
                ))}
                {languages?.result?.length && (
                  <a
                    href=""
                    onClick={() => {
                      selectLang([]);
                    }}
                  >
                    Clear
                  </a>
                )}
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
                {services?.result?.data?.map((service) => (
                  <div>
                    <label key={service.id} style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          selectService((prev) =>
                            e.target.checked
                              ? [...prev, service.title ?? ""]
                              : [...prev].filter((m) => m !== service.title)
                          );
                          queryClient.invalidateQueries({
                            queryKey: [LAWAYERS_QUERY_KEY],
                          });
                        }}
                      />
                      {service.title}
                    </label>
                  </div>
                ))}
                {services?.result?.totalCount && (
                  <a
                    href=""
                    onClick={() => {
                      selectService([]);
                    }}
                  >
                    Clear
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-10 col-sm-12 row" style={mainContentStyle}>
        <h2>List of Lawyers</h2>
        {isLoading ? (
          <p>Loading</p>
        ) : lawyerResponse?.result?.data &&
          lawyerResponse?.result?.data.length ? (
          lawyerResponse?.result?.data.map((item) => {
            return (
              <div
                key={item.userId}
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
    </div>
  );
};

export default Lawyers;
