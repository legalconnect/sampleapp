import { useQuery } from "react-query";
import { ServicesService } from "../services";
import { SERVICES_QUERY_KEY } from "../constants";

export const useServices =() => {
    return useQuery({
        queryFn: () => ServicesService.getApiV1Services(),
        queryKey: [SERVICES_QUERY_KEY],
        cacheTime: 120000
      });
}