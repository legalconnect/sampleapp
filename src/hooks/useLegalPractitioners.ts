import { useQuery,useInfiniteQuery } from "react-query";
import { LegalPractitionersService } from "../services";
import { LAWAYERS_QUERY_KEY, LAWAYERS_SCHEDULE_QUERY_KEY } from "../constants";

export const useLegalPractitioners = (
  languages?: string[],
  city?: string,
  services?: string[]
) => {
  return useInfiniteQuery({
    queryKey: [LAWAYERS_QUERY_KEY, languages, city, services],
    queryFn: async ({pageParam = 1}) =>{

      const response = await LegalPractitionersService.getApiV1Legalpractitioners({
        languages,
        location: city,
        services,
        page: pageParam,
        pageSize: 9
      });
      return {data: response.result, totalCount:response.result?.totalCount as number,  prevPage: pageParam as number};
    },
    cacheTime: 120000,
    getNextPageParam: (lastPage )=>{
      if((lastPage.prevPage * 9) >= lastPage.totalCount){
        return false;
      }
      return lastPage.prevPage + 1;
    }
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
