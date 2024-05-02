import PackageCard from "../components/PackageCard";

export default function Home() {
  return (
    <>
      <p style={{ margin: "15%" }}>
        Legal Connect is a marketplace that provides legal services. By
        connecting clients with lawyers directly, we eliminate the complexity
        and expense of traditional legal services. With us, you can get the help
        you need without having to worry about all the paperwork involved in
        finding a lawyer—just ask for help!
      </p>
      <PackageCard
        title="STANDARD"
        price={59}
        color="#ccbaa9"
        item1="10 full user"
        item2="2,000 Email Previews"
        item3="10 contacts per client"
        item4="10 coffee cups"
      ></PackageCard>
    </>
  );
}
