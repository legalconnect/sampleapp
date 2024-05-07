import { useQuery } from "react-query";
import { PACKAGES_QUERY_KEY } from "../constants";
import {
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceOutputDto,
  Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceVariationPackagesOutputDto,
  ServicesService,
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
    queryKey: [PACKAGES_QUERY_KEY],
    onSuccess: onSuccess,
    cacheTime: 0,
    enabled: Boolean(serviceId),
  });
};

export const useServiceVariationPackages = (
  serviceVariationId: number | undefined,
  country: string | undefined | null,
  shouldFetchPackage: Boolean,
  onSuccess: (data: Developer_Dashboard_HttpAggregator_Contracts_Services_ServiceVariationPackagesOutputDto) => void
) => {
  return useQuery({
    queryFn: async () => {
      if (serviceVariationId && country) {
        var response =
          await ServicesService.getApiV1ServicesVariationsByIdPackages({
            id: serviceVariationId,
            country: country,
          });
        if (response.result) {
          return response.result;
        }
      }
    },
    queryKey: [PACKAGES_QUERY_KEY, serviceVariationId, country],
    enabled: Boolean(serviceVariationId && country && shouldFetchPackage),
    onSuccess
  });
};
