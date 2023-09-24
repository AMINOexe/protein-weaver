import React from "react";
import MainLayout from "../layout/MainLayout";
import FlyQuery from "../components/FlyQuery.jsx";

export default function FlyBasePage() {
    return (
        <div>
          <MainLayout>
            <div className="main-layout-body">
              <h2>Query FlyBase</h2>
              <FlyQuery />
            </div>
          </MainLayout>
        </div>
      );
}