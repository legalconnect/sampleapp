import { useQuery } from "react-query";
import { LegalPractitionersService } from "../services";
import { CITIES_QUERY_KEY } from "../constants";

export const useCities =() => {
    return useQuery({
        queryFn: () => LegalPractitionersService.getApiV1LegalpractitionersCities(),
        queryKey: [CITIES_QUERY_KEY],
        cacheTime: 60000
      });
}