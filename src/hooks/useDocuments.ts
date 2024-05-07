import { useQuery } from "react-query";
import { DocumentsService } from "../services";
import { DOCUMENTS_QUERY_KEY } from "../constants";

export const useDocuments = () => {
  return useQuery({
    queryFn: async () => {
      var response = await DocumentsService.getApiV1DocumentsMe({
        signingRequried: true,
      });
      return response.result;
    },
    queryKey: [DOCUMENTS_QUERY_KEY],
  });
};
