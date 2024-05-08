import { Modal } from "react-bootstrap";

type Props = {
  shouldShowModal: boolean;
  onHide: () => void;
  text?: string;
};
const LoadingModal = (props: Props) => (
  <div className="align-items-center">
    <Modal
      show={props.shouldShowModal}
      onHide={props.onHide}
      centered
      size="sm"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <div className="text-center">
          {props?.text ? <p>{props.text}...</p> : <p>Loading...</p>}
        </div>
      </Modal.Body>
    </Modal>
  </div>
);
export default LoadingModal;
