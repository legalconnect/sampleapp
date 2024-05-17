import { useLocation } from "react-router-dom";
import {
  AvailableTimeDto as Availability,
  ServiceOutputDto as Service,
  ServiceVariationPackagesOutputDto as ServiceVariationPackages,
  GetLegalPractitionerOutputDto as Lawyer,
  PractitionerScheduleDto as Schedule,
  SubscriptionOutputDto as Subscription,
  GetFileOutputDto,
} from "../services/types.gen";
import {
  useAppointmentBookingSlots,
  useLegalPractitionerSchedule,
} from "../hooks/useLegalPractitioners";
import { getTimeString } from "../utils/dateParse";

import "./LawyerDetails.css";
import { Modal } from "react-bootstrap";
import {
  useServiceDetails as useServiceDetails,
  useServiceVariationPackages,
} from "../hooks/usePackages";
import {
  createAppointment,
  createSubscription,
  useSubscriptionsAvailable,
} from "../hooks/useSubscriptions";
import { useState } from "react";
import { useClient } from "../hooks/useCities";
import PackageCard from "../components/PackageCard";
import Calendar from "react-calendar";
import { Message, Tag, useToaster } from "rsuite";
import { DocumentsService } from "../services";
import LoadingModal from "../components/LoadingModal";

type LawyerDetailsState = {
  exemptedDays?: number[]; // doesn't change
  schedule?: Schedule; // doesn't change

  selectedService?: Service;
  selectedServiceVariation?: ServiceVariationPackages;

  activeSubscription?: Subscription;
  appointment?: {
    selectedPackageId?: number;
    scheduleDate?: Date | null | undefined;
    bookingSlotTimes?: string[];
    files?: File[];
    discussionNotes?: string;
  };
  shouldShowServices?: Boolean;
  shouldShowVariations?: Boolean;
  shouldFetchPackages?: Boolean;
  shouldShowPackage?: Boolean;
  shouldShowAppointmentDates?: Boolean;
  shouldShowAppointmentForm?: Boolean;
  isLoading?: boolean;
  loadingText?: string;
};

export default function LawyerDetails() {
  const toaster = useToaster();
  const { state } = useLocation();
  const lawyer = state?.item as Lawyer;
  const { data: client } = useClient();
  const services = lawyer.services?.map((m) => {
    return { ...m };
  });
  const [mainState, setState] = useState<LawyerDetailsState>();
  const showLoading = (text?: string) => setState(prev=>({...prev, isLoading: true, loadingText: text }))
  const hideLoading = () => setState(prev=>({...prev, isLoading: false }))

  const { refetch: refetchSchedule } = useLegalPractitionerSchedule(
    lawyer.userId ?? "",
    (data) => {
      const dates = generateBookingSchedule(data);
      setState((prev) => ({ ...prev, exemptedDays: dates, schedule: data }));
    }
  );

  const { isLoading: isLoadingVariations } = useServiceDetails(
    mainState?.selectedService?.serviceId,
    (data) => {
      const dataVariations = data?.variations;

      if (!dataVariations || !dataVariations.length) {
        return;
      }

      let localState = dataVariations
        ? {
            ...mainState,
            selectedService: {
              ...mainState?.selectedService,
              variations: dataVariations,
            },
          }
        : { ...mainState };

      if (dataVariations.length > 1) {
        localState = { ...localState, shouldShowVariations: true };
      } else {
        localState = {
          ...localState,
          selectedServiceVariation: dataVariations[0],
        };
      }

      setState(localState);
    }
  );

  useSubscriptionsAvailable(
    client?.userId,
    lawyer.userId,
    mainState?.selectedServiceVariation?.id,
    (data) => {
      if (data.totalCount) {
        const activeSubscription = data?.data?.find(
          (m) => (m.remainingNumberOfAppointments ?? 0) > 0
        );
        if (activeSubscription) {
          setState((prev) => ({
            ...prev,
            activeSubscription: activeSubscription,
            appointment: {
              scheduleDate: undefined,
              bookingSlotTimes: [],
              selectedPackageId: activeSubscription.packageId,
            },
            shouldShowAppointmentDates: true,
            shouldFetchPackages: false,
          }));
          return;
        }
      } else {
        setState((prev) => ({ ...prev, shouldFetchPackages: true }));
      }
    }
  );

  const { isLoading: isLoadingPackages } = useServiceVariationPackages(
    mainState?.selectedServiceVariation?.id,
    client?.country,
    Boolean(mainState?.shouldFetchPackages),
    (data) => {
      setState((prev) => ({
        ...prev,
        selectedServiceVariation: {
          ...prev?.selectedServiceVariation,
          packages: data.packages,
        },
        shouldShowPackage: true,
      }));
    }
  );

  const { refetch: refetchAppointmentSlots, isLoading: isLoadingSlots } =
    useAppointmentBookingSlots(
      mainState?.appointment?.scheduleDate,
      mainState?.appointment?.selectedPackageId,
      mainState?.selectedServiceVariation?.id,
      lawyer.userId,
      (data) => {
        setState((prev) => ({
          ...prev,
          appointment: { ...prev?.appointment, bookingSlotTimes: data },
        }));
      }
    );

  const handleFileButtonClick = () => {
    // Create a temporary input element
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    // Trigger a click event on the input element
    input.click();

    // Remove the input element from the DOM after the file has been selected
    input.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files; // Array of selected files

      const filesArray = files ? Array.from(files) : [];

      setState((prev) => {
        const existingFiles = prev?.appointment?.files
          ? [...prev.appointment.files, ...filesArray]
          : filesArray;

        return {
          ...prev,
          appointment: {
            ...prev?.appointment,
            files: existingFiles,
          },
        };
      });
      input.remove();
    });
  };

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
              onClick={() =>
                setState((prev) => ({ ...prev, shouldShowPackage: true }))
              }
            >
              {getTimeString(date.startTime!) + " "} to{" "}
              {getTimeString(date.endTime!)}
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
          show={Boolean(mainState?.shouldShowServices)}
          onHide={() =>
            setState((prev) => ({ ...prev, shouldShowServices: false }))
          }
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
                        setState((prev) => ({
                          ...prev,
                          selectedService: service,
                          shouldShowServices: false,
                        }));
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
    const variations = mainState?.selectedService?.variations;
    if (!variations || !variations.length) return <></>;

    return (
      <>
        <Modal
          show={Boolean(mainState?.shouldShowVariations)}
          onHide={() =>
            setState((prev) => ({ ...prev, shouldShowVariations: false }))
          }
          centered
          size="lg"
        >
          <Modal.Body>
            <>
              {isLoadingVariations ? (
                <p>Loading Service Variations..</p>
              ) : variations ? (
                <>
                  <h3>{mainState?.selectedService?.title}</h3>
                  <label className="form-label">Choose a</label>{" "}
                  <label className="form-label">{variations[0].label}</label>
                  <select
                    className="form-select"
                    aria-label="Pick Service Variation"
                    onChange={(e) => {
                      const variationId = Number.parseInt(
                        e.currentTarget.value
                      );
                      const selectedVariation = variations.find(
                        (m) => m.id === variationId
                      );
                      if (selectedVariation) {
                        setState((prev) => ({
                          ...prev,
                          selectedServiceVariation: selectedVariation,
                          shouldShowVariations: false,
                          shouldShowPackage: true,
                        }));
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

  const Packages_Modal = () => {
    return (
      <>
        <Modal
          show={Boolean(mainState?.shouldShowPackage)}
          onHide={() =>
            setState((prev) => ({ ...prev, shouldShowPackage: false }))
          }
          centered
          size="xl"
        >
          <Modal.Header className="text-">
            <h4>
              {mainState?.selectedService?.title?.toLocaleUpperCase()} PACKAGES
            </h4>
          </Modal.Header>
          <Modal.Body>
            <>
              {isLoadingPackages ? (
                <p>Loading Packages..</p>
              ) : (
                <div className="row">
                  {mainState?.selectedServiceVariation?.packages?.map((pkg) => {
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
                          price={pkg.rate! + pkg.taxAmount!}
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
                          packageId={pkg.packageId}
                          onButtonClick={(packageId) => {
                            setState((prev) => ({
                              ...prev,
                              appointment: {
                                ...prev?.appointment,
                                selectedPackageId: packageId,
                              },
                              shouldShowPackage: false,
                              shouldShowAppointmentDates: true,
                            }));
                          }}
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

  const AppointmentDates_Modal = () => {
    let currentDate = new Date();
    // Add 30 days to the current date
    currentDate.setDate(currentDate.getDate() + 30);

    return (
      <div className="align-items-center">
        <Modal
          show={Boolean(mainState?.shouldShowAppointmentDates)}
          onHide={() => {
            setState((prev) => ({
              ...prev,
              shouldShowAppointmentDates: false,
              shouldShowPackage: false,
            }));
            refetchSchedule();
            refetchAppointmentSlots();
          }}
          centered
          size="lg"
        >
          <Modal.Header className="text-">
            <>
              <h4>Select Appointment Date</h4>
            </>
          </Modal.Header>
          <Modal.Body>
            <>
              <Calendar
                onChange={(date) => {
                  const scheduleDate = new Date(date?.toString() ?? "");
                  setState((prev) => ({
                    ...prev,
                    appointment: { ...prev?.appointment, scheduleDate },
                  }));
                }}
                value={mainState?.appointment?.scheduleDate}
                className="w-100 h-100"
                minDate={new Date()}
                maxDate={currentDate}
                tileDisabled={({ date }) => {
                  return (
                    mainState?.exemptedDays?.includes(date.getDay()) ?? true
                  );
                }}
              ></Calendar>
              <p className="mt-4">Booking Time Slots: </p>
              {isLoadingSlots ? (
                <p>Loading time slots...</p>
              ) : mainState?.appointment?.bookingSlotTimes &&
                mainState?.appointment?.bookingSlotTimes.length > 0 ? (
                <div className="row m-4 align-items-center">
                  {mainState?.appointment?.bookingSlotTimes?.map(
                    (appointmentTime) => {
                      return (
                        <>
                          <button
                            key={appointmentTime}
                            onClick={() => {
                              setState((prev) => {
                                return {
                                  ...prev,
                                  appointment: {
                                    ...prev?.appointment,
                                    scheduleDate: new Date(appointmentTime),
                                  },
                                };
                              });
                              setState((prev) => ({
                                ...prev,
                                shouldShowAppointmentDates: false,
                                shouldShowAppointmentForm: true,
                              }));
                            }}
                            style={{ cursor: "pointer" }}
                            className="btn btn-outline-warning col-2"
                          >
                            {getTimeString(appointmentTime)}
                          </button>
                        </>
                      );
                    }
                  )}
                </div>
              ) : (
                ""
              )}
            </>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const AppointmentForm_Modal = () => {
    return (
      <div className="align-items-center">
        <Modal
          show={Boolean(mainState?.shouldShowAppointmentForm)}
          onHide={() =>
            setState((prev) => ({ ...prev, shouldShowAppointmentForm: false }))
          }
          centered
          size="lg"
        >
          <Modal.Header className="text-">Confirm Booking</Modal.Header>
          <Modal.Body>
            <>
              <div className="row">
                <div className="col-2">
                  <img
                    src={lawyer?.avatar ?? ""}
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      objectFit: "cover",
                    }}
                  ></img>
                </div>
                <div className="col-10">
                  <h2>
                    {lawyer.firstName} {lawyer.lastName}
                  </h2>
                  <div className="text-body-secondary">
                    {lawyer.city} {lawyer.country}
                  </div>
                  <label>
                    {mainState?.appointment?.scheduleDate?.toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    {"  "}
                    {mainState?.appointment?.scheduleDate
                      ?.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .toUpperCase()}
                  </label>
                  <div>{mainState?.selectedService?.title}</div>
                  <br />
                </div>
              </div>
              <div>
                <div>
                  <b>Additional Documents</b>
                </div>
                <div>
                  {mainState?.appointment?.files?.map((file) => (
                    <>
                      <Tag
                        style={{ cursor: "pointer" }}
                        closable
                        onClose={() =>
                          setState((prev) => ({
                            ...prev,
                            appointment: {
                              ...prev?.appointment,
                              files: prev?.appointment?.files?.filter(
                                (m) => m.name !== file.name
                              ),
                            },
                          }))
                        }
                      >
                        <label style={{ cursor: "pointer" }} title={file.name}>
                          {file.name.substring(0, 10)}...
                        </label>
                      </Tag>
                    </>
                  ))}
                </div>
                <button
                  className="btn btn-outline-warning"
                  onClick={handleFileButtonClick}
                >
                  Upload Document
                </button>
                <br />
                <br />
                <div>
                  <b>What do you want to discuss?</b>
                </div>
                <textarea
                  value={mainState?.appointment?.discussionNotes}
                  className="w-100"
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      appointment: {
                        ...prev?.appointment,
                        discussionNotes: e.target.value,
                      },
                    }))
                  }
                ></textarea>
              </div>
            </>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-warning"
              style={{ color: "white" }}
              onClick={async () => {
                setState((prev) => ({
                  ...prev,
                  shouldShowAppointmentForm: false,
                }));
                showLoading("Submitting...")
                await bookAppointment();
              }}
            >
              Proceed
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };


  function generateBookingDates(
    daysExempted: number[],
    dayAvailability: Availability[],
    disabledDayIndicator: number
  ): number[] {
    if (!dayAvailability || dayAvailability.length === 0) {
      daysExempted.push(disabledDayIndicator);
    }
    return daysExempted;
  }

  function generateBookingSchedule(schedule: Schedule | undefined): number[] {
    const monday = schedule?.monday ?? [];
    const tuesday = schedule?.tuesday ?? [];
    const wednesday = schedule?.wednesday ?? [];
    const thursday = schedule?.thursday ?? [];
    const friday = schedule?.friday ?? [];
    const saturday = schedule?.saturday ?? [];
    const sunday = schedule?.sunday ?? [];

    let daysExempted: number[] = [];

    daysExempted = generateBookingDates(daysExempted, monday, 1);
    daysExempted = generateBookingDates(daysExempted, tuesday, 2);
    daysExempted = generateBookingDates(daysExempted, wednesday, 3);
    daysExempted = generateBookingDates(daysExempted, thursday, 4);
    daysExempted = generateBookingDates(daysExempted, friday, 5);
    daysExempted = generateBookingDates(daysExempted, saturday, 6);
    daysExempted = generateBookingDates(daysExempted, sunday, 0);
    return daysExempted;
  }

  async function bookAppointment() {
    if (mainState?.activeSubscription) {
      let files: GetFileOutputDto[] =
        [];
      if (mainState?.appointment?.files) {
        const response =
          await DocumentsService.postApiV1DocumentsAppointmentsBySubscriptionIdByLegalPractitionerUserId(
            {
              formData: {
                files: mainState.appointment.files,
              },
              legalPractitionerUserId: lawyer?.userId!,
              subscriptionId: mainState?.activeSubscription?.id!,
            }
          );

        files = response.success && response.result ? response.result : [];
      }
      // Create Appointment
      const appointmentDto = await createAppointment({
        subscriptionId: mainState?.activeSubscription?.id ?? 0,
        discussionNotes: mainState?.appointment?.discussionNotes,
        scheduleDate: mainState?.appointment?.scheduleDate?.toISOString() ?? "",
        files,
      });
      window.location.href = "/appointments";
      toaster.push(<Message>Appointment Created Successfully</Message>);
    } else {
      const subscriptionDto = await createSubscription({
        formData: {
          scheduleDate: mainState?.appointment?.scheduleDate?.toDateString(),
          discussionNotes: mainState?.appointment?.discussionNotes,
          clientUserId: client!.userId ?? "",
          practitionerUserId: lawyer!.userId ?? "",
          serviceId: mainState?.selectedService?.serviceId ?? 0,
          variationId: mainState?.selectedServiceVariation?.id ?? 0,
          packageId: mainState?.appointment?.selectedPackageId ?? 0,
          callbackUrl: "http://localhost:3000/appointments",
          files: mainState?.appointment?.files,
        },
      });
      if (subscriptionDto.result?.paymentUrl)
        window.location.href = subscriptionDto.result.paymentUrl;
    }
    hideLoading();
  }

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

                        {mainState?.schedule && (
                          <li className="mb-2 mb-xl-3 display-28">
                            <span className="display-26 text-secondary me-2 font-weight-600">
                              Schedule:{" "}
                              <button
                                className="btn btn-warning me-2"
                                style={{ color: "white" }}
                                type="button"
                                onClick={() => {
                                  setState((prev) => ({
                                    schedule: { ...prev?.schedule },
                                    exemptedDays: prev?.exemptedDays
                                      ? [...prev.exemptedDays]
                                      : [],
                                    selectedService: {},
                                    selectedServiceVariation: {},
                                    activeSubscription: undefined,
                                    appointment: {},
                                    shouldShowServices: true,
                                  }));
                                }}
                              >
                                Book Appointment
                              </button>
                            </span>{" "}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.monday
                                : undefined,
                              "Monday"
                            )}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.tuesday
                                : undefined,
                              "Tuesday"
                            )}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.wednesday
                                : undefined,
                              "Wednesday"
                            )}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.thursday
                                : undefined,
                              "Thursday"
                            )}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.friday
                                : undefined,
                              "Friday"
                            )}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.saturday
                                : undefined,
                              "Saturday"
                            )}
                            {AvailableSlot_Markup(
                              mainState?.schedule
                                ? mainState.schedule.sunday
                                : undefined,
                              "Sunday"
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
      {Services_Modal()}
      {ServiceVariation_Modal()}
      {Packages_Modal()}
      {AppointmentDates_Modal()}
      {AppointmentForm_Modal()}
      {LoadingModal({
        shouldShowModal: mainState?.isLoading ? true : false,
        text: mainState?.loadingText,
        onHide: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
        },
      })}
    </>
  );


}
