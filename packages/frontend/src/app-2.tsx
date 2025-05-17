import { css, keyframes, Style, viewTransition } from "hono/css";
import { useState, useViewTransition } from "hono/jsx";
import { render } from "hono/jsx/dom";

const rotate = keyframes`
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
`;

// eslint-disable-next-line sonarjs/function-return-type
const App = () => {
  const [isUpdating, startViewTransition] = useViewTransition();
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [transitionNameClass] = useState(() =>
    viewTransition(css`
      ::view-transition-old() {
        animation-name: ${rotate};
      }
      ::view-transition-new() {
        animation-name: ${rotate};
      }
    `),
  );
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() => setShowLargeImage((state) => !state))
        }
      >
        Click!
      </button>
      <div>
        {!showLargeImage ? (
          <img src="https://hono.dev/images/logo.png" />
        ) : (
          <div
            class={css`
              ${transitionNameClass}
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
              position: relative;
              ${isUpdating &&
              css`
                &:before {
                  content: "Loading...";
                  position: absolute;
                  top: 50%;
                  left: 50%;
                }
              `}
            `}
          ></div>
        )}
      </div>
    </>
  );
};

render(<App />, document.getElementById("root")!);
