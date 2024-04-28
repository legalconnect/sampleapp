import { useEffect, useState } from "react";
import { LegalPractitionersService } from "../services";
import { useQuery } from "react-query";


interface LegalPractitioner {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

const Lawyers = () => {

  const { data: lawyerResponse, isLoading } = useQuery({
    queryFn: () => LegalPractitionersService.getApiV1Legalpractitioners(),
    queryKey: "legalPractitioner",
  });

  // TODO fetch for API
  const listOfLawyers: LegalPractitioner[] = [
    { id: 1, name: "Jonas Asare", email: "jonas@gamil.com", avatar: "" },
    { id: 2, name: "Maafia Asare", email: "Maafia@gamil.com", avatar: "" },
    { id: 3, name: "Felicia Asare", email: "felicia@gamil.com", avatar: "" },
    {
      id: 4,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 5,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 6,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 7,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 8,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 9,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 10,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 11,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 12,

      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 13,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
    {
      id: 14,
      name: "Kwesi Asare",
      email: "kwasi@gamil.com",
      avatar: "https://placehold.co/400",
    },
  ];

  // TODO fetc list of API
  const languages: string[] = ["English", "Yuroba", "French"];
  const cities: string[] = ["Ife", "Lagos"];
  const services: string[] = ["Licences", "Probono", "Legal Aid"];

  const [shouldShowCities, showCities] = useState(true);
  const [shouldShowLangauges, showLanguages] = useState(true);
  const [shouldShowService, showServices] = useState(true);

  return (
    <div className="row">
      <div className="col-md-2 col-sm-12">
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
                  {cities.map((city) => (
                    <div>
                      <label key={city} style={{ cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          name="checkboxName"
                          id="checkboxId"
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
                {languages.map((lang) => (
                  <div>
                    <label key={lang} style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="checkboxName"
                        id="checkboxId"
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
                {services.map((service) => (
                  <div>
                    <label key={service} style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="checkboxName"
                        id="checkboxId"
                      />
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-10 col-sm-12 row">
        <h2>List of Lawyers</h2>
        {isLoading ? (
          <p>Loading</p>
        ) : 
        lawyerResponse?.result?.data ? (
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
