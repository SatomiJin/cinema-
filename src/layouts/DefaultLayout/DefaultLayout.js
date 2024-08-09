import UserHeader from "../headers/userHeader/UserHeader";
import "./DefaultLayout.scss";

function DefaultLayout({ children }) {
  return (
    <div className="layout-container">
      <div className="header">
        <UserHeader />
      </div>
      <div className="children_container">{children}</div>
    </div>
  );
}

export default DefaultLayout;
