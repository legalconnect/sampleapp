import { useQuery } from "react-query";
import { LegalPractitionersService } from "../services";
import { LAWAYERS_QUERY_KEY, LAWAYERS_SCHEDULE_QUERY_KEY } from "../constants";

export const useLegalPractitioners = (
  languages?: string[],
  city?: string,
  services?: string[]
) => {
  return useQuery({
    queryFn: () =>
      LegalPractitionersService.getApiV1Legalpractitioners({
        languages,
        location: city,
        services,
      }),
    queryKey: [LAWAYERS_QUERY_KEY, languages, city, services],
    cacheTime: 120000,
  });
};

export const useLegalPractitionerSchedule = (userId: string) => {
  return useQuery({
    queryFn: () =>
      LegalPractitionersService.getApiV1LegalpractitionersByUserIdSchedule({
        userId
      }),
    queryKey: [LAWAYERS_SCHEDULE_QUERY_KEY,userId],
  });
}
