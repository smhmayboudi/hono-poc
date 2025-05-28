import { href, NavLink } from "react-router";

export const images = [
  "https://remix.run/blog-images/headers/the-future-is-now.jpg",
  "https://remix.run/blog-images/headers/waterfall.jpg",
  "https://remix.run/blog-images/headers/webpack.png",
  // ... more images ...
];

export default () => (
  <>
    <div className="image-list">
      <h1>Image List</h1>
      <div>
        {images.map((src, idx) => (
          <NavLink
            key={idx}
            to={href("/image/details/:id", { id: idx.toString() })}
            viewTransition
          >
            {({ isTransitioning }) => (
              <>
                <p
                  style={{
                    viewTransitionName: isTransitioning
                      ? "image-title"
                      : "none",
                  }}
                >
                  Image Number {idx}
                </p>
                <img
                  alt=""
                  src={src}
                  style={{
                    viewTransitionName: isTransitioning
                      ? "image-expand"
                      : "none",
                  }}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  </>
);
