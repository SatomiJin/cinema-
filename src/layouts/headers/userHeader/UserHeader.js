import UserHeaderPc from "./PcTb/UserHeaderPc";
import UserHeaderMobile from "./Mobile/UserHeaderMobile";
import "./UserHeader.scss";
function UserHeader() {
  return (
    <div className="user-header">
      <div className="header-pc">
        <UserHeaderPc />
      </div>
      <div className="header-mobile">
        <UserHeaderMobile />
      </div>
    </div>
  );
}

export default UserHeader;
