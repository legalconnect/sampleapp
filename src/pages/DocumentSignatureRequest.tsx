import { useLocation } from "react-router-dom";

const DocumentSignatureRequest = () => {
    const { state } = useLocation();
  const url = state?.item as string;
    return <>
    <iframe width="100%" height="100%" src={url}></iframe>
    </>
}
export default DocumentSignatureRequest;