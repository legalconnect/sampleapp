import { useQuery } from "react-query";
import { PACKAGES_QUERY_KEY } from "../constants";
import {
  AppointmentsService,
  Developer_Dashboard_HttpAggregator_Contracts_Documents_GetFileOutputDto,
  LegalConnect_Shared_Core_Paging_PagedList_SubscriptionOutputDto as Subscriptions,
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

export const createSubscription = async (
  data: {
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
  }}
) => {
  return await SubscriptionsService.postApiV1Subscriptions(data);

}

export const createAppointment = async (
  data: {
      subscriptionId: number;
      scheduleDate: string;
      discussionNotes?: string | null;
      files: Developer_Dashboard_HttpAggregator_Contracts_Documents_GetFileOutputDto[]
  }
) => {
  return await AppointmentsService.postApiV1Appointments({ requestBody: {...data}});

}
