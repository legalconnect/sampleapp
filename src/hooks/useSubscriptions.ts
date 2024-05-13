import { useQuery } from "react-query";
import { APPOINTMENTS_QUERY_KEY, PACKAGES_QUERY_KEY } from "../constants";
import {
  AppointmentsService,
  GetFileOutputDto,
  GetAppointmentOutputDtoPagedList,
  SubscriptionOutputDtoPagedList as Subscriptions,
  SubscriptionsService,
} from "../services";

export const useSubscriptionsAvailable = (
  clientUserId: string | undefined | null,
  lawyerId: string | undefined | null,
  serviceVariationId: number | undefined,
  onSuccess: (data: Subscriptions) => void
) => {
  return useQuery({
    queryFn: async () => {
      if (clientUserId && lawyerId && serviceVariationId) {
        var response =
          await SubscriptionsService.getApiV1SubscriptionsAvailable({
            clientUserId,
            practitionerUserId: lawyerId,
            serviceId: serviceVariationId,
            statuses: ["Active"],
          });
        if (response.result) {
          return response.result;
        }
      }
    },
    queryKey: [PACKAGES_QUERY_KEY, clientUserId, lawyerId, serviceVariationId],
    enabled: Boolean(clientUserId && lawyerId && serviceVariationId),
    onSuccess: onSuccess,
  });
};

export const createSubscription = async (data: {
  formData?: {
    /**
     * Date scheduled for first Appointment
     */
    scheduleDate?: string;
    /**
     * Text notes to be shared with Legal Practitioner ahead of first Appointment
     */
    discussionNotes?: string;
    /**
     * Client Id thus User Id
     */
    clientUserId: string;
    /**
     * Legal Practitioner User Id
     */
    practitionerUserId: string;
    /**
     * Service Id
     * ///
     */
    serviceId: number;
    /**
     * Service Variation Id
     */
    variationId: number;
    /**
     * Service Variation Package Id
     */
    packageId: number;
    /**
     * Discount code
     */
    campaignCode?: string;
    /**
     * Payment Url callback
     */
    callbackUrl: string;
    /**
     * Only required when Service is "Contract Review"
     */
    numberOfPages?: number;
    files?: Array<Blob | File>;
  };
}) => {
  return await SubscriptionsService.postApiV1Subscriptions(data);
};

export const createAppointment = async (data: {
  subscriptionId: number;
  scheduleDate: string;
  discussionNotes?: string | null;
  files: GetFileOutputDto[];
}) => {
  return await AppointmentsService.postApiV1Appointments({
    requestBody: { ...data },
  });
};

export const useAppointments = (
  clientUserId: string,
  onSuccess: (
    data: GetAppointmentOutputDtoPagedList
  ) => void
) => {
  return useQuery({
    queryFn: async () => {
      var response = await AppointmentsService.getApiV1Appointments({
        clientUserId,
        statuses: ["Pending", "Missed", "Ended"],
      });
      if (response.result) {
        return response.result;
      }
    },
    queryKey: [APPOINTMENTS_QUERY_KEY, clientUserId],
    enabled: Boolean(clientUserId),
    onSuccess,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
