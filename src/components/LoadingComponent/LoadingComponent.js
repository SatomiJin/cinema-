import "./LoadingComponent.scss";
function LoadingComponent() {
  return (
    <div className="loading_container">
      <div className="loader">
        <span className="loader__dot"></span>
        <span className="loader__dot"></span>
        <span className="loader__dot"></span>
      </div>
    </div>
  );
}

export default LoadingComponent;
