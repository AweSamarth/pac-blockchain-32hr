import { useQuery, gql } from "@appolo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(first: 5, where: { buyer: "0x00000000" }) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default function GraphExample() {
    const {loading, error,data} = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div>hi</div>
    )



}
