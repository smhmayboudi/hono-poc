import { hc } from "hono/client";
import { useState } from "hono/jsx";
import { render } from "hono/jsx/dom";

import type { AppType } from ".";

const client = hc<AppType>("/");

// eslint-disable-next-line sonarjs/function-return-type
const ClockButton = () => {
  const [response, setResponse] = useState<string | null>(null);
  const handleClick = async () => {
    const response = await client.api.clock.$get();
    const data = await response.json();
    const headers = Array.from(response.headers.entries()).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      acc[key] = value;

      return acc;
    }, {});
    const fullResponse = {
      url: response.url,
      status: response.status,
      headers,
      body: data,
    };
    setResponse(JSON.stringify(fullResponse, null, 2));
  };

  return (
    <>
      <button onClick={handleClick} type="button">
        Get Server Time
      </button>
      {response && <pre>{response}</pre>}
    </>
  );
};

// eslint-disable-next-line sonarjs/function-return-type
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)} type="button">
        You clicked me {count} times
      </button>
    </>
  );
};

export const App = () => (
  <>
    <h1>Hello hono/jsx/dom</h1>
    <h2>Example of useState()</h2>
    <Counter />
    <h2>Example of API fetch()</h2>
    <ClockButton />
  </>
);

render(<App />, document.getElementById("root")!);
