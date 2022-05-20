import { ObjectId } from "mongodb";
import { useRef } from "react";
import {
  connectToDatabase,
  getDataById,
  getAllDataIds,
} from "../../helpers/db-util";

import Link from "next/link";

export default function DataPage(props) {
  const [{ _id, text, input, dataArray }] = props.data;

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
      await fetch(`/api/data/${_id}`, {
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
      <div>
        <h1>here is a specific data page</h1>
        <p>{_id}</p>
        <p>{text}</p>
        <p>{input}</p>
        <ul>
          {dataArray.map((data) => (
            <li key={data._id}>
              <p>{data._id}</p>
              <p>{data.input}</p>
              <p>{data.text}</p>
              <p>{data.finalArray}</p>
              <Link href={`/${_id}/${data._id}`}>
                <button>Go to dataArray Page</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="input">Add input to data array</label>
            <input type="text" id="input" ref={enteredInputData} />
          </div>
          <div>
            <label htmlFor="text">Add some text to add to data array</label>
            <input type="text" id="text" ref={enteredTextData} />
          </div>
          <button>Add</button>
        </form>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  const dataId = context.params.dataId;
  let client;
  try {
    client = await connectToDatabase();
    const data = await getDataById(client, "data", { _id: ObjectId(dataId) });
    if (!data) {
      return { notFound: true };
    }
    client.close();
    return {
      props: {
        data: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (error) {
    client.close();
    return;
  }
}

export async function getStaticPaths() {
  let client;

  try {
    client = await connectToDatabase();
    const result = await getAllDataIds(client, "data");
    const dataIds = JSON.parse(JSON.stringify(result));
    const paths = dataIds.map((id) => ({ params: { dataId: id } }));
    client.close();
    return {
      paths: paths,
      fallback: "blocking",
    };
  } catch (error) {
    client.close();
    return;
  }
}
