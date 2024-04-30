import { useQuery } from "react-query";
import { LegalPractitionersService, ServicesService } from "../services";
import { CITIES_QUERY_KEY, PACKAGES_QUERY_KEY } from "../constants";

export const useCities =() => {
    return useQuery({
        queryFn: async () => {
          var response = await LegalPractitionersService.getApiV1LegalpractitionersCities();
          if(response.result){
            return response.result;
          }
        },
        queryKey: [CITIES_QUERY_KEY],
        cacheTime: 60000
      });
}
