import { useDocuments } from "../hooks/useDocuments";
import { Card } from "react-bootstrap";
import pdfIcon from "../../src/assets/pdf.svg";
import msWordIcon from "../../src/assets/ms-word.svg";
import { Tag } from "rsuite";

export default function DocumentPage() {
  const { data: documents, isLoading } = useDocuments();

  const handleDocumentButtonClick = () => {

  };
  return (
    <>
      <div className="sticky-top bg-white" style={{ top: "50px" }}>
        <h2>Documents</h2>
        <p className="text-body-secondary">
          See all documents that you have shared and received
        </p>
        <button
          className="btn btn-warning bg-lg"
          style={{ color: "white" }}
          onClick={handleDocumentButtonClick}
        >
          Upload Document for Signing
        </button>
      </div>
      {isLoading ? (
        <p>Fetching data...</p>
      ) : (
        <>
          {documents?.data?.map((document) => {
            return (
              <>
                <Card className="w-50 p-2 my-3" key={document.fileId}>
                  <div className="row">
                    <div className="col-2">
                      {document.extension?.toLowerCase() === "pdf" ? (
                        <img
                          style={{
                            width: "100%",
                            aspectRatio: 1,
                            objectFit: "cover",
                          }}
                          src={pdfIcon}
                        />
                      ) : (
                        <img src={msWordIcon} />
                      )}
                    </div>
                    <div className="col-6 row justify">
                      <div>
                        <h4>{document.fileName}</h4>
                        <p className="text-body-secondary">
                          {document.lastShared &&
                            new Date(document.lastShared).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                        </p>
                        Shared with:
                        {document.usersSharedWith.map((user, index) => (
                          <Tag key={index}>
                            <label>{user.name ? user.email : user.name}</label>
                          </Tag>
                        ))}
                      </div>

                      {document.requireSigning ? (
                        <p className="text-danger">Requires Signing</p>
                      ) : document.signatureStatus === 0 ? (
                        <p className="text-danger">Pending Signatures </p>
                      ) : (
                        <p className="text-primary">Signatures Completed </p>
                      )}
                    </div>
                  </div>
                </Card>
              </>
            );
          })}
        </>
      )}
    </>
  );
}
