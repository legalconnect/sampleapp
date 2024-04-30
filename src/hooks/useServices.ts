import { useQuery } from "react-query";
import { ServicesService } from "../services";
import { SERVICES_QUERY_KEY } from "../constants";

export const useServices = () => {
  return useQuery({
    queryFn: async () => {
      const response = await ServicesService.getApiV1Services();
      if (response?.result) {
        return response.result;
      }
    },
    queryKey: [SERVICES_QUERY_KEY],
    cacheTime: 120000,
  });
};
