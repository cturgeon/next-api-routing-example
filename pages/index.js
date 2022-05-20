import Head from "next/head";
import styles from "../styles/Home.module.css";

import { useRef } from "react";
import { connectToDatabase, getAllData } from "../helpers/db-util";
import Link from "next/link";

export default function Home(props) {
  const inputData = useRef();
  const textData = useRef();
  const { dataFromDB } = props;

  // const arrayData = [];
  // dataFromDB.dataArray.map((data) => arrayData.push(JSON.parse(data)));

  // completed
  async function submitHandler(event) {
    event.preventDefault();

    const addedData = {
      input: inputData.current.value,
      text: textData.current.value,
    };

    // some validation would go here

    await fetch("/api/data", {
      method: "POST",
      body: JSON.stringify(addedData),
      headers: {
        "Content-type": "application/json",
      },
    });

    inputData.current.value = "";
    textData.current.value = "";
  }

  // on mount, collect the data from our DB
  // however, this does not prerender the data
  // using getStaticProps essentially does this, but with prerendering!
  // useEffect(() => {
  //   fetch("/api/data")
  //     .then((res) => res.json())
  //     .then((data) => setDataFromDB(data.resultData));
  // }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>API Routing Example</title>
        <meta
          name="description"
          content="Getting practice with routing and DB usage"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Create some data</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="input">Add some input</label>
          <input type="text" id="input" ref={inputData} />
        </div>
        <div>
          <label htmlFor="text">Add some text</label>
          <input type="text" id="text" ref={textData} />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>

      <h3>See specific data page below</h3>
      <ul>
        {dataFromDB.map((data) => (
          <li key={data._id}>
            <p>{data.input}</p>
            <p>{data.text}</p>
            <ul>
              {data.dataArray.map((arrayData) => (
                <li key={arrayData._id}>
                  <p>{arrayData._id}</p>
                </li>
              ))}
            </ul>
            <Link href={`/${data._id}`}>
              <button>Go to specific data page</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  let client;
  try {
    client = await connectToDatabase();
    const dataFromDB = await getAllData(client, "data");
    return {
      props: {
        dataFromDB: JSON.parse(JSON.stringify(dataFromDB)),
      },
    };
  } catch (error) {
    console.error(error);
    return;
  }
}
