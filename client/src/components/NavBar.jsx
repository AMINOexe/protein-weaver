import React from "react";
import { Link } from "react-router-dom";
import { FaInfo, FaHome, FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Im500Px } from "react-icons/im";
import { SlShare } from "react-icons/sl";

export default function NavBar() {
  return (
    <div className="navbar">
      <h1 className="website-title">ProteinWeaver</h1>
      <ul className="navbar-menu">
        <li>
          <Link to={`/`}>
            <button className="navbar-menu-button">
              <IconContext.Provider
                value={{
                  size: "1.5em",
                }}
              >
                <FaHome />
              </IconContext.Provider>
              <div>Home</div>
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/query`}>
            <button className="navbar-menu-button">
              <IconContext.Provider
                value={{
                  size: "1.5em",
                }}
              >
                <FaSearch />
              </IconContext.Provider>
              <div>Query</div>
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/about`}>
            <button className="navbar-menu-button">
              <IconContext.Provider
                value={{
                  size: "1.5em",
                }}
              >
                <FaInfo />
              </IconContext.Provider>
              <div>About</div>
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/newpage`}>
            <button className="navbar-menu-button">
              <IconContext.Provider
                value={{
                  size: "1.5em",
                }}
              >
                <Im500Px />
              </IconContext.Provider>
              <div>New</div>
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/progo`}>
            <button className="navbar-menu-button">
              <IconContext.Provider
                value={{
                  size: "1.5em",
                }}
              >
                <SlShare />
              </IconContext.Provider>
              <div>ProGo</div>
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
