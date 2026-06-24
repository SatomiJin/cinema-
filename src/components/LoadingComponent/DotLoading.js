import "./DotLoading.scss";
function DotLoading() {
  return (
    <div className="dot-loading_container">
      <div className="dot-loader"></div>
      <span className="dot-loader__text">Đang tải...</span>
    </div>
  );
}

export default DotLoading;
