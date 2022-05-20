import { connectToDatabase, getDataById } from "../../../helpers/db-util";

export default function DataArrayPage(props) {
  const { _id, input, text, finalArray } = props;
  return <div></div>;
}

export async function getServerSideProps(context) {
  const dataId = context.params.dataId;
  const dataArrayId = context.params.dataArray;

  let client;
  try {
    client = await connectToDatabase();
    const result = await getDataById(client, "data", { _id: ObjectId(dataId) });
    console.log(result);
    const dataArray = result.find((data) => data._id === dataArrayId);
    return {
      props: {
        dataArray: dataArray,
      },
    };
  } catch (error) {}
}
