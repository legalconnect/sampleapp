import { useQuery } from "react-query";
import { LegalPractitionersService } from "../services";
import { LANGUAGES_QUERY_KEY } from "../constants";

export const useLanguages = () => {
  return useQuery({
    queryFn: async () => {
      var response =
        await LegalPractitionersService.getApiV1LegalpractitionersLanguages();
      if (response.result) {
        return response.result;
      }
    },
    queryKey: [LANGUAGES_QUERY_KEY],
    cacheTime: 120000,
  });
};
