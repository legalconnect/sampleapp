import { useLocation } from "react-router-dom";
import {
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_AvailableTimeDto as Availability,
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto as Service,
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceVariationPackagesOutputDto as ServiceVariation,
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_GetLegalPractitionerOutputDto as Lawyer,
} from "../services/types.gen";
import { useLegalPractitionerSchedule } from "../hooks/useLegalPractitioners";
import { getTime } from "../utils/dateParse";

import "./LawyerDetails.css";
import { Modal } from "react-bootstrap";
import {
  useServiceDetails as useServiceDetails,
  useServiceVariationPackages,
  useSubscriptionsAvailable,
} from "../hooks/usePackages";
import { UseQueryResult } from "react-query";
import { useState } from "react";
import { useClient } from "../hooks/useCities";
import PackageCard from "../components/PackageCard";

export default function LawyerDetails() {
  const { state } = useLocation();
  const lawyer = state?.item as Lawyer;

  const { data: client } = useClient();

  const services = lawyer.services?.map((m) => {
    return { ...m };
  });

  var schedule = useLegalPractitionerSchedule(lawyer.userId ?? "").data;

  // const [scheduleDay, setScheduleDay] = useState(new Date());
  const [shouldShowServices, showServices] = useState(false);
  const [shouldShowVariations, showVariations] = useState(false);
  const [shouldShowSubscriptions, showSubscriptions] = useState(false);
  const [shouldShowPackage, showPackages] = useState(false);

  const [selectedService, selectService] = useState<Service>({});

  const [selectedServiceVariation, selectServiceVariation] =
    useState<ServiceVariation>({});

  const {
    data: serviceDetails,
    isLoading: isLoadingVariations,
    refetch: refetchServiceDetails,
  }: UseQueryResult<Service | undefined> = useServiceDetails(
    selectedService?.serviceId,
    (data) => {
      if (data?.variations && data.variations.length === 1) {
        selectServiceVariation(data.variations[0]);
        showPackages(true);
      } else {
        showVariations(true);
      }
    }
  );

  const [shouldFetchPackages, fetchPackages] = useState(false);
  const { data: subscriptions, isLoading: isLoadingSubscriptions } =
    useSubscriptionsAvailable(
      client?.userId,
      lawyer.userId,
      selectedServiceVariation.id,
      (data) => {
        if (data.totalCount) {
          if (
            data.data &&
            data.data.some((m) => (m.remainingNumberOfAppointments ?? 0) > 0)
          ) {
            showPackages(false);
            showSubscriptions(true);
            return;
          }
        }
        fetchPackages(true);
        showPackages(true);
      }
    );

  const { data: serviceVariationPackages, isLoading: isLoadingPackages } =
    useServiceVariationPackages(
      selectedServiceVariation?.id,
      client?.country,
      shouldFetchPackages
    );

  const AvailableSlot_Markup = (
    dates: Availability[] | undefined | null,
    day: string
  ) => (
    <p key={day} className="mt-4">
      {day}: {"   "}
      {dates && dates.length === 0 ? (
        <>N/A</>
      ) : (
        dates?.map((date) => {
          return (
            
             <button
               className="btn btn-outline-warning me-2 disabled"
               type="button"
               onClick={() => showServices(true)}
             >
            {getTime(date.startTime!) + " "} to {getTime(date.endTime!)}
            </button>
          );
        })
      )}
    </p>
  );

  const Services_Modal = () => {
    return (
      <>
        <Modal
          show={shouldShowServices}
          onHide={() => {
            showServices(false);
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
                        if (
                          serviceDetails?.variations &&
                          serviceDetails?.variations.length === 1
                        ) {
                          selectServiceVariation(serviceDetails.variations[0]);
                        }

                        refetchServiceDetails();
                        showServices(false);
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

  const ServiceVariation_Modal = () => {
    return serviceDetails?.variations &&
      serviceDetails.variations.length <= 1 ? (
      <></>
    ) : (
      <>
        <Modal
          show={shouldShowVariations}
          onHide={() => {
            showVariations(false);
          }}
          centered
          size="lg"
        >
          <Modal.Body>
            <>
              {isLoadingVariations ? (
                <p>Loading Service Variations..</p>
              ) : serviceDetails?.variations &&
                serviceDetails?.variations.length > 1 ? (
                <>
                  <h3>{selectedService.title}</h3>
                  <label className="form-label">Choose a</label>{" "}
                  <label className="form-label">
                    {serviceDetails?.variations[0].label}
                  </label>
                  <select
                    className="form-select"
                    aria-label="Pick Service Variation"
                    onChange={(e) => {
                      const variationId = Number.parseInt(
                        e.currentTarget.value
                      );
                      const selVariation =
                        serviceDetails?.variations &&
                        serviceDetails.variations.find(
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
                    {serviceDetails?.variations?.map((variation) => {
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

  const Subscriptions_Modal = () => {
    if (subscriptions) {
      return (
        <>
          <Modal
            show={shouldShowSubscriptions}
            onHide={() => {
              showSubscriptions(false);
            }}
            centered
            size="lg"
          >
            <Modal.Header>
              <h3>Your Subscriptions:</h3>
            </Modal.Header>
            <Modal.Body>
              <>
                {isLoadingSubscriptions ? (
                  <p>Loading Subscriptions..</p>
                ) : (
                  <ul className="list-group">
                    {subscriptions.data?.map((subscription) => {
                      return (
                        <>
                          <li
                            key={subscription.subscriptionId}
                            onClick={() => {}}
                            style={{ cursor: "pointer" }}
                            className="list-group-item list-group-item-action"
                          >
                            {subscription.packageTitle} {" | Appointments: "}{" "}
                            {subscription.remainingNumberOfAppointments}/
                            {subscription.numberOfAppointments}
                          </li>
                        </>
                      );
                    })}
                  </ul>
                )}
              </>
            </Modal.Body>
          </Modal>
        </>
      );
    } else {
      return;
      <p>No Service Variations found</p>;
    }
  };

  const Packages_Modal = () => {
    return (
      <>
        <Modal
          show={shouldShowPackage}
          onHide={() => {
            showPackages(false);
          }}
          centered
          size="xl"
        >
          <Modal.Header className="text-">
            <h4>{selectedService.title?.toLocaleUpperCase()} PACKAGES</h4>
          </Modal.Header>
          <Modal.Body>
            <>
              {isLoadingPackages ? (
                <p>Loading Packages..</p>
              ) : (
                <div className="row">
                  {serviceVariationPackages?.packages?.map((pkg) => {
                    let color = "";
                    switch (pkg.packageTitle?.toLocaleLowerCase()) {
                      case "bronze":
                        color = "#FFFFFF";
                        break;
                      case "silver":
                        color = "#C0C0C0";
                        break;
                      case "gold":
                        color = "#ea9211";
                        break;
                      case "freemium":
                        color = "#4CAF50";
                        break;
                      default:
                        color = "#4CAF50";
                        break;
                    }
                    return (
                      <>
                        <PackageCard
                          key={pkg.id}
                          title={pkg.packageTitle!}
                          price={pkg.rate!}
                          color={color}
                          item1={"Session duration: " + pkg.sessionDuration}
                          item2={
                            "Audio calls: " +
                            (pkg.isAudioCallInclusive ? "Yes" : "No")
                          }
                          item3={
                            "Video calls: " +
                            (pkg.isVideoCallInclusive ? "Yes" : "No")
                          }
                          item4={
                            "Has audio recording: " +
                            (pkg.isAudioCallRecorded ? "Yes" : "No")
                          }
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
                              Schedule:{" "}
                              <button
                                className="btn btn-warning me-2"
                                style={{color: "white"}}
                                type="button"
                                onClick={() => showServices(true)}
                              >
                                Book Appointment
                              </button>
                            </span>{" "}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.monday
                                : undefined,
                              "Monday"
                            )}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.tuesday
                                : undefined,
                              "Tuesday"
                            )}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.wednesday
                                : undefined,
                              "Wednesday"
                            )}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.thursday
                                : undefined,
                              "Thursday"
                            )}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.friday
                                : undefined,
                              "Friday"
                            )}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.saturday
                                : undefined,
                              "Saturday"
                            )}
                            {AvailableSlot_Markup(
                              schedule.result
                                ? schedule.result.sunday
                                : undefined,
                              "Sunday"
                            )}
                            {/* {schedule?.result?.tuesday?.map((date) =>
                              AvailableSlot_Markup(date, "Tuesday")
                            )}
                            {schedule?.result?.wednesday?.map((date) =>
                              AvailableSlot_Markup(date, "Wednesday")
                            )}
                            {schedule?.result?.thursday?.map((date) =>
                              AvailableSlot_Markup(date, "Thursday")
                            )}
                            {schedule?.result?.friday?.map((date) =>
                              AvailableSlot_Markup(date, "Friday")
                            )}
                            {schedule?.result?.saturday?.map((date) =>
                              AvailableSlot_Markup(date, "Saturday")
                            )}
                            {schedule?.result?.sunday?.map((date) =>
                              AvailableSlot_Markup(date, "Sunday")
                            )} */}
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
      {Services_Modal()}
      {ServiceVariation_Modal()}
      {Subscriptions_Modal()}
      {Packages_Modal()}
    </>
  );
}
