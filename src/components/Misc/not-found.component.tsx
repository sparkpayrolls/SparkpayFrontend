export const NotFound = (props: { message: string }) => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="deco-404">
          <h3 className="deco-404__text">Oops! not found</h3>
          <h1 className="deco-404__deco">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>
        </div>
        <h2 className="not-found__content__message">{props.message}</h2>
      </div>
    </div>
  );
};
