import { connectToDatabase, getDataById } from "../../../helpers/db-util";
import { ObjectId } from "mongodb";
import { useRef } from "react";

export default function DataArrayPage(props) {
  const { _id, input, text, finalArray } = JSON.parse(props.dataArray);
  const dataId = props.dataId;
  const enteredInputData = useRef();
  const enteredTextData = useRef();

  async function submitHandler(event) {
    event.preventDefault();

    const newArrayData = {
      input: enteredInputData.current.value,
      text: enteredTextData.current.value,
      _id,
    };

    try {
      await fetch(`/api/data/${dataId}/${_id}`, {
        method: "PUT",
        body: JSON.stringify(newArrayData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.error(error);
    }

    enteredInputData.current.value = "";
    enteredTextData.current.value = "";
  }

  return (
    <div>
      {" "}
      here
      <p>{_id}</p>
      <p>{input}</p>
      <p>{text}</p>
      <p>{finalArray}</p>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="input">input for final array</label>
          <input type="input" id="input" ref={enteredInputData} />
        </div>
        <div>
          <label htmlFor="text">text for final array</label>
          <input type="text" id="text" ref={enteredTextData} />
        </div>
        <button>add to final array</button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const dataArrayId = context.params.dataArray;
  const dataId = context.params.dataId;

  const findData = {
    dataArray: { $elemMatch: { _id: ObjectId(dataArrayId) } },
  };

  let client;
  try {
    client = await connectToDatabase();
    let result = await getDataById(client, "data", findData);
    let data = result[0].dataArray.find(
      (data) => data._id.toString() === dataArrayId
    );
    return {
      props: {
        dataArray: JSON.stringify(data),
        dataId: dataId,
      },
    };
  } catch (error) {}
}
