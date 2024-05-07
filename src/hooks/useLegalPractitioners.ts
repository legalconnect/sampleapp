import { useQuery, useInfiniteQuery } from "react-query";
import {
  Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_PractitionerScheduleDto,
  LegalPractitionersService,
} from "../services";
import {
  APPOINTMENT_SLOT_QUERY_KEY,
  LAWYERS_QUERY_KEY,
  LAWYERS_SCHEDULE_QUERY_KEY,
} from "../constants";

export const useLegalPractitioners = (
  languages?: string[],
  city?: string,
  services?: string[]
) => {
  return useInfiniteQuery({
    queryKey: [LAWYERS_QUERY_KEY, languages, city, services],
    queryFn: async ({ pageParam = 1 }) => {
      const response =
        await LegalPractitionersService.getApiV1Legalpractitioners({
          languages,
          location: city,
          services,
          page: pageParam,
          pageSize: 9,
        });
      return {
        data: response.result,
        totalCount: response.result?.totalCount as number,
        prevPage: pageParam as number,
      };
    },
    cacheTime: 120000,
    getNextPageParam: (lastPage) => {
      if (lastPage.prevPage * 9 >= lastPage.totalCount) {
        return false;
      }
      return lastPage.prevPage + 1;
    },
  });
};

export const useLegalPractitionerSchedule = (
  userId: string,
  onSuccess: (
    data: Developer_Dashboard_HttpAggregator_Contracts_LegalPractitioners_PractitionerScheduleDto
  ) => void
) => {
  return useQuery({
    queryFn: async () => {
      const res =
        await LegalPractitionersService.getApiV1LegalpractitionersByUserIdSchedule(
          {
            userId,
          }
        );
      return res.result;
    },
    queryKey: [LAWYERS_SCHEDULE_QUERY_KEY, userId],
    onSuccess,
  });
};

export const useAppointmentBookingSlots = (
  scheduleDate: Date | null | undefined,
  packageId: number | undefined,
  variationId: number | undefined,
  legalPractitionerUser: string | undefined | null,
  onSuccess: (data: string[]) => void
) => {
  return useQuery({
    queryFn: async () => {
      if (scheduleDate && packageId && variationId && legalPractitionerUser) {
        var response =
          await LegalPractitionersService.getApiV1LegalpractitionersByUserIdScheduleSlots(
            {
              date: scheduleDate.toDateString(),
              packageId,
              variationId,
              userId: legalPractitionerUser,
            }
          );
        if (response.result) {
          return response.result;
        }
      }
    },
    queryKey: [
      APPOINTMENT_SLOT_QUERY_KEY,
      scheduleDate,
      packageId,
      legalPractitionerUser,
    ],
    enabled: Boolean(
      scheduleDate && packageId && variationId && legalPractitionerUser
    ),
    onSuccess,
  });
};
