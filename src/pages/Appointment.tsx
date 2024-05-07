import { useState } from "react";
import { useClient } from "../hooks/useCities";
import { useAppointments } from "../hooks/useSubscriptions";
import { Card } from "react-bootstrap";
import { DoubleDownIcon, DoubleUpIcon } from "../components/SVG";
import { Developer_Dashboard_HttpAggregator_Contracts_Appointments_GetAppointmentOutputDto as Appointment } from "../services";

type LCAppointment = {
  data: Appointment;
  shouldShowDetails: Boolean;
};
export default function AppointmentPage() {
  const { data: client } = useClient();

  const [appointments, setAppointments] = useState<LCAppointment[]>([]);

  const { isLoading } = useAppointments(client?.userId!, (result) => {
    setAppointments(() => {
      return result?.data
        ? result.data.map((m) => {
            return {
              data: m,
              shouldShowDetails: false,
            };
          })
        : [];
    });
  });

  const [tabs, setTab] = useState([
    {
      title: "Upcoming",
      isActive: true,
      index: 0,
    },
    {
      title: "Past",
      isActive: false,
      index: 2,
    },
    {
      title: "Missed",
      isActive: false,
      index: 4,
    },
  ]);

  const handleBookLawyerButtonClick = () => {
    window.location.href = "/lawyers";
  };

  const appointmentCard = (appointment: LCAppointment, isActive: Boolean) => {
    return (
      <Card
        className="w-50 p-2 mb-2"
        style={{ display: isActive ? "flex" : "none" }}
        key={appointment.data.id}
      >
        <h5>Meeting Session with {appointment.data.practitionerName}</h5>
        <p>
          {new Date(appointment.data.scheduleDate!).toLocaleDateString(
            undefined,
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
          {"  "}
          {new Date(appointment?.data?.scheduleDate!)
            .toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toUpperCase()}
        </p>
        <p>{appointment.data.serviceTitle}</p>
        <button
          className="btn btn-link text-body-secondary text-start"
          onClick={() => {
            setAppointments((prev) =>
              prev?.map((m) => {
                return {
                  ...m,
                  shouldShowDetails:
                    m.data.id === appointment.data.id
                      ? !m.shouldShowDetails
                      : false,
                };
              })
            );
          }}
        >
          Details
          {!appointment.shouldShowDetails ? (
            <DoubleDownIcon />
          ) : (
            <DoubleUpIcon />
          )}
        </button>
        <div
          style={{
            display: appointment.shouldShowDetails ? "block" : "none",
          }}
        >
          <div className="row container">
            <div className="col-2">
              Lawyer:
              <img
                src={appointment.data.practitionerProfileUrl ?? ""}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  objectFit: "cover",
                }}
              ></img>
            </div>
            <div className="col-10">
              <h2>{appointment.data.practitionerName}</h2>
              <div className="text-body-secondary">
                <p>What you are going to discuss</p>
                {appointment.data.discussionNotes ?? "No description provided"}
              </div>
              Documents
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <h2> Bookings</h2>
      <p>Here you can view your upcoming and past sessions.</p>
      <button
        className="btn btn-warning bg-lg"
        style={{ color: "white" }}
        onClick={handleBookLawyerButtonClick}
      >
        Book A Lawyer
      </button>
      <ul className="nav nav-underline nav-fill">
        {tabs.map((tab) => {
          return (
            <>
              <li className="nav-item" key={tab.title}>
                <a
                  onClick={() =>
                    setTab((prev) => {
                      return [
                        ...prev.map((m) => {
                          m.isActive = m.title === tab.title;
                          return m;
                        }),
                      ];
                    })
                  }
                  className={tab.isActive ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  aria-current="page"
                  href={"#" + tab.title.toLowerCase()}
                >
                  {tab.title}
                </a>
              </li>
            </>
          );
        })}
      </ul>

      <div className="tab-content p-3">
        {isLoading ? (
          <p>Fetching data...</p>
        ) : (
          tabs.map((tab) => (
            <div
              id={tab.title.toLowerCase()}
              className={tab.isActive ? "tab-pane in active" : "tab pane"}
            >
              {appointments ? (
                appointments
                  .filter((m) => m.data.status === tab.index)
                  .map((appointment) => {
                    return appointmentCard(appointment, tab.isActive);
                  })
              ) : (
                <p>No {tab.title} Appointments</p>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
