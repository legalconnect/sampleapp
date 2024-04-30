import { useQuery } from "react-query";
import { PACKAGES_QUERY_KEY } from "../constants";
import { ServicesService } from "../services";

export const usePackages =(serviceId: number | undefined,country: string)=>{
    return useQuery({
      queryFn: async () => {
        if(serviceId){
            var response = await ServicesService.getApiV1ServicesVariationsByIdPackages({id: serviceId,country});
            if(response.result){
                return response.result;
            }
        }
      },
      queryKey: [PACKAGES_QUERY_KEY,serviceId],
    });
}