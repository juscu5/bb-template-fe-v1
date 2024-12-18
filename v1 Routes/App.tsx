import React from "react";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Outlet />
    </div>
  );
};

export default App;
