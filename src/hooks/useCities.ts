import { useQuery } from "react-query";
import { ClientsService, LegalPractitionersService, } from "../services";
import { CITIES_QUERY_KEY, CLIENT_QUERY_KEY } from "../constants";

export const useCities = () => {
  return useQuery({
    queryFn: async () => {
      var response =
        await LegalPractitionersService.getApiV1LegalpractitionersCities();
      if (response.result) {
        return response.result;
      }
    },
    queryKey: [CITIES_QUERY_KEY],
    cacheTime: 60000,
  });
};

export const useClient = () => {
  return useQuery({
    queryFn: async () => {
      const res = await ClientsService.getApiV1ClientsMe();
      if (res.result) {
        return res.result;
      }
    },
    queryKey: [CLIENT_QUERY_KEY],
  });
};
