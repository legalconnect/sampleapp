import { CSSProperties } from "react";

type Props = {
  title: string;
  price: number;
  color?: string;
  item1?: string;
  item2?: string;
  item3?: string;
  item4?: string;
};
const PackageCard = (props: Props) => {
  const { title, price, color, item1, item2, item3, item4 } = props;
  const rootStyle: CSSProperties = {
    backgroundColor: color,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };
  const titleStyles: CSSProperties = {
    padding: "10px",
    paddingTop: "25px",
    height: "40%",
    textAlign: "center",
    alignContent: "center",
  };

  const detailsStyles: CSSProperties = {
    backgroundColor: "white",
    margin: "3px",
    flexGrow: 1,
    height: "60%",
    padding: "40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  };

  const packageTitleStyles: CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: 300,
    fontFamily: "sans-serif",
    textTransform: "uppercase",
    letterSpacing: "2px",
    margin: 0,
  };

  const packagePriceStyles = {
    fontSize: "3.75rem",
    fontWeight: 600,
    fontFamily: "Roboto",
    margin: 0,
  }

  return (
    <>
      <div className="col-4 p-1 h-100">
        <div style={rootStyle}>
          <div style={titleStyles}>
            <p style={packageTitleStyles}>{title}</p>
            <p style={packagePriceStyles}>₦ {price}</p>
          </div>
          <div style={detailsStyles}>
            <p>{item1}</p>
            <p>{item2}</p>
            <p>{item3}</p>
            <p>{item4}</p>
            <button
              className="btn btn-outline-warning"
              style={{ letterSpacing: "2px" }}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PackageCard;
