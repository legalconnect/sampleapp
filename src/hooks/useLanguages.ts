import { useQuery } from "react-query";
import { LegalPractitionersService } from "../services";
import { LANGUAGES_QUERY_KEY } from "../constants";

export const useLanguages =() => {
    return useQuery({
        queryFn: () => LegalPractitionersService.getApiV1LegalpractitionersLanguages(),
        queryKey: [LANGUAGES_QUERY_KEY],
        cacheTime: 120000
      });
}