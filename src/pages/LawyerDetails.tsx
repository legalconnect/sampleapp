import { useLocation } from "react-router-dom";
import {
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_AvailableTimeDto,
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_GetLegalPractitionerOutputDto as Lawyer,
} from "../services/types.gen";
import { useLegalPractitionerSchedule } from "../hooks/useLegalPractitioners";
import { getTime } from "../utils/dateParse";

import "./LawyerDetails.css";

export default function LawyerDetails() {
  const { state } = useLocation();
  const lawyer = state?.item as Lawyer;

  var schedule = useLegalPractitionerSchedule(lawyer.userId ?? "").data;

  const availableSlot = (
    date: Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_AvailableTimeDto,
    day: string
  ) => (
    <p key={date.startTime} className="mt-4">
      {day}: {"   "}
      <button className="btn btn-outline-warning">
        {getTime(date.startTime!) + " "} to {getTime(date.endTime!)}
      </button>
    </p>
  );
  return (
    <>
      <section className="bg-light">
        <div className="">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-sm-5">
              <div className="card card-style1 border-0">
                <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                      <img
                        src={lawyer.avatar ?? ""}
                        alt="..."
                        style={{
                          width: "100%",
                          aspectRatio: 1,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="col-lg-6 px-xl-10">
                      <div className="bg-secondary-ld d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                        <h3 className="h2 text-white mb-0">
                          {lawyer.firstName} {lawyer.lastName}
                        </h3>
                        <span className="text-white">
                          Rating: {lawyer.averageRating}/5
                        </span>
                      </div>
                      <ul className="list-unstyled mb-1-9">
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            About Me:
                          </span>{" "}
                          {lawyer.bio}
                        </li>
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            Expertise:
                          </span>{" "}
                          {lawyer.services?.map((serv) => (
                            <span>{serv.title + " | "}</span>
                          ))}
                        </li>
                        <li className="mb-2 mb-xl-3 display-28">
                          <span className="display-26 text-secondary me-2 font-weight-600">
                            Language(s):
                          </span>{" "}
                          {lawyer.languages?.map((lang) => (
                            <span key={lang.id}>{lang.name + " | "}</span>
                          ))}
                        </li>

                        {schedule?.result && (
                          <li className="mb-2 mb-xl-3 display-28">
                            <span className="display-26 text-secondary me-2 font-weight-600">
                              Schedule: (Book Appointment)
                            </span>{" "}
                            {schedule?.result?.monday?.map((date) => (
                              availableSlot(date,"Monday")
                            ))}
                            {schedule?.result?.tuesday?.map((date) => (
                              availableSlot(date,"Tuesday")
                            ))}
                            {schedule?.result?.wednesday?.map((date) => (
                              availableSlot(date,"Wednesday")
                            ))}
                            {schedule?.result?.thursday?.map((date) => (
                              availableSlot(date,"Thursday")
                            ))}
                            {schedule?.result?.friday?.map((date) => (
                              availableSlot(date,"Friday")
                            ))}
                            {schedule?.result?.saturday?.map((date) => (
                              availableSlot(date,"Saturday")
                            ))}
                            {schedule?.result?.sunday?.map((date) => (
                              availableSlot(date,"Sunday")
                            ))}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
