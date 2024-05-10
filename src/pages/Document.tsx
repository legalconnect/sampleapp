import { useDocuments } from "../hooks/useDocuments";
import { Card, Modal } from "react-bootstrap";
import pdfIcon from "../../src/assets/pdf.svg";
import msWordIcon from "../../src/assets/ms-word.svg";
import { Tag } from "rsuite";
import { useState } from "react";
import { DocumentsService } from "../services";
import { useNavigate } from "react-router-dom";
import { CloseIcon, DownloadIcon } from "../components/SVG";
import LoadingModal from "../components/LoadingModal";

type DocumentState = {
  shouldShowModal?: Boolean;
  selectedFile?: File;
  isFilesUploaded?: Boolean;
  uploadedFileId?: string | null;
  recipients?: {
    id: number;
    email?: string;
    name?: string;
  }[];
  isLoading?: Boolean;
  loadingText?: string;
};
export default function DocumentPage() {
  const navigate = useNavigate();
  const { data: documents, isLoading } = useDocuments();

  const [mainState, setState] = useState<DocumentState>();
  const showLoading = (text?: string) => {
    setState((prev) => ({ ...prev, isLoading: true, loadingText: text }));
  };
  const hideLoading = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  };
  const handleFileSelectButtonClick = () => {
    // Create a temporary input element
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;

    // Trigger a click event on the input element
    input.click();

    // Remove the input element from the DOM after the file has been selected
    input.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files; // Array of selected files

      const filesArray = files ? Array.from(files) : [];
      if (!filesArray.length) return;

      const selectedFile = filesArray[0];
      setState((prev) => ({ ...prev, selectedFile }));
      input.remove();
    });
  };

  const handleFileUploadButtonClick = async () => {
    if (!mainState?.selectedFile) {
      hideLoading();
      return;
    }

    const { result: files } = await DocumentsService.postApiV1DocumentsSave({
      formData: {
        files: [mainState.selectedFile],
      },
    });

    if (files?.length === 0) {
      hideLoading();
      return;
    }

    setState((prev) => ({
      ...prev,
      isFilesUploaded: true,
      uploadedFileId: files?.length ? files[0].fileId : undefined,
    }));

    hideLoading();
  };

  const requestSignatureClaim = async () => {
    const response =
      await DocumentsService.postApiV1DocumentsEmbeddedSignatureRequest({
        requestBody: {
          fileId: mainState?.uploadedFileId,
          recipients: mainState?.recipients?.map((m) => ({
            email: m.email!,
            name: m.name,
          })),
          expiresOn: null,
          signByUltimatum: null,
          redirectUrl: "http://localhost:3003/documents",
          linkExpiration: 10,
        },
      });

    if (response.result?.claimUrl) {
      hideLoading();
      setState({ shouldShowModal: false });
      window.location.href = response.result.claimUrl;
    }
    hideLoading();
  };

  const DocumentSigningFlow_Modal = () => {
    return (
      <div className="align-items-center">
        <Modal
          show={Boolean(mainState?.shouldShowModal)}
          onHide={() =>
            setState((prev) => ({ ...prev, shouldShowModal: false }))
          }
          centered
          size="lg"
        >
          <Modal.Header className="text-">
            Submit Document for Signing
          </Modal.Header>
          <Modal.Body>
            <>
              <div>
                <div>
                  <b>Select Document</b>
                </div>
                <div>
                  {mainState?.selectedFile &&
                    (mainState.isFilesUploaded ? (
                      <Tag size="lg" style={{ cursor: "pointer" }}>
                        <label
                          style={{ cursor: "pointer" }}
                          title={mainState.selectedFile.name}
                        >
                          {mainState.selectedFile.name}
                        </label>
                      </Tag>
                    ) : (
                      <Tag
                        size="lg"
                        style={{ cursor: "pointer" }}
                        closable
                        onClose={() =>
                          setState((prev) => ({
                            ...prev,
                            selectedFile: undefined,
                          }))
                        }
                      >
                        <label
                          style={{ cursor: "pointer" }}
                          title={mainState.selectedFile.name}
                        >
                          {mainState.selectedFile.name}
                        </label>
                      </Tag>
                    ))}
                </div>
                {mainState?.selectedFile ? (
                  <button
                    disabled={mainState.isFilesUploaded ? true : false}
                    className="btn btn-outline-warning"
                    onClick={() => {
                      showLoading("Uploading file...");
                      handleFileUploadButtonClick();
                    }}
                  >
                    Upload Document
                  </button>
                ) : (
                  <button
                    disabled={mainState?.isFilesUploaded ? true : false}
                    className="btn btn-outline-warning"
                    onClick={handleFileSelectButtonClick}
                  >
                    Select Document(.pfd or .docx)
                  </button>
                )}
              </div>
              <hr></hr>
              {mainState?.isFilesUploaded && (
                <>
                  <p>Specify Recipients</p>
                  {mainState?.recipients?.map((recipient) => {
                    return (
                      <div className="input-group mb-2">
                        <input
                          name="recipients"
                          className="form-control"
                          value={recipient.email}
                          placeholder="Enter email"
                          onChange={(e) => {
                            const email = e.target.value;
                            setState((prev) => ({
                              ...prev,
                              recipients: prev?.recipients?.map((r) =>
                                r.id === recipient.id
                                  ? { ...r, email: email }
                                  : r
                              ),
                            }));
                          }}
                        />
                        <span
                          style={{ cursor: "pointer" }}
                          className="input-group-text"
                          onClick={() => {
                            if (mainState.recipients?.length === 1) return;
                            setState((prev) => ({
                              ...prev,
                              recipients: prev?.recipients?.filter(
                                (r) => r.id !== recipient.id
                              ),
                            }));
                          }}
                        >
                          <CloseIcon />
                        </span>
                      </div>
                    );
                  })}
                  <button
                    className="btn btn-outline-warning mt-3"
                    onClick={(e) => {
                      e.preventDefault();
                      setState((prev) => {
                        if (prev?.recipients?.length) {
                          const lastRecipientIndex: number =
                            prev.recipients.length - 1;
                          const lastRecipient =
                            prev.recipients[lastRecipientIndex];
                          if (lastRecipient && lastRecipient.email !== "") {
                            prev.recipients.push({
                              id: (lastRecipient.id ? lastRecipient.id : 0) + 1,
                              email: "",
                            });
                          }
                        }
                        return { ...prev, recipients: prev?.recipients };
                      });
                    }}
                  >
                    Add Recipient
                  </button>
                </>
              )}
            </>
          </Modal.Body>
          <Modal.Footer>
            <button
              disabled={
                mainState?.isFilesUploaded && mainState.recipients?.length
                  ? false
                  : true
              }
              className="btn btn-warning"
              style={{ color: "white" }}
              onClick={async () => {
                setState((prev) => ({
                  ...prev,
                  shouldShowAppointmentForm: false,
                }));
                showLoading("Requesting Signature Claim");
                await requestSignatureClaim();
              }}
            >
              Proceed
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
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
          onClick={() =>
            setState({
              shouldShowModal: true,
              recipients: [
                {
                  id: 1,
                },
              ],
            })
          }
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
                    <div className="col-10 row justify">
                      <div className="align-items-start">
                        <h4>{document.fileName}</h4>
                        <a download href={document.fileUrl}>
                          <DownloadIcon className="float-end" />
                        </a>
                      </div>
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
                      <div>
                        Shared with:
                        {document.usersSharedWith?.map((user, index) => (
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
      {DocumentSigningFlow_Modal()}

      {LoadingModal({
        shouldShowModal: mainState?.isLoading ? true : false,
        text: mainState?.loadingText,
        onHide: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
        },
      })}
    </>
  );
}
