import { useQuery } from "react-query";
import { PACKAGES_QUERY_KEY } from "../constants";
import {
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto,
  LegalConnect_Shared_Core_Paging_PagedList_SubscriptionOutputDto as Subscriptions,
  ServicesService,
  SubscriptionsService,
} from "../services";

export const useServiceDetails = (
  serviceId: number | undefined | null,
  onSuccess: (
    data: Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto
  ) => void
) => {
  return useQuery({
    queryFn: async () => {
      if (serviceId) {
        var response = await ServicesService.getApiV1ServicesById({
          id: serviceId,
        });
        if (response.result) {
          return response.result;
        }
      }
    },
    queryKey: [PACKAGES_QUERY_KEY, serviceId],
    onSuccess: onSuccess,
    cacheTime: 0,
    enabled: Boolean(serviceId)
  });
};

export const useServiceVariationPackages = (
  serviceVariationId: number | undefined,
  country: string | undefined | null,
  isFetchServicePackageEnabled: Boolean | undefined = false 
) => {
  return useQuery({
    queryFn: async () => {
      if (serviceVariationId && country) {
        var response = await ServicesService.getApiV1ServicesVariationsByIdPackages({
          id: serviceVariationId,
          country: country
        });
        if (response.result) {
          return response.result;
        }
      }
    },
    queryKey: [PACKAGES_QUERY_KEY, serviceVariationId,country],
    enabled: Boolean(serviceVariationId && country && isFetchServicePackageEnabled),
    
  });
};

export const useSubscriptionsAvailable = (
  clientUserId: string | undefined | null,
  lawyerId: string | undefined | null,
  serviceVariationId: number | undefined,
  onSuccess: (data: Subscriptions) => void
) => {
  return useQuery({
    queryFn: async () => {
      if (clientUserId && lawyerId && serviceVariationId) {
        var response = await SubscriptionsService.getApiV1SubscriptionsAvailable({
          clientUserId,
          practitionerUserId: lawyerId,
          serviceId: serviceVariationId,
          statuses: ["Active"]
        });
        if (response.result) {
          return response.result;
        }
      }
    },
    queryKey: [PACKAGES_QUERY_KEY,clientUserId, lawyerId, serviceVariationId],
    enabled: Boolean(clientUserId && lawyerId && serviceVariationId),
    onSuccess: onSuccess
  });
}
