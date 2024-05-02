import { useLocation } from "react-router-dom";
import {
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_AvailableTimeDto,
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto,
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceVariationPackagesOutputDto,
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_GetLegalPractitionerOutputDto as Lawyer,
} from "../services/types.gen";
import { useLegalPractitionerSchedule } from "../hooks/useLegalPractitioners";
import { getTime } from "../utils/dateParse";

import "./LawyerDetails.css";
import { Modal } from "react-bootstrap";
import {
  useServiceDetails as useServiceDetails,
  useServiceVariationPackages,
} from "../hooks/usePackages";
import { UseQueryResult } from "react-query";
import { useState } from "react";
import { useClient } from "../hooks/useCities";
import PackageCard from "../components/PackageCard";

export default function LawyerDetails() {
  const { state } = useLocation();
  const lawyer = state?.item as Lawyer;
  const client = useClient();

  const [shouldShowServices, showServices] = useState(false);
  const services = lawyer.services?.map((m) => {
    return { ...m };
  });

  const [selectedService, selectService] =
    useState<Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto>(
      {}
    );

  const [selectedServiceVariation, selectServiceVariation] =
    useState<Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceVariationPackagesOutputDto>(
      {}
    );

  const { data: serviceVariationPackages, isLoading: isLoadingPackages } =
    useServiceVariationPackages(
      selectedServiceVariation?.id,
      client?.data?.country
    );

  const {
    data: serviceVariation,
    isLoading: isLoadingVariations,
  }: UseQueryResult<
    | Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto
    | undefined
  > = useServiceDetails(selectedService?.serviceId, (data) => {
    if (data?.variations && data.variations.length === 1) {
      selectServiceVariation(data.variations[0]);
      showPackages(true);
    } else {
      showVariations(true);
    }
  });

  const variations = serviceVariation ? serviceVariation.variations : [];

  const [shouldShowPackage, showPackages] = useState(false);
  const [shouldShowVariations, showVariations] = useState(false);

  const handleClose = () => showServices(false);
  const handleShow = () => showServices(true);

  var schedule = useLegalPractitionerSchedule(lawyer.userId ?? "").data;

  const availableSlot = (
    date: Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_AvailableTimeDto,
    day: string
  ) => (
    <p key={date.startTime + day} className="mt-4">
      {day}: {"   "}
      <button
        className="btn btn-outline-warning"
        type="button"
        onClick={() => handleShow()}
      >
        {getTime(date.startTime!) + " "} to {getTime(date.endTime!)}
      </button>
    </p>
  );

  const lawyerServicesModal = () => {
    return (
      <>
        <Modal
          show={shouldShowServices}
          onHide={() => {
            handleClose();
            showPackages(false);
          }}
          centered
        >
          <Modal.Body>
            <ul className="list-group">
              {services?.map((service) => {
                return (
                  <>
                    <li
                      key={service.serviceId}
                      onClick={() => {
                        selectService(service);
                        if (variations && variations.length === 1) {
                          selectServiceVariation(variations[0]);
                          showPackages(true);
                        } else {
                          showVariations(true);
                        }
                        handleClose();
                      }}
                      style={{ cursor: "pointer" }}
                      className="list-group-item list-group-item-action"
                    >
                      {service.title}
                    </li>
                  </>
                );
              })}
            </ul>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const variationModal = () => {
    return variations && variations.length <= 1 ? (
      <></>
    ) : (
      <>
        <Modal
          show={shouldShowVariations}
          onHide={() => showVariations(false)}
          centered
          size="lg"
        >
          <Modal.Body>
            <>
              {isLoadingVariations ? (
                <p>Loading Service Variations..</p>
              ) : variations && variations.length > 1 ? (
                <>
                  <h3>{selectedService.title}</h3>
                  <label className="form-label">Choose a</label>{" "}
                  <label className="form-label">{variations[0].label}</label>
                  <select
                    className="form-select"
                    aria-label="Pick Service Variation"
                    onChange={(e) => {
                      const variationId = Number.parseInt(
                        e.currentTarget.value
                      );
                      const selVariation = variations.find(
                        (m) => m.id === variationId
                      );
                      if (selVariation) {
                        showVariations(false);
                        selectServiceVariation(selVariation);
                        showPackages(true);
                      }
                    }}
                  >
                    <option key={-1}>Select one</option>
                    {variations?.map((variation) => {
                      return (
                        <option key={variation.id} value={variation.id}>
                          {variation.value}
                        </option>
                      );
                    })}
                  </select>
                </>
              ) : (
                <p>No Service Variations found</p>
              )}
            </>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const packagesModal = () => {
    return (
      <>
        <Modal
          show={shouldShowPackage}
          onHide={() => showPackages(false)}
          centered
          size="lg"
        >
          <Modal.Body>
            <>
              {isLoadingPackages ? (
                <p>Loading Packages..</p>
              ) : (
                <div className="row">
                  {serviceVariationPackages?.packages?.map((pkg) => {
                    return (
                      <>
                        <PackageCard
                          key={pkg.id}
                          title={pkg.packageTitle!}
                          price={pkg.rate!}
                          color="#ccbaa9"
                          item1={"Session duration: "+ pkg.sessionDuration}
                          item2={"Audio calls: " + (pkg.isAudioCallInclusive ? "Yes": "No")}
                          item3={"Video calls: " + (pkg.isVideoCallInclusive ? "Yes" : "No")}
                          item4={"Has audio recording: " + (pkg.isAudioCallRecorded ? "Yes": "No")}
                        ></PackageCard>
                      </>
                    );
                  })}
                </div>
              )}
            </>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  return (
    <>
      <section className="bg-light">
        <div className="">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-sm-5">
              <div className="card card-style1 border-0">
                <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                  <div className="row align-items-top">
                    <div className="col-lg-6 mb-4 mb-lg-0 h-50">
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
                    <div className="col-lg-6 px-xl-10 overflow-y-scroll mh-100">
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
                          {lawyer.services?.map((service) => (
                            <span key={service.serviceId}>
                              {service.title + " | "}
                            </span>
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
                            {schedule?.result?.monday?.map((date) =>
                              availableSlot(date, "Monday")
                            )}
                            {schedule?.result?.tuesday?.map((date) =>
                              availableSlot(date, "Tuesday")
                            )}
                            {schedule?.result?.wednesday?.map((date) =>
                              availableSlot(date, "Wednesday")
                            )}
                            {schedule?.result?.thursday?.map((date) =>
                              availableSlot(date, "Thursday")
                            )}
                            {schedule?.result?.friday?.map((date) =>
                              availableSlot(date, "Friday")
                            )}
                            {schedule?.result?.saturday?.map((date) =>
                              availableSlot(date, "Saturday")
                            )}
                            {schedule?.result?.sunday?.map((date) =>
                              availableSlot(date, "Sunday")
                            )}
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
      {lawyerServicesModal()}
      {packagesModal()}
      {variationModal()}
    </>
  );
}
